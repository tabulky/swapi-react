// Main component
export { default as ResourceTable } from "./ResourceTable";

// Column factory
export { schemaColumn } from "./schemaColumn";
export type { ColumnType, SchemaColumnConfig } from "./schemaColumn";

// Types for custom cell components and column definitions
export type {
  CellComponentProps,
  ColumnDef,
  ResourceTableProps,
} from "./types";

// Sort primitive types (useful for custom sort UIs / URL persistence)
export type { SortValue, SortDirection, SortEntry } from "./types";

// Built-in cell components and their prop types (for extending or composing)
export {
  TextCell,
  MixedCell,
  TagArrayCell,
} from "./cells";
export type { TextCellProps, MixedCellProps, TagArrayCellProps } from "./cells";

// Table state hook and types (for building custom column-visibility controls)
export { useTableState } from "./useTableState";
export type { TableState, ColumnVisibility } from "./useTableState";
