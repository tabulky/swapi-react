"use client";

import { useCallback, useState } from "react";

import type { ColumnDef, SortEntry } from "./types";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type SortState = {
  /** Active multi-column sort chain. */
  readonly sortEntries: SortEntry[];

  // — Mutators —

  /**
   * Toggle sorting on a column.
   *
   * - `multi=false` (default): replaces entire sort → cycles asc → desc → none.
   * - `multi=true`: adds/cycles/removes this column within the sort chain.
   */
  readonly toggleSort: (columnId: string, multi?: boolean) => void;
  /** Remove all sort entries. */
  readonly clearSort: () => void;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Manages sort state independently of data.
 *
 * Accepts the column definitions so it can guard against toggling
 * non-sortable columns.
 */
export function useSortState<T extends Record<string, unknown>>(
  columns: readonly ColumnDef<T>[],
): SortState {
  const [sortEntries, setSortEntries] = useState<SortEntry[]>([]);

  const toggleSort = useCallback(
    (columnId: string, multi = false) => {
      // Only allow toggling sortable columns
      const col = columns.find((c) => c.id === columnId);
      if (!col || !col.isSortable) return;

      setSortEntries((current) => {
        const existingIdx = current.findIndex((e) => e.columnId === columnId);

        if (multi) {
          // Multi-column: add / cycle / remove within chain
          if (existingIdx === -1) {
            return [...current, { columnId, direction: "asc" }];
          }
          if (current[existingIdx].direction === "asc") {
            return current.map((e, i) =>
              i === existingIdx ? { ...e, direction: "desc" as const } : e,
            );
          }
          // Was desc → remove
          return current.filter((_, i) => i !== existingIdx);
        }

        // Single-column: replace entire sort
        if (existingIdx === -1) {
          return [{ columnId, direction: "asc" }];
        }
        if (current[existingIdx].direction === "asc") {
          return [{ columnId, direction: "desc" }];
        }
        return []; // Was desc → clear
      });
    },
    [columns],
  );

  const clearSort = useCallback(() => {
    setSortEntries([]);
  }, []);

  return { sortEntries, toggleSort, clearSort };
}
