"use client";

import Link from "next/link";
import { extractIdFromUrl } from "@/lib/swapi/urlUtils";

/**
 * Creates a cell component that renders the name as a link to the detail page.
 *
 * Usage (at module scope):
 * ```ts
 * const PersonNameCell = createNameCell("/people");
 * col("name", { type: "text", label: "Name", CellComponent: PersonNameCell });
 * ```
 */
export function createNameCell(routePrefix: string) {
  function NameCell({
    value,
    row,
    className,
  }: {
    value: string;
    row: Record<string, unknown>;
    className?: string;
  }) {
    const url = row.url as string;
    const id = extractIdFromUrl(url);

    return (
      <td className={`p-2 font-bold ${className ?? ""}`}>
        <Link
          href={`${routePrefix}/${id}`}
          className="hover:underline text-blue-600 dark:text-blue-400"
        >
          {value}
        </Link>
      </td>
    );
  }

  NameCell.displayName = `NameCell(${routePrefix})`;
  return NameCell;
}
