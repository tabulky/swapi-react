"use client";
export function MixedCell(
  { value, numericUnit }: { value: number | string; numericUnit?: string },
) {
  const isNumber = typeof value === "number";
  return (
    <td
      className={`p-2 tabular-nums${isNumber ? " text-right" : " text-center"}`}
    >
      {isNumber
        ? `${value.toLocaleString()}${numericUnit ? numericUnit : ""}`
        : value}
    </td>
  );
}
