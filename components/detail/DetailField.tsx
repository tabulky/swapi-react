import type { ReactNode } from "react";

import { Tag } from "@/components/tag/Tag";

// ---------------------------------------------------------------------------
// DetailField — a single key/value row for detail pages
// ---------------------------------------------------------------------------

export function DetailField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <>
      <dt className="font-medium text-foreground/60">{label}</dt>
      <dd>{children}</dd>
    </>
  );
}

// ---------------------------------------------------------------------------
// Scalar value renderers
// ---------------------------------------------------------------------------

export function TextValue({ value }: { value: string }) {
  return <span>{value}</span>;
}

export function NumericValue({
  value,
  unit,
}: {
  value: number | string;
  unit?: string;
}) {
  if (typeof value === "number") {
    return (
      <span>
        {value.toLocaleString()}
        {unit && <span className="text-foreground/50">{unit}</span>}
      </span>
    );
  }
  return <span className="text-foreground/50">{value}</span>;
}

export function TagArrayValue({ value }: { value: string[] }) {
  if (value.length === 0) return <span className="text-foreground/40">—</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {value.map((v) => (
        <Tag key={v}>{v}</Tag>
      ))}
    </span>
  );
}
