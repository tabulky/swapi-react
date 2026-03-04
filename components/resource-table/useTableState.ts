"use client";

import type { ColumnDef } from "./types";
import { useColumnsState } from "./useColumnsState";
import { useSortState } from "./useSortState";

export type { ColumnVisibility } from "./useColumnsState";
export type { ColumnsState } from "./useColumnsState";
export type { SortState } from "./useSortState";

// ---------------------------------------------------------------------------
// Public return type
// ---------------------------------------------------------------------------

export type TableState<T extends Record<string, unknown>> = ReturnType<
  typeof useColumnsState<T>
> &
  ReturnType<typeof useSortState<T>>;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Convenience hook that composes `useColumnsState` and `useSortState`.
 *
 * For finer-grained control, use those hooks directly instead.
 */
export function useTableState<T extends Record<string, unknown>>(
  columns: readonly ColumnDef<T>[],
): TableState<T> {
  const columnsState = useColumnsState(columns);
  const sortState = useSortState(columns);

  return { ...columnsState, ...sortState };
}
