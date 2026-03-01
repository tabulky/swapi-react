import type { ColumnDef, SortEntry, SortValue } from "./columns";

/**
 * Compare two `SortValue`s.
 *
 * Rules:
 * - `null` always sorts **last** regardless of direction.
 * - Numbers compare numerically.
 * - Strings compare via `localeCompare` (case-insensitive).
 * - Mixed number/string: numbers sort before strings.
 *
 * Returns negative / zero / positive like `Array.prototype.sort` expects.
 */
function compareSortValues(a: SortValue, b: SortValue): number {
  // Both null → equal
  if (a === null && b === null) return 0;
  // Null always last (regardless of asc/desc — caller inverts for direction)
  if (a === null) return 1;
  if (b === null) return -1;

  // Same type fast-paths
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "string" && typeof b === "string")
    return a.localeCompare(b, undefined, { sensitivity: "base" });

  // Mixed: numbers before strings
  if (typeof a === "number") return -1;
  return 1;
}

/**
 * Sort `data` by a multi-column sort specification.
 *
 * Columns are resolved by `id` from the provided `columns` array.
 * Unknown column IDs or non-sortable columns in `sortEntries` are silently
 * skipped (defensive against stale URL params).
 *
 * Returns a **new array** — the input is never mutated.
 */
export function sortData<T>(
  data: readonly T[],
  columns: readonly ColumnDef<T>[],
  sortEntries: readonly SortEntry[],
): T[] {
  if (sortEntries.length === 0) return data.slice();

  // Pre-resolve columns & accessors for the active sort entries
  const resolvedEntries = sortEntries
    .map((entry) => {
      const col = columns.find((c) => c.id === entry.columnId);
      if (!col || !col.sortable) return null;
      return {
        getSortValue: col.getSortValue,
        direction: entry.direction,
      };
    })
    .filter(
      (
        e,
      ): e is {
        getSortValue: (item: T) => SortValue;
        direction: "asc" | "desc";
      } => e !== null,
    );

  if (resolvedEntries.length === 0) return data.slice();

  return data.slice().sort((a, b) => {
    for (const { getSortValue, direction } of resolvedEntries) {
      const va = getSortValue(a);
      const vb = getSortValue(b);
      let cmp = compareSortValues(va, vb);

      // Null-last is absolute (not flipped by direction).
      // Only flip non-null comparisons.
      if (cmp !== 0) {
        const aNull = va === null;
        const bNull = vb === null;
        if (!aNull && !bNull && direction === "desc") {
          cmp = -cmp;
        }
        return cmp;
      }
    }
    return 0;
  });
}
