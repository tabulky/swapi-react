"use client";

import { useCallback, useMemo, useState } from "react";

import type { ColumnDef, SortEntry } from "./columns";
import { sortData } from "./sortData";

// ---------------------------------------------------------------------------
// Public return type
// ---------------------------------------------------------------------------

export type ColumnVisibility<T> = {
  readonly column: ColumnDef<T>;
  readonly visible: boolean;
};

export type TableState<T> = {
  /** Visible columns in their current display order. */
  readonly visibleColumns: ColumnDef<T>[];
  /** All columns with their visibility flag (for future settings UI). */
  readonly allColumns: ColumnVisibility<T>[];
  /** Active multi-column sort chain. */
  readonly sortEntries: SortEntry[];
  /** Sorted (or unsorted) data, or `null` when not yet loaded. */
  readonly sortedData: T[] | null;

  // — Mutators —

  /** Toggle a column's visibility on/off. */
  readonly toggleColumn: (columnId: string) => void;
  /** Replace the full column order (array of visible IDs). Pass `null` to reset to default. */
  readonly setColumnOrder: (orderedIds: string[] | null) => void;
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
 * Manages column visibility, order, and sort state via `localStorage`.
 *
 * Uses `useSyncExternalStore` so the server snapshot returns `null`
 * (= default columns, no sort), avoiding hydration mismatches.
 */
export function useTableState<T>(
  columns: readonly ColumnDef<T>[],
  data: T[] | null,
): TableState<T> {
  // ----- State -----

  const [visibleIds, setVisibleIds] = useState<string[] | null>(null);
  const [sortEntries, setSortEntries] = useState<SortEntry[]>([]);

  // ----- Derive visible & all columns -----

  const visibleColumns = useMemo<ColumnDef<T>[]>(() => {
    if (visibleIds === null) return columns.slice() as ColumnDef<T>[];
    // Resolve IDs back to column defs, preserving the stored ordering.
    // Unknown IDs (stale values) are silently dropped.
    const colMap = new Map(columns.map((c) => [c.id, c]));
    return visibleIds
      .map((id) => colMap.get(id))
      .filter((c): c is ColumnDef<T> => c !== undefined);
  }, [columns, visibleIds]);

  const allColumns = useMemo<ColumnVisibility<T>[]>(() => {
    const visibleSet = new Set(visibleColumns.map((c) => c.id));
    return columns.map((col) => ({
      column: col as ColumnDef<T>,
      visible: visibleSet.has(col.id),
    }));
  }, [columns, visibleColumns]);

  // ----- Sorted data -----

  const sortedData = useMemo<T[] | null>(() => {
    if (data === null) return null;
    return sortData(data, columns as ColumnDef<T>[], sortEntries);
  }, [data, columns, sortEntries]);

  // ----- Mutators -----

  const toggleColumn = useCallback(
    (columnId: string) => {
      // Current visible IDs (or all if defaulted)
      const currentIds = visibleIds ?? (columns.map((c) => c.id) as string[]);
      const idx = currentIds.indexOf(columnId);
      const nextIds =
        idx >= 0
          ? currentIds.filter((id) => id !== columnId)
          : [...currentIds, columnId];

      // If result matches the default set & order, clear the stored value
      const isDefault =
        nextIds.length === columns.length &&
        nextIds.every((id, i) => id === columns[i].id);

      setVisibleIds(isDefault ? null : nextIds);
    },
    [visibleIds, columns],
  );

  const setColumnOrder = useCallback((orderedIds: string[] | null) => {
    setVisibleIds(orderedIds);
  }, []);

  const toggleSort = useCallback(
    (columnId: string, multi = false) => {
      // Only allow toggling sortable columns
      const col = columns.find((c) => c.id === columnId);
      if (!col || !col.sortable) return;

      const current = sortEntries;
      let next: SortEntry[];

      const existingIdx = current.findIndex((e) => e.columnId === columnId);

      if (multi) {
        // Multi-column: add / cycle / remove within chain
        if (existingIdx === -1) {
          next = [...current, { columnId, direction: "asc" }];
        } else if (current[existingIdx].direction === "asc") {
          next = current.map((e, i) =>
            i === existingIdx ? { ...e, direction: "desc" as const } : e,
          );
        } else {
          // Was desc → remove
          next = current.filter((_, i) => i !== existingIdx);
        }
      } else {
        // Single-column: replace entire sort
        if (existingIdx === -1) {
          next = [{ columnId, direction: "asc" }];
        } else if (current[existingIdx].direction === "asc") {
          next = [{ columnId, direction: "desc" }];
        } else {
          next = []; // Was desc → clear
        }
      }

      setSortEntries(next);
    },
    [columns, sortEntries],
  );

  const clearSort = useCallback(() => {
    setSortEntries([]);
  }, []);

  return {
    visibleColumns,
    allColumns,
    sortEntries,
    sortedData,
    toggleColumn,
    setColumnOrder,
    toggleSort,
    clearSort,
  };
}
