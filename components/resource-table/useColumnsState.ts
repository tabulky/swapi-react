"use client";

import { useCallback, useMemo, useState } from "react";

import type { ColumnDef } from "./types";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type ColumnVisibility<T extends Record<string, unknown>> = {
  readonly column: ColumnDef<T>;
  readonly visible: boolean;
};

export type ColumnsState<T extends Record<string, unknown>> = {
  /** Visible columns in their current display order. */
  readonly visibleColumns: ColumnDef<T>[];
  /** All columns in display order, each tagged with its visibility flag. */
  readonly allColumns: ColumnVisibility<T>[];

  // — Mutators —

  /** Toggle a column's visibility on/off. Does not affect column order. */
  readonly toggleColumn: (columnId: string) => void;
  /**
   * Replace the full column order (array of ALL column IDs, visible and hidden).
   * Pass `null` to reset to default (definition order).
   */
  readonly setColumnOrder: (orderedIds: string[] | null) => void;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Manages column visibility and order for `ResourceTable`.
 *
 * Column order and visibility are tracked independently:
 * - `columnOrder` (null = definition order) controls the position of ALL columns.
 * - `hiddenColumnIds` (empty = all visible) controls which columns are hidden.
 *
 * Both start as their default values, avoiding any SSR/hydration mismatch.
 */
export function useColumnsState<T extends Record<string, unknown>>(
  columns: readonly ColumnDef<T>[],
): ColumnsState<T> {
  const [columnOrder, setColumnOrderState] = useState<string[] | null>(null);
  const [hiddenColumnIds, setHiddenColumnIds] = useState<string[]>([]);

  // ----- Primary: derive all columns in display order -----

  const allColumns = useMemo<ColumnVisibility<T>[]>(() => {
    const hiddenSet = new Set(hiddenColumnIds);
    const colMap = new Map(columns.map((c) => [c.id, c]));

    if (columnOrder === null) {
      return columns.map((col) => ({
        column: col as ColumnDef<T>,
        visible: !hiddenSet.has(col.id),
      }));
    }

    // Resolve stored order, dropping stale IDs
    const result: ColumnVisibility<T>[] = [];
    const seen = new Set<string>();
    for (const id of columnOrder) {
      const col = colMap.get(id);
      if (col) {
        result.push({ column: col, visible: !hiddenSet.has(id) });
        seen.add(id);
      }
    }
    // Append any new columns not in stored order
    for (const col of columns) {
      if (!seen.has(col.id)) {
        result.push({
          column: col as ColumnDef<T>,
          visible: !hiddenSet.has(col.id),
        });
      }
    }
    return result;
  }, [columns, columnOrder, hiddenColumnIds]);

  // ----- Secondary: visible columns are a simple filter -----

  const visibleColumns = useMemo<ColumnDef<T>[]>(
    () => allColumns.filter((c) => c.visible).map((c) => c.column),
    [allColumns],
  );

  // ----- Mutators -----

  const toggleColumn = useCallback((columnId: string) => {
    setHiddenColumnIds((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId],
    );
  }, []);

  const setColumnOrder = useCallback((orderedIds: string[] | null) => {
    setColumnOrderState(orderedIds);
  }, []);

  return {
    visibleColumns,
    allColumns,
    toggleColumn,
    setColumnOrder,
  };
}
