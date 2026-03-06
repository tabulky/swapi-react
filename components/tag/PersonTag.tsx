import { Tag } from "@/components/tag/Tag";
import { PersonView } from "@/lib/swapi/schema/personView";

export type PersonTagProps = {
  person: PersonView;
};

export function PersonTag({ person }: PersonTagProps) {
  return <Tag>{person.name}</Tag>;
}
