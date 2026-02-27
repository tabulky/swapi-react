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
  requestPromise: Promise<unknown> | null;
  abortController: AbortController | null;
};

/** Internal store item with the symbol-keyed metadata. */
type InternalResourceItem = ResourceItem & {
  [fetchMeta]?: FetchMetadata;
};

type ResourceStore = Record<string, InternalResourceItem>;

type ResourceAction = Action &
  (
    | { type: "FETCH_REQUEST"; url: string }
    | { type: "FETCH_START"; url: string }
    | { type: "FETCH_SUCCESS"; url: string; data: unknown }
    | { type: "FETCH_ERROR"; url: string; error: { message: string } }
  );

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the metadata for a store item, creating it if absent. */
const ensureMeta = (item: InternalResourceItem): FetchMetadata =>
  (item[fetchMeta] ??= {
    requestPromise: null,
    abortController: null,
  });

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

const getItemInitialState = (): ResourceItem => ({
  data: null,
  error: null,
  state: "stale",
});

const STALE_ITEM: ResourceItem = getItemInitialState();

const reducer: Reducer<ResourceStore, ResourceAction> = (state, action) => {
  const prev = state[action.url] ?? getItemInitialState();

  // console.debug(`[FetchStore] ${action.type} ${action.url}`, { action, prev });

  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        [action.url]: prev,
      };
    case "FETCH_START":
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

  const startFetch = async (
    url: string,
    parse: (raw: unknown) => unknown,
    dispatch: (action: ResourceAction) => void,
    force: boolean = false,
  ): Promise<void> => {
    dispatch({ type: "FETCH_REQUEST", url });
    const entry = getState()[url] as InternalResourceItem;
    const meta = ensureMeta(entry);

    if (meta.requestPromise) {
      if (!force) {
        return;
      }
      meta.abortController?.abort();
    }

    dispatch({ type: "FETCH_START", url });
    let currentRequestPromise: Promise<unknown> | null = null;
    try {
      meta.abortController = new AbortController();
      const requestPromise = fetch(url, {
        signal: meta.abortController?.signal,
      });
      currentRequestPromise = requestPromise;
      meta.requestPromise = currentRequestPromise;

      const request = await requestPromise;
      if (!request.ok) {
        throw new Error(`${request.statusText} (HTTP ${request.status})`);
      }

      const rawData = await request.json();

      if (meta.requestPromise !== currentRequestPromise) {
        // console.debug(`[FetchStore] Ignoring data from stale fetch for ${url}`);
        return;
      }

      const data = parse(rawData);

      dispatch({ type: "FETCH_SUCCESS", url, data });
    } catch (err) {
      if (meta.requestPromise !== currentRequestPromise) {
        console.error(
          `[FetchStore] Ignoring error from stale fetch for ${url}:`,
          err,
        );
        return;
      }

      if (err instanceof Error) {
        if (err.name !== "AbortError") {
          dispatch({
            type: "FETCH_ERROR",
            url,
            error: { message: err.message },
          });
        }
      } else {
        // console.debug(`[FetchStore] Other fetch error for ${url}:`, err);
        dispatch({
          type: "FETCH_ERROR",
          url,
          error: { message: String(err) },
        });
      }
      return;
    } finally {
      if (meta.requestPromise === currentRequestPromise) {
        meta.requestPromise = null;
        meta.abortController = null;
      }
    }
  };

  function useResource<T>(def: ResourceDefinition<T, []>): UseResourceResult<T>;
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

    const refetch = useCallback(
      (force: boolean = false) => {
        if (resolvedUrl === null) return;
        startFetch(resolvedUrl, def.parse, dispatch, force);
      },
      [resolvedUrl, dispatch, def],
    );

    useEffect(() => {
      refetch(false);
    }, [refetch]);

    const item = useSelector((s) =>
      // it is important to not create new objects here
      resolvedUrl ? (s[resolvedUrl] as ResourceItem<T>) : null,
    );

    return { ...(item ?? (STALE_ITEM as ResourceItem<T>)), refetch };
  }

  return { FetchProvider: Provider, useResource };
};
