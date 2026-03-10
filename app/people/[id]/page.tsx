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
  PersonDetailResource,
  PlanetsResource,
  SpeciesResource,
  StarshipsResource,
  VehiclesResource,
} from "@/lib/swapi/resources";

export default function PersonDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: person } = useSwapiResource(PersonDetailResource, id);

  // Pre-fetch collections used by the list page (shared cache)
  useSwapiResource(PeopleResource);

  if (!person) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-foreground/50">Loading…</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/people"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        &larr; Back to People
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">{person.name}</h1>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
        <DetailField label="Gender">{person.gender}</DetailField>
        <DetailField label="Birth Year">{person.birth_year}</DetailField>
        <DetailField label="Height">
          <NumericValue value={person.height} unit=" cm" />
        </DetailField>
        <DetailField label="Mass">
          <NumericValue value={person.mass} unit=" kg" />
        </DetailField>
        <DetailField label="Hair Color">
          <TagArrayValue value={person.hair_color} />
        </DetailField>
        <DetailField label="Eye Color">
          <TagArrayValue value={person.eye_color} />
        </DetailField>
        <DetailField label="Skin Color">
          <TagArrayValue value={person.skin_color} />
        </DetailField>
        <DetailField label="Homeworld">
          <SingleRelationLink
            url={person.homeworld}
            resource={PlanetsResource}
            labelKey="name"
            routePrefix="/planets"
          />
        </DetailField>
        <DetailField label="Films">
          <RelationLinks
            urls={person.films}
            resource={FilmsResource}
            labelKey="title"
            routePrefix="/films"
          />
        </DetailField>
        <DetailField label="Species">
          <RelationLinks
            urls={person.species}
            resource={SpeciesResource}
            labelKey="name"
            routePrefix="/species"
          />
        </DetailField>
        <DetailField label="Vehicles">
          <RelationLinks
            urls={person.vehicles}
            resource={VehiclesResource}
            labelKey="name"
            routePrefix="/vehicles"
          />
        </DetailField>
        <DetailField label="Starships">
          <RelationLinks
            urls={person.starships}
            resource={StarshipsResource}
            labelKey="name"
            routePrefix="/starships"
          />
        </DetailField>
      </dl>
    </main>
  );
}
