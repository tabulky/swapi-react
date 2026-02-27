// ---------------------------------------------------------------------------
// Public types — safe for both server and client
// ---------------------------------------------------------------------------

/**
 * Lifecycle state of a single fetched resource.
 *
 * - `success`: fresh data is available.
 * - `loading`: a fetch is in-flight; data may be available but not fresh.
 * - `error`: the last fetch failed; prior data may be available but not fresh.
 * - `stale`: data may be available but not fresh. Nothing is in-flight.
 *
 * */
export type ResourceFetchState = "stale" | "loading" | "success" | "error";

/**
 * Validates and narrows the raw `unknown` payload returned by `fetch`.
 * Throwing inside the parser surfaces as `{ state: "error" }` in the store.
 */
export type ResourceParser<T> = (raw: unknown) => T;

/**
 * What {@link useResource} returns to components.
 *
 * @typeParam T - Parsed data type (inferred from the parser).
 */
export type ResourceItem<T = unknown> = {
  readonly data: T | null;
  readonly error: { message: string } | null;
  readonly state: ResourceFetchState;
};

/**
 * What {@link useResource} returns to components.
 * Extends {@link ResourceItem} with a `refetch` function.
 *
 * @typeParam T - Parsed data type (inferred from the parser).
 */
export type UseResourceResult<T = unknown> = ResourceItem<T> & {
  /**
   * Triggers a refetch of the resource. If `force` is `true`, any pending fetch will be aborted before starting a new one.
   * Calling `refetch` while a fetch is already in-flight will do nothing, unless `force` is set to `true`.
   * @param force When current pendig fetch should be aborted
   * @returns
   */
  readonly refetch: (force?: boolean) => void;
};

/**
 * A bound pairing of URL (or URL factory) and parser.
 * Created with {@link defineResource} — never construct manually.
 *
 * @typeParam T    - Parsed data type.
 * @typeParam Args - Arguments forwarded to the URL factory (empty tuple for static URLs).
 */
export type ResourceDefinition<T, Args extends unknown[] = []> = {
  readonly url: string | ((...args: Args) => string | null);
  readonly parse: ResourceParser<T>;
};
