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
  StarshipDetailResource,
  StarshipsResource,
} from "@/lib/swapi/resources";

export default function StarshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: starship } = useSwapiResource(StarshipDetailResource, id);

  useSwapiResource(StarshipsResource);

  if (!starship) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-foreground/50">Loading…</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/starships"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        &larr; Back to Starships
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">{starship.name}</h1>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
        <DetailField label="Model">{starship.model}</DetailField>
        <DetailField label="Class">{starship.starship_class}</DetailField>
        <DetailField label="Manufacturer">
          <TagArrayValue value={starship.manufacturer} />
        </DetailField>
        <DetailField label="Cost">
          <NumericValue value={starship.cost_in_credits} unit=" credits" />
        </DetailField>
        <DetailField label="Length">
          <NumericValue value={starship.length} unit=" m" />
        </DetailField>
        <DetailField label="Max Speed">
          <NumericValue value={starship.max_atmosphering_speed} />
        </DetailField>
        <DetailField label="Crew">
          <NumericValue value={starship.crew} />
        </DetailField>
        <DetailField label="Passengers">
          <NumericValue value={starship.passengers} />
        </DetailField>
        <DetailField label="Cargo Capacity">
          <NumericValue value={starship.cargo_capacity} unit=" kg" />
        </DetailField>
        <DetailField label="Consumables">{starship.consumables}</DetailField>
        <DetailField label="Hyperdrive Rating">
          <NumericValue value={starship.hyperdrive_rating} />
        </DetailField>
        <DetailField label="MGLT">
          <NumericValue value={starship.MGLT} />
        </DetailField>
        <DetailField label="Pilots">
          <RelationLinks
            urls={starship.pilots}
            resource={PeopleResource}
            labelKey="name"
            routePrefix="/people"
          />
        </DetailField>
        <DetailField label="Films">
          <RelationLinks
            urls={starship.films}
            resource={FilmsResource}
            labelKey="title"
            routePrefix="/films"
          />
        </DetailField>
      </dl>
    </main>
  );
}
