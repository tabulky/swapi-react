"use client";

import Link from "next/link";
import { useMemo } from "react";

import { Tag } from "@/components/tag/Tag";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { extractIdFromUrl } from "@/lib/swapi/urlUtils";
import type { ResourceDefinition } from "@/lib/fetch-store/types";

// ---------------------------------------------------------------------------
// RelationLinks — resolve URL array to named links (for detail pages)
// ---------------------------------------------------------------------------

export function RelationLinks<T extends Record<string, unknown>>({
  urls,
  resource,
  labelKey,
  routePrefix,
}: {
  urls: string[];
  resource: ResourceDefinition<T[], []>;
  labelKey: keyof T & string;
  routePrefix: string;
}) {
  const { data } = useSwapiResource(resource);

  const items = useMemo(() => {
    if (!urls || urls.length === 0) return [];
    if (!data) return null;

    return urls.map((url) => {
      const found = data.find(
        (d) => (d as Record<string, unknown>).url === url,
      );
      if (found) {
        const id = extractIdFromUrl(url);
        return { url, label: String(found[labelKey]), href: `${routePrefix}/${id}` };
      }
      return { url, label: extractIdFromUrl(url), href: `${routePrefix}/${extractIdFromUrl(url)}` };
    });
  }, [data, urls, labelKey, routePrefix]);

  if (urls.length === 0) return <span className="text-foreground/40">—</span>;

  if (!items) {
    return <Tag className="opacity-40">{urls.length} loading…</Tag>;
  }

  return (
    <span className="flex flex-wrap gap-1">
      {items.map((item) => (
        <Link key={item.url} href={item.href}>
          <Tag className="hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer">
            {item.label}
          </Tag>
        </Link>
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// SingleRelationLink — resolve single URL to named link (for detail pages)
// ---------------------------------------------------------------------------

export function SingleRelationLink<T extends Record<string, unknown>>({
  url,
  resource,
  labelKey,
  routePrefix,
}: {
  url: string | null;
  resource: ResourceDefinition<T[], []>;
  labelKey: keyof T & string;
  routePrefix: string;
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
  }, [data, url, labelKey, routePrefix]);

  if (!url) return <span className="text-foreground/40">—</span>;

  if (!item) {
    return <Tag className="opacity-40">…</Tag>;
  }

  return (
    <Link href={item.href}>
      <Tag className="hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer">
        {item.label}
      </Tag>
    </Link>
  );
}
