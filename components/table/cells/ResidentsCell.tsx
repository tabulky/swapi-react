"use client";

import { Tag } from "@/components/Tag";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { PeopleResource } from "@/lib/swapi/resources";
import { PersonView } from "@/types/personView";
import { useMemo } from "react";

export type ResidentsCellProps = {
  value: string[];
  row: Record<string, unknown>;
  className?: string;
};

export function ResidentsCell(
  { value: personURLs, className }: ResidentsCellProps,
) {
  const peopleResource = useSwapiResource(PeopleResource);
  const people = peopleResource.data;

  const { found, missing } = useMemo(() => {
    if (!personURLs || personURLs.length === 0) {
      return { found: [], missing: [] };
    }

    if (!people) {
      return { found: [], missing: personURLs };
    }

    const found: PersonView[] = [];
    const missing: string[] = [];
    for (const url of personURLs) {
      const person = people.find((p) => p.url === url);
      if (person) {
        found.push(person);
      } else {
        missing.push(url);
      }
    }
    return { found, missing };
  }, [people, personURLs]);

  return (
    <td className={className}>
      {found.map((person) => <Tag key={person.url}>{person.name}</Tag>)}
      {missing.length > 0 && <Tag className="opacity-40">{`+${missing.length}`}</Tag>}
    </td>
  );
}
