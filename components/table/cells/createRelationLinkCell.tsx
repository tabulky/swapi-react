"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Tag } from "@/components/tag/Tag";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { extractIdFromUrl } from "@/lib/swapi/urlUtils";
import type { ResourceDefinition } from "@/lib/fetch-store/types";

/**
 * Creates a cell component that resolves a single SWAPI URL to a named link.
 *
 * Usage (at module scope):
 * ```ts
 * const HomeworldCell = createRelationLinkCell(PlanetsResource, "name", "/planets");
 * col("homeworld", { label: "Homeworld", CellComponent: HomeworldCell });
 * ```
 */
export function createRelationLinkCell<T extends Record<string, unknown>>(
  resource: ResourceDefinition<T[], []>,
  labelKey: keyof T & string,
  routePrefix: string,
) {
  function RelationLinkCell({
    value: url,
    className,
  }: {
    value: string | null;
    row?: unknown;
    className?: string;
  }) {
    const { data } = useSwapiResource(resource);

    const item = useMemo(() => {
      if (!url || !data) return null;
      const found = data.find(
        (d) => (d as Record<string, unknown>).url === url,
      );
      if (!found) return null;
      const id = extractIdFromUrl(url);
      return { label: String(found[labelKey]), href: `${routePrefix}/${id}` };
    }, [data, url]);

    if (!url) {
      return <td className={className}>—</td>;
    }

    if (!item) {
      return (
        <td className={className}>
          <Tag className="opacity-40">…</Tag>
        </td>
      );
    }

    return (
      <td className={className}>
        <Link
          href={item.href}
          className="hover:underline text-blue-600 dark:text-blue-400"
        >
          {item.label}
        </Link>
      </td>
    );
  }

  RelationLinkCell.displayName = `RelationLinkCell(${routePrefix})`;
  return RelationLinkCell;
}
