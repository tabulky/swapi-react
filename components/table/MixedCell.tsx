"use client";

export type MixedCellProps = {
  value: number | string;
  /**
   * An optional unit to display after numeric values.
   */
  numericUnit?: string;
};

/**
 * A table cell component that can display either a number or a string.
 *
 * If the value is a number, it will be right-aligned and formatted with commas.
 * If the value is a string, it will be centered and displayed in a muted color.
 * An optional `numericUnit` can be provided to append a unit to numeric values.
 */
export function MixedCell({ value, numericUnit }: MixedCellProps) {
  const isNumber = typeof value === "number";

  if (isNumber) {
    return (
      <td className="p-2 tabular-nums text-right">
        {value.toLocaleString()}
        {numericUnit
          ? <span className="text-foreground/75">{numericUnit}</span>
          : null}
      </td>
    );
  }

  // string value fallback
  return <td className="p-2 text-center text-foreground/75">{value}</td>;
}
