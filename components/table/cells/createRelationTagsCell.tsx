"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Tag } from "@/components/tag/Tag";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { extractIdFromUrl } from "@/lib/swapi/urlUtils";
import type { ResourceDefinition } from "@/lib/fetch-store/types";

/**
 * Creates a cell component that resolves an array of SWAPI URLs to named links.
 *
 * Usage (at module scope):
 * ```ts
 * const FilmsCell = createRelationTagsCell(FilmsResource, "title", "/films");
 * col("films", { label: "Films", CellComponent: FilmsCell });
 * ```
 */
export function createRelationTagsCell<T extends Record<string, unknown>>(
  resource: ResourceDefinition<T[], []>,
  labelKey: keyof T & string,
  routePrefix: string,
) {
  function RelationTagsCell({
    value: urls,
    className,
  }: {
    value: string[];
    row?: unknown;
    className?: string;
  }) {
    const { data } = useSwapiResource(resource);

    const items = useMemo(() => {
      if (!urls || urls.length === 0) return [];
      if (!data) return null;

      return urls.map((url) => {
        const item = data.find(
          (d) => (d as Record<string, unknown>).url === url,
        );
        if (item) {
          const id = extractIdFromUrl(url);
          return {
            url,
            label: String(item[labelKey]),
            href: `${routePrefix}/${id}`,
          };
        }
        return { url, label: null, href: null };
      });
    }, [data, urls]);

    if (!items) {
      return (
        <td className={className}>
          <Tag className="opacity-40">{urls.length}</Tag>
        </td>
      );
    }

    return (
      <td className={className}>
        <span className="flex flex-wrap gap-0.5">
          {items.map((item) =>
            item.href
              ? (
                <Link key={item.url} href={item.href}>
                  <Tag className="hover:underline text-blue-600 dark:text-blue-400 cursor-pointer">
                    {item.label}
                  </Tag>
                </Link>
              )
              : (
                <Tag key={item.url} className="opacity-40">
                  ?
                </Tag>
              )
          )}
        </span>
      </td>
    );
  }

  RelationTagsCell.displayName = `RelationTagsCell(${routePrefix})`;
  return RelationTagsCell;
}
