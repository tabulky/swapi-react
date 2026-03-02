import type { ComponentType } from "react";
import type { UseResourceResult } from "@/lib/fetch-store/types";

// ---------------------------------------------------------------------------
// Sort primitives
// ---------------------------------------------------------------------------

/** A comparable value extracted from a row for sorting. `null` sorts last. */
export type SortValue = string | number | null;

/** Sort direction for a single column. */
export type SortDirection = "asc" | "desc";

/** One entry in a multi-column sort chain. */
export type SortEntry = {
  readonly columnId: string;
  readonly direction: SortDirection;
};

// ---------------------------------------------------------------------------
// Cell component props
// ---------------------------------------------------------------------------

/**
 * Props received by a `CellComponent`.
 *
 * The component is responsible for rendering the `<td>` element.
 * It receives the pre-extracted `value` (via the column's `getValue`) and
 * the full `row` for cases that need additional context.
 *
 * - `TKey` narrows which field the value comes from (defaults to any key).
 * - `TValue` can override the value type entirely (defaults to `TRow[TKey]`).
 */
export type CellComponentProps<
  TRow extends Record<string, unknown>,
  TKey extends keyof TRow & string = keyof TRow & string,
  TValue = TRow[TKey],
> = {
  readonly value: TValue;
  readonly row: TRow;
  readonly className?: string;
};

// ---------------------------------------------------------------------------
// Column definition
// ---------------------------------------------------------------------------

/**
 * A single column definition.
 *
 * Every column must provide a `getValue` function that extracts the cell's
 * display value from a row.
 *
 * - When no `CellComponent` is set, `ResourceTable` renders
 *   `<td className={cellClassName}>{String(value)}</td>`.
 * - When `CellComponent` is set it receives `{ value, row }` and is
 *   responsible for rendering the full `<td>`.
 *
 * This is the **storage type** for heterogeneous column arrays.
 * `CellComponent` is `ComponentType<any>` because the storage layer can't
 * prove component/value alignment statically — that proof lives in the
 * `col()` factory via `SchemaColumnConfig`.
 */
export type ColumnDef<TRow extends Record<string, unknown>> = {
  /** Stable identifier used in URL params and sort entries. */
  readonly id: string;
  /** Text shown in `<th>`. */
  readonly header: string;
  /** Extract the display value from a row. */
  readonly getValue: (row: TRow) => unknown;
  /** Optional className applied to the `<th>`. */
  readonly headerClassName?: string;
  /** If the column is sortable */
  readonly isSortable?: boolean;
  readonly getSortValue?: (row: TRow) => SortValue;
  /**
   * A React component that renders the full `<td>` element.
   * Receives the extracted `value`, `row`, and any extra `componentProps`.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly CellComponent?: ComponentType<any>;
  /** Extra props passed through to `CellComponent` by `ResourceTable`. */
  readonly componentProps?: Record<string, unknown>;
  /** Optional className applied to the default `<td>` wrapper (no `CellComponent`). */
  readonly cellClassName?: string;
};

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

/** Props accepted by `ResourceTable<T>`. */
export type ResourceTableProps<T extends Record<string, unknown>> = {
  /** The resource hook result — provides `data`, `state`, `refetch`. */
  readonly resource: UseResourceResult<T[]>;
  /** Column definitions. Order here is the default column order. */
  readonly columns: readonly ColumnDef<T>[];
  /** Extract a stable unique key from each row item. */
  readonly getRowKey: (item: T) => string;
};
