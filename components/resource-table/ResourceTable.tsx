"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";

import { TableLoadingState } from "./TableLoadingState";

import type { ResourceTableProps } from "./types";

// ---------------------------------------------------------------------------
// Sort indicator shown in column headers
// ---------------------------------------------------------------------------

function SortIndicator({
  direction,
  index,
  multiSort,
}: {
  direction: "asc" | "desc" | null;
  /** 0-based position in the multi-sort chain. */
  index: number;
  /** Whether there are multiple active sort columns. */
  multiSort: boolean;
}) {
  if (direction === null) {
    return (
      <ChevronsUpDown
        size={14}
        className="inline-block ml-1 opacity-40 group-hover:opacity-80 transition-opacity"
      />
    );
  }

  const Icon = direction === "asc" ? ChevronUp : ChevronDown;
  return (
    <span className="inline-flex items-center ml-1">
      <Icon size={14} className="inline-block" />
      {multiSort && (
        <span className="text-[10px] text-foreground/50 tabular-nums leading-none">
          {index + 1}
        </span>
      )}
    </span>
  );
}

// ---------------------------------------------------------------------------
// ResourceTable
// ---------------------------------------------------------------------------

export default function ResourceTable<T extends Record<string, unknown>>({
  resource,
  tableState,
  data,
  getRowKey,
}: ResourceTableProps<T>) {
  const {
    visibleColumns,
    sortEntries,
    toggleSort,
  } = tableState;

  const multiSort = sortEntries.length > 1;

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-2">
        <button
          className="font-bold rounded bg-foreground/10 px-2 py-1 hover:bg-foreground/20"
          onClick={() => resource.refetch(true)}
        >
          Refresh
        </button>
        <div>
          <TableLoadingState resource={resource} />
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-background/90 backdrop-blur-sm">
          <tr className="border-b border-foreground/20 text-left">
            {visibleColumns.map((col) => {
              const sortIndex = sortEntries.findIndex(
                (e) => e.columnId === col.id,
              );
              const sortEntry = sortIndex >= 0
                ? sortEntries[sortIndex]
                : undefined;

              return (
                <th
                  key={col.id}
                  scope="col"
                  className={`p-2 align-top ${
                    col.isSortable ? "cursor-pointer select-none group" : ""
                  } ${col.headerClassName ?? ""}`}
                  onClick={col.isSortable
                    ? (e) => toggleSort(col.id, e.shiftKey)
                    : undefined}
                >
                  {col.header}
                  {col.isSortable && (
                    <SortIndicator
                      direction={sortEntry?.direction ?? null}
                      index={sortIndex}
                      multiSort={multiSort}
                    />
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr
              key={getRowKey(item)}
              className="border-b border-foreground/10 hover:bg-foreground/5"
            >
              {visibleColumns.map((col) => {
                const value = col.getValue(item);
                const className = col.cellClassName ?? "p-2";

                if (col.CellComponent) {
                  return (
                    <col.CellComponent
                      key={col.id}
                      {...col.componentProps}
                      className={className}
                      value={value}
                      row={item}
                    />
                  );
                }

                return (
                  <td key={col.id} className={className}>
                    {String(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
