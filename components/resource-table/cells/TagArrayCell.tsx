import { Tag } from "@/components/tag/Tag";

export type TagArrayCellProps = {
  readonly value: string[] | null | undefined;
  readonly className?: string;
};

export function TagArrayCell({ value, className }: TagArrayCellProps) {
  return (
    <td className={className}>
      {(value ?? []).map((s) => <Tag key={s}>{s}</Tag>)}
    </td>
  );
}
