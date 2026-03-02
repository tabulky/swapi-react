import { type ComponentType } from "react";

import type { CellComponentProps, ColumnDef, SortValue } from "./types";
import { MixedCell, TagArrayCell, TextCell } from "./cells";

// ---------------------------------------------------------------------------
// Column types & type-level constraints
// ---------------------------------------------------------------------------

/** Predefined column types that drive default rendering and sort behaviour. */
export type ColumnType = "text" | "numeric" | "tagArray";

/**
 * Constrains which `ColumnType` values are valid for a given field type.
 *
 * - `number | string` fields → `"numeric"`
 * - `string[]` / `readonly string[]` fields → `"tagArray"`
 * - plain `string` (and fallback) → `"text"`
 */
export type AllowedType<V> = number extends Extract<V, number> ? "numeric"
  : V extends readonly string[] ? "tagArray"
  : "text";

// ---------------------------------------------------------------------------
// Static defaults per column type
// ---------------------------------------------------------------------------

type ColumnTypeDefaults = {
  readonly isSortable: boolean;
  readonly headerClassName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly CellComponent?: ComponentType<any>;
};

const defaultColumnDefByType: Record<ColumnType, ColumnTypeDefaults> = {
  text: {
    isSortable: true,
    CellComponent: TextCell,
  },
  numeric: {
    isSortable: true,
    headerClassName: "text-center",
    CellComponent: MixedCell,
  },
  tagArray: {
    isSortable: false,
    CellComponent: TagArrayCell,
  },
};

// ---------------------------------------------------------------------------
// Config type accepted by the returned `col()` helper
// ---------------------------------------------------------------------------

/** Base config fields shared by all column types. */
type SchemaColumnConfigBase<
  TRow extends Record<string, unknown>,
  TKey extends keyof TRow & string = keyof TRow & string,
> = {
  readonly label: string;
  readonly headerClassName?: string;
  readonly cellClassName?: string;
  readonly isSortable?: boolean;
  readonly getSortValue?: (row: TRow) => SortValue;
  readonly getValue?: (row: TRow) => TRow[TKey];
  readonly CellComponent?: ComponentType<CellComponentProps<TRow, TKey>>;
};

/**
 * Full config for `col(key, config)`.
 *
 * When `type` is set, defaults for isSortable / headerClassName /
 * getSortValue / CellComponent are applied from the type's preset and can be
 * overridden individually.
 *
 * `numericUnit` is only available when the field type permits `"numeric"`.
 */
export type SchemaColumnConfig<
  TRow extends Record<string, unknown>,
  TKey extends keyof TRow & string,
> =
  & SchemaColumnConfigBase<TRow, TKey>
  & // When numeric is an allowed type, expose numericUnit
  (AllowedType<TRow[TKey]> extends "numeric"
    ? { readonly type?: AllowedType<TRow[TKey]>; readonly numericUnit?: string }
    : {
      readonly type?: AllowedType<TRow[TKey]>;
      readonly numericUnit?: never;
    });

// ---------------------------------------------------------------------------
// schemaColumn factory
// ---------------------------------------------------------------------------

/**
 * Creates a curried column-definition helper bound to a row type.
 *
 * ```ts
 * const col = schemaColumn<PersonView>();
 * const columns = [
 *   col("name",   { type: "text", label: "Name" }),
 *   col("height", { type: "numeric", label: "Height", numericUnit: " cm" }),
 *   col("hair_color", { type: "tagArray", label: "Hair Color" }),
 * ];
 * ```
 */
export function schemaColumn<TRow extends Record<string, unknown>>() {
  return function col<TKey extends keyof TRow & string>(
    key: TKey,
    config: SchemaColumnConfig<TRow, TKey>,
  ): ColumnDef<TRow> {
    const { type, label, ...rest } = config as SchemaColumnConfigBase<TRow> & {
      type?: ColumnType;
      numericUnit?: string;
    };

    // Start with type-derived defaults (if type is set)
    const defaults = type ? defaultColumnDefByType[type] : undefined;

    const isSortable = rest.isSortable ?? defaults?.isSortable ?? false;

    // getValue: user-supplied or default property accessor
    const getValue = rest.getValue ?? ((row: TRow) => row[key]);

    // Build type-derived getSortValue
    let getSortValue: ((row: TRow) => SortValue) | undefined =
      rest.getSortValue;

    if (type && !getSortValue && isSortable) {
      if (type === "numeric") {
        getSortValue = (row) => {
          const v = getValue(row);
          return typeof v === "number" ? v : null;
        };
      } else if (type === "text") {
        getSortValue = getValue as (row: TRow) => string;
      }
      // tagArray: no default getSortValue
    }

    // CellComponent: user-supplied or type-derived default
    const CellComponent = rest.CellComponent ?? defaults?.CellComponent;

    // componentProps: only for numeric columns with numericUnit
    let componentProps: Record<string, unknown> | undefined;
    if (type === "numeric") {
      const numericUnit = (config as { numericUnit?: string }).numericUnit;
      if (numericUnit != null) {
        componentProps = { numericUnit };
      }
    }

    return {
      id: key,
      header: label,
      getValue,
      isSortable,
      headerClassName: rest.headerClassName ?? defaults?.headerClassName,
      cellClassName: rest.cellClassName,
      ...(getSortValue != null && { getSortValue }),
      ...(CellComponent != null && { CellComponent }),
      ...(componentProps != null && { componentProps }),
    };
  };
}
