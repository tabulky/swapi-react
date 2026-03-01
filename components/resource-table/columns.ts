import type { ReactNode, ReactElement } from "react";
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
// Column definition — discriminated union
// ---------------------------------------------------------------------------

/**
 * Shared fields present on every column definition.
 * Use `id` as the stable identifier for URL serialisation and lookup.
 */
type ColumnDefBase = {
  /** Stable identifier used in URL params and sort entries. */
  readonly id: string;
  /** Text shown in `<th>`. */
  readonly header: string;
  /** Optional className applied to the `<th>`. */
  readonly headerClassName?: string;
};

/**
 * A column whose sort behaviour is explicitly opted-in.
 *
 * When `sortable` is `true`, a `getSortValue` accessor **must** be provided
 * so the generic sort engine knows how to compare rows.
 */
type Sortable<T> =
  | { readonly sortable?: false; readonly getSortValue?: never }
  | { readonly sortable: true; readonly getSortValue: (item: T) => SortValue };

/**
 * A column that renders **content** inside a `<td>` managed by `ResourceTable`.
 *
 * The table wraps the return value of `renderCell` in
 * `<td className={cellClassName}>…</td>`.
 */
export type ContentColumnDef<T> = ColumnDefBase &
  Sortable<T> & {
    readonly fullCell?: false;
    /** Return the cell **content** (not a `<td>`). */
    readonly renderCell: (item: T) => ReactNode;
    /** Optional className applied to the wrapping `<td>`. */
    readonly cellClassName?: string;
  };

/**
 * A column that renders a **complete `<td>` element** itself.
 *
 * Use this for components like `MixedCell` that own their `<td>`.
 */
export type FullCellColumnDef<T> = ColumnDefBase &
  Sortable<T> & {
    readonly fullCell: true;
    /** Return a full `<td>` element. */
    readonly renderCell: (item: T) => ReactElement;
  };

/** A single column definition — either content-based or full-cell. */
export type ColumnDef<T> = ContentColumnDef<T> | FullCellColumnDef<T>;

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

/** Props accepted by `ResourceTable<T>`. */
export type ResourceTableProps<T> = {
  /** The resource hook result — provides `data`, `state`, `refetch`. */
  readonly resource: UseResourceResult<T[]>;
  /** Column definitions. Order here is the default column order. */
  readonly columns: readonly ColumnDef<T>[];
  /** Extract a stable unique key from each row item. */
  readonly getRowKey: (item: T) => string;
};
