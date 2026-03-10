"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  DetailField,
  NumericValue,
  TagArrayValue,
} from "@/components/detail/DetailField";
import {
  RelationLinks,
  SingleRelationLink,
} from "@/components/detail/RelationLinks";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import {
  FilmsResource,
  PeopleResource,
  PlanetsResource,
  SpeciesDetailResource,
  SpeciesResource,
} from "@/lib/swapi/resources";

export default function SpeciesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: species } = useSwapiResource(SpeciesDetailResource, id);

  useSwapiResource(SpeciesResource);

  if (!species) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-foreground/50">Loading…</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/species"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        &larr; Back to Species
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">{species.name}</h1>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
        <DetailField label="Classification">
          {species.classification}
        </DetailField>
        <DetailField label="Designation">{species.designation}</DetailField>
        <DetailField label="Language">{species.language}</DetailField>
        <DetailField label="Avg. Height">
          <NumericValue value={species.average_height} unit=" cm" />
        </DetailField>
        <DetailField label="Avg. Lifespan">
          <NumericValue value={species.average_lifespan} unit=" years" />
        </DetailField>
        <DetailField label="Skin Colors">
          <TagArrayValue value={species.skin_colors} />
        </DetailField>
        <DetailField label="Hair Colors">
          <TagArrayValue value={species.hair_colors} />
        </DetailField>
        <DetailField label="Eye Colors">
          <TagArrayValue value={species.eye_colors} />
        </DetailField>
        <DetailField label="Homeworld">
          <SingleRelationLink
            url={species.homeworld}
            resource={PlanetsResource}
            labelKey="name"
            routePrefix="/planets"
          />
        </DetailField>
        <DetailField label="People">
          <RelationLinks
            urls={species.people}
            resource={PeopleResource}
            labelKey="name"
            routePrefix="/people"
          />
        </DetailField>
        <DetailField label="Films">
          <RelationLinks
            urls={species.films}
            resource={FilmsResource}
            labelKey="title"
            routePrefix="/films"
          />
        </DetailField>
      </dl>
    </main>
  );
}
