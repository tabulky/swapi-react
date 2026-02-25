"use client";

import { useEffect } from "react";
import {
  createStoreProvider,
  type Action,
  type Reducer,
} from "../store/createStoreProvider";
import type { ResourceDefinition, ResourceItem } from "./types";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Return value of {@link createFetchStore}.
 */
export type FetchStore = {
  /** Wrap your component tree to make the fetch store available. */
  FetchProvider: React.FC<{ children: React.ReactNode }>;

  /**
   * Fetches, caches, and subscribes to a resource.
   * Multiple consumers of the same resolved URL share a single fetch.
   *
   * @throws If called outside of `<FetchProvider>`.
   */
  useResource: {
    <T>(def: ResourceDefinition<T, []>): ResourceItem<T>;
    <T, Args extends unknown[]>(
      def: ResourceDefinition<T, Args>,
      ...args: Args
    ): ResourceItem<T>;
  };
};

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

/**
 * Symbol key for fetch engine metadata.
 * Hidden from JSON.stringify, Object.keys, and casual enumeration.
 * @access private
 */
const fetchMeta = Symbol("fetchMeta");

/** Fetch engine bookkeeping — invisible to React and serialisation. */
type FetchMetadata = {
  promise: Promise<void> | null;
  abortController: AbortController | null;
  pendingCount: number;
};

/** Internal store item with the symbol-keyed metadata. */
type InternalResourceItem = ResourceItem & {
  [fetchMeta]?: FetchMetadata;
};

type ResourceStore = Record<string, InternalResourceItem>;

type ResourceAction = Action &
  (
    | { type: "FETCH_START"; url: string }
    | { type: "FETCH_SUCCESS"; url: string; data: unknown }
    | { type: "FETCH_ERROR"; url: string; error: Error }
  );

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Shared sentinel — stable reference for URLs not yet in the store. */
const STALE_ITEM: ResourceItem = { data: null, error: null, state: "stale" };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the metadata for a store item, creating it if absent. */
const ensureMeta = (item: InternalResourceItem): FetchMetadata => {
  if (!item[fetchMeta]) {
    item[fetchMeta] = { promise: null, abortController: null, pendingCount: 0 };
  }
  return item[fetchMeta];
};

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

const reducer: Reducer<ResourceStore, ResourceAction> = (state, action) => {
  const prev = state[action.url] ?? STALE_ITEM;

  switch (action.type) {
    case "FETCH_START":
      // Spread prev to preserve `data` from a prior success (stale-while-revalidate)
      // and the symbol-keyed metadata.
      return {
        ...state,
        [action.url]: { ...prev, state: "loading" as const, error: null },
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        [action.url]: {
          ...prev,
          data: action.data,
          error: null,
          state: "success" as const,
        },
      };
    case "FETCH_ERROR":
      // Spread prev to preserve `data` — consumers can show stale data alongside the error.
      return {
        ...state,
        [action.url]: { ...prev, state: "error" as const, error: action.error },
      };
  }
};

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a self-contained fetch store: a React provider, a `useResource`
 * hook, and the internal machinery to deduplicate, cache, and abort fetches.
 *
 * @example
 * ```tsx
 * const { FetchProvider, useResource } = createFetchStore();
 *
 * function PlanetList() {
 *   const planets = useResource(PlanetsResource);
 *
 *   if (planets.state === "success") {
 *     return <ul>{planets.data.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
 *   }
 *   return <Spinner />;
 * }
 *
 * function App() {
 *   return (
 *     <FetchProvider>
 *       <PlanetList />
 *     </FetchProvider>
 *   );
 * }
 * ```
 */
export const createFetchStore = (): FetchStore => {
  const { Provider, useSelector, useDispatch, getState } = createStoreProvider<
    ResourceStore,
    ResourceAction
  >(reducer, {});

  function useResource<T>(def: ResourceDefinition<T, []>): ResourceItem<T>;
  function useResource<T, Args extends unknown[]>(
    def: ResourceDefinition<T, Args>,
    ...args: Args
  ): ResourceItem<T>;
  function useResource<T, Args extends unknown[]>(
    def: ResourceDefinition<T, Args>,
    ...args: Args
  ): ResourceItem<T> {
    const dispatch = useDispatch();
    const resolvedUrl =
      typeof def.url === "function" ? def.url(...args) : def.url;

    useEffect(() => {
      if (resolvedUrl === null) return;

      const current = getState()[resolvedUrl];

      // Already cached — just reference-count.
      // For "loading", also verify the fetch is still alive (abortController
      // exists).  After a Strict-Mode unmount→remount cycle the prior fetch
      // may have been aborted, leaving state "loading" with no active request.
      if (
        current?.state === "success" ||
        (current?.state === "loading" && ensureMeta(current).abortController)
      ) {
        const meta = ensureMeta(current);
        meta.pendingCount++;
        return () => {
          meta.pendingCount--;
        };
      }

      // Kick off a new fetch.
      dispatch({ type: "FETCH_START", url: resolvedUrl });

      // Re-read after dispatch — reducer created a new item.
      const entry = getState()[resolvedUrl] as InternalResourceItem;
      const meta = ensureMeta(entry);
      meta.pendingCount++;

      const controller = new AbortController();
      meta.abortController = controller;

      const promise = fetch(resolvedUrl, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
          return res.json();
        })
        .then((raw) => {
          dispatch({
            type: "FETCH_SUCCESS",
            url: resolvedUrl,
            data: def.parse(raw),
          });
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            dispatch({
              type: "FETCH_ERROR",
              url: resolvedUrl,
              error: err instanceof Error ? err : new Error(String(err)),
            });
          }
        })
        .finally(() => {
          meta.promise = null;
          meta.abortController = null;
        });

      meta.promise = promise;

      return () => {
        meta.pendingCount--;
        if (meta.pendingCount === 0 && meta.abortController) {
          meta.abortController.abort();
          meta.promise = null;
          meta.abortController = null;
        }
      };
    }, [resolvedUrl, dispatch, def]);

    return useSelector((s) =>
      resolvedUrl !== null
        ? ((s[resolvedUrl] ?? STALE_ITEM) as ResourceItem<T>)
        : (STALE_ITEM as ResourceItem<T>),
    );
  }

  return { FetchProvider: Provider, useResource };
};
