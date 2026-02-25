"use client";

import { useCallback, useEffect } from "react";
import {
  createStoreProvider,
  type Action,
  type Reducer,
} from "../store/createStoreProvider";
import type {
  ResourceDefinition,
  ResourceItem,
  UseResourceResult,
} from "./types";

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
   * `def` must be a **stable reference** (e.g. a module-level constant created
   * with {@link defineResource}). An unstable `def` (recreated on every render)
   * will cancel and restart the fetch on every render.
   *
   * @throws If called outside of `<FetchProvider>`.
   */
  useResource: {
    <T>(def: ResourceDefinition<T, []>): UseResourceResult<T>;
    <T, Args extends unknown[]>(
      def: ResourceDefinition<T, Args>,
      ...args: Args
    ): UseResourceResult<T>;
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
    | { type: "FETCH_REFETCH"; url: string }
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
    case "FETCH_REFETCH":
      // Clear error, preserve data (stale-while-revalidate), reset to stale.
      // Does not touch pendingCount or abort controllers.
      return {
        ...state,
        [action.url]: { ...prev, error: null, state: "stale" as const },
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

  /**
   * Dispatches FETCH_START and kicks off a fetch for the given URL.
   * Manages the AbortController and promise on the entry's metadata.
   * Does **not** touch `pendingCount` — callers are responsible for that.
   */
  const startFetch = (
    url: string,
    parse: (raw: unknown) => unknown,
    dispatch: (action: ResourceAction) => void,
  ): void => {
    dispatch({ type: "FETCH_START", url });

    // Re-read after dispatch — reducer created a new item.
    const entry = getState()[url] as InternalResourceItem;
    const meta = ensureMeta(entry);

    const controller = new AbortController();
    meta.abortController = controller;

    const promise = fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((raw) => {
        dispatch({ type: "FETCH_SUCCESS", url, data: parse(raw) });
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          dispatch({
            type: "FETCH_ERROR",
            url,
            error: err instanceof Error ? err : new Error(String(err)),
          });
        }
      })
      .finally(() => {
        meta.promise = null;
        meta.abortController = null;
      });

    meta.promise = promise;
  };

  function useResource<T>(
    def: ResourceDefinition<T, []>,
  ): UseResourceResult<T>;
  function useResource<T, Args extends unknown[]>(
    def: ResourceDefinition<T, Args>,
    ...args: Args
  ): UseResourceResult<T>;
  function useResource<T, Args extends unknown[]>(
    def: ResourceDefinition<T, Args>,
    ...args: Args
  ): UseResourceResult<T> {
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
      startFetch(resolvedUrl, def.parse, dispatch);

      // Re-read after dispatch — startFetch created a new item.
      const entry = getState()[resolvedUrl] as InternalResourceItem;
      const meta = ensureMeta(entry);
      meta.pendingCount++;

      return () => {
        meta.pendingCount--;
        if (meta.pendingCount === 0 && meta.abortController) {
          meta.abortController.abort();
          meta.promise = null;
          meta.abortController = null;
        }
      };
    }, [resolvedUrl, dispatch, def]);

    const refetch = useCallback(() => {
      if (resolvedUrl === null) return;
      // No-op if a request is already in flight.
      const current = getState()[resolvedUrl];
      if (current) {
        const meta = ensureMeta(current);
        if (meta.abortController) return;
      }
      dispatch({ type: "FETCH_REFETCH", url: resolvedUrl });
      startFetch(resolvedUrl, def.parse, dispatch);
    }, [resolvedUrl, dispatch, def]);

    const item = useSelector((s) =>
      resolvedUrl !== null
        ? ((s[resolvedUrl] ?? STALE_ITEM) as ResourceItem<T>)
        : (STALE_ITEM as ResourceItem<T>),
    );

    return { ...item, refetch };
  }

  return { FetchProvider: Provider, useResource };
};
