"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Tag } from "@/components/tag/Tag";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { extractIdFromUrl } from "@/lib/swapi/urlUtils";
import type { ResourceDefinition } from "@/lib/fetch-store/types";

// ---------------------------------------------------------------------------
// createRelationCell — factory for URL[] relation columns
// ---------------------------------------------------------------------------

/**
 * Creates a cell component that resolves an array of SWAPI URLs to named links.
 *
 * Usage (at module scope):
 * ```ts
 * const FilmsCell = createRelationCell(FilmsResource, "title", "/films");
 * col("films", { label: "Films", CellComponent: FilmsCell });
 * ```
 */
export function createRelationCell<T extends Record<string, unknown>>(
  resource: ResourceDefinition<T[], []>,
  labelKey: keyof T & string,
  routePrefix: string,
) {
  function RelationCell({
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
          return { url, label: String(item[labelKey]), href: `${routePrefix}/${id}` };
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
            item.href ? (
              <Link key={item.url} href={item.href}>
                <Tag className="hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer">
                  {item.label}
                </Tag>
              </Link>
            ) : (
              <Tag key={item.url} className="opacity-40">
                ?
              </Tag>
            ),
          )}
        </span>
      </td>
    );
  }

  RelationCell.displayName = `RelationCell(${routePrefix})`;
  return RelationCell;
}

// ---------------------------------------------------------------------------
// createSingleRelationCell — factory for single-URL relation columns
// ---------------------------------------------------------------------------

/**
 * Creates a cell component that resolves a single SWAPI URL to a named link.
 *
 * Usage (at module scope):
 * ```ts
 * const HomeworldCell = createSingleRelationCell(PlanetsResource, "name", "/planets");
 * col("homeworld", { label: "Homeworld", CellComponent: HomeworldCell });
 * ```
 */
export function createSingleRelationCell<T extends Record<string, unknown>>(
  resource: ResourceDefinition<T[], []>,
  labelKey: keyof T & string,
  routePrefix: string,
) {
  function SingleRelationCell({
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
        <Link href={item.href}>
          <Tag className="hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer">
            {item.label}
          </Tag>
        </Link>
      </td>
    );
  }

  SingleRelationCell.displayName = `SingleRelationCell(${routePrefix})`;
  return SingleRelationCell;
}
