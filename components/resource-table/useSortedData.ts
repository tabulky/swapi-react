"use client";

import { useMemo } from "react";

import type { ColumnDef, SortEntry } from "./types";
import { sortData } from "./sortData";

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Derives a sorted copy of `data` using the current sort specification.
 *
 * Returns `null` when `data` is `null` (not yet loaded).
 */
export function useSortedData<T extends Record<string, unknown>>(
  data: T[] | null,
  columns: readonly ColumnDef<T>[],
  sortEntries: readonly SortEntry[],
): T[] | null {
  return useMemo<T[] | null>(() => {
    if (data === null) return null;
    return sortData(data, columns, sortEntries);
  }, [data, columns, sortEntries]);
}
