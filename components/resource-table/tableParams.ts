import type { SortEntry, SortDirection } from "./columns";

// ---------------------------------------------------------------------------
// Column‑visibility / order param  (`cols=name,gender,height`)
// ---------------------------------------------------------------------------

/**
 * Parse the `cols` search param into an ordered list of column IDs.
 * Returns `null` when the param is absent or empty (meaning "show all in
 * default order").
 */
export function parseColumnsParam(param: string | null): string[] | null {
  if (param == null || param === "") return null;
  const ids = param
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return ids.length > 0 ? ids : null;
}

/**
 * Serialise an ordered list of visible column IDs into a search‑param value.
 * Returns `null` when the value represents the default (all columns) so the
 * param can be omitted from the URL.
 */
export function serializeColumnsParam(ids: string[] | null): string | null {
  if (ids == null || ids.length === 0) return null;
  return ids.join(",");
}

// ---------------------------------------------------------------------------
// Sort param  (`sort=name,-height`)
//
// Convention: bare id → ascending, `-`‑prefixed id → descending.
// ---------------------------------------------------------------------------

/**
 * Parse the `sort` search param into `SortEntry[]`.
 * Returns an empty array when the param is absent or empty.
 */
export function parseSortParam(param: string | null): SortEntry[] {
  if (param == null || param === "") return [];
  return param
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((token): SortEntry => {
      if (token.startsWith("-")) {
        return { columnId: token.slice(1), direction: "desc" as SortDirection };
      }
      return { columnId: token, direction: "asc" as SortDirection };
    });
}

/**
 * Serialise `SortEntry[]` into a search‑param value.
 * Returns `null` when there are no sort entries so the param can be omitted.
 */
export function serializeSortParam(entries: SortEntry[]): string | null {
  if (entries.length === 0) return null;
  return entries
    .map((e) => (e.direction === "desc" ? `-${e.columnId}` : e.columnId))
    .join(",");
}

// ---------------------------------------------------------------------------
// Helpers for building prefixed param names
// ---------------------------------------------------------------------------

/** Return the URL‑param name, optionally prefixed (`prefix.name`). */
export function paramName(base: "cols" | "sort", prefix?: string): string {
  return prefix ? `${prefix}.${base}` : base;
}
