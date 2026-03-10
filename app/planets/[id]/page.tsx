"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  DetailField,
  NumericValue,
  TagArrayValue,
} from "@/components/detail/DetailField";
import { RelationLinks } from "@/components/detail/RelationLinks";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import {
  FilmsResource,
  PeopleResource,
  PlanetDetailResource,
  PlanetsResource,
} from "@/lib/swapi/resources";

export default function PlanetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: planet } = useSwapiResource(PlanetDetailResource, id);

  useSwapiResource(PlanetsResource);

  if (!planet) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-foreground/50">Loading…</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/planets"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        &larr; Back to Planets
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">{planet.name}</h1>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
        <DetailField label="Climate">
          <TagArrayValue value={planet.climate} />
        </DetailField>
        <DetailField label="Terrain">
          <TagArrayValue value={planet.terrain} />
        </DetailField>
        <DetailField label="Population">
          <NumericValue value={planet.population} />
        </DetailField>
        <DetailField label="Diameter">
          <NumericValue value={planet.diameter} unit=" km" />
        </DetailField>
        <DetailField label="Gravity">{planet.gravity}</DetailField>
        <DetailField label="Rotation Period">
          <NumericValue value={planet.rotation_period} unit=" hours" />
        </DetailField>
        <DetailField label="Orbital Period">
          <NumericValue value={planet.orbital_period} unit=" days" />
        </DetailField>
        <DetailField label="Surface Water">
          <NumericValue value={planet.surface_water} unit="%" />
        </DetailField>
        <DetailField label="Residents">
          <RelationLinks
            urls={planet.residents}
            resource={PeopleResource}
            labelKey="name"
            routePrefix="/people"
          />
        </DetailField>
        <DetailField label="Films">
          <RelationLinks
            urls={planet.films}
            resource={FilmsResource}
            labelKey="title"
            routePrefix="/films"
          />
        </DetailField>
      </dl>
    </main>
  );
}
