"use client";

import { useCallback, useState } from "react";

import { RelationLinks } from "@/components/detail/RelationLinks";
import type { ResourceDefinition } from "@/lib/fetch-store/types";

/**
 * Collapsible `<details>` wrapper around RelationLinks.
 * Shows label + count in the summary; expands to reveal linked tags.
 * RelationLinks is mounted lazily on first open to avoid fetching
 * related collections until the user actually expands the section.
 */
export function RelationDetails<T extends Record<string, unknown>>({
  label,
  urls,
  resource,
  labelKey,
  routePrefix,
}: {
  label: string;
  urls: string[];
  resource: ResourceDefinition<T[], []>;
  labelKey: keyof T & string;
  routePrefix: string;
}) {
  const [hasOpened, setHasOpened] = useState(false);

  const handleToggle = useCallback(
    (e: React.ToggleEvent<HTMLDetailsElement>) => {
      if (e.newState === "open") setHasOpened(true);
    },
    [],
  );

  if (urls.length === 0) return null;

  return (
    <details className="group rounded-lg border border-foreground/10" onToggle={handleToggle}>
      <summary className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium select-none hover:bg-foreground/5">
        <span className="transition-transform group-open:rotate-90">&#9654;</span>
        {label}
        <span className="ml-auto rounded-full bg-foreground/10 px-2 py-0.5 text-xs tabular-nums">
          {urls.length}
        </span>
      </summary>
      <div className="px-4 pb-3 pt-1">
        {hasOpened && (
          <RelationLinks
            urls={urls}
            resource={resource}
            labelKey={labelKey}
            routePrefix={routePrefix}
          />
        )}
      </div>
    </details>
  );
}
