"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  DetailField,
  TagArrayValue,
} from "@/components/detail/DetailField";
import { RelationDetails } from "@/components/detail/RelationDetails";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import {
  FilmDetailResource,
  FilmsResource,
  PeopleResource,
  PlanetsResource,
  SpeciesResource,
  StarshipsResource,
  VehiclesResource,
} from "@/lib/swapi/resources";

export default function FilmDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: film } = useSwapiResource(FilmDetailResource, id);

  useSwapiResource(FilmsResource);

  if (!film) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-foreground/50">Loading…</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/films"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        &larr; Back to Films
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">
        <span className="text-foreground/50 text-xl">
          Episode {film.episode_id}
          {" — "}
        </span>
        {film.title}
      </h1>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
        <DetailField label="Director">{film.director}</DetailField>
        <DetailField label="Producer(s)">
          <TagArrayValue value={film.producer} />
        </DetailField>
        <DetailField label="Release Date">{film.release_date}</DetailField>
        <DetailField label="Opening Crawl">
          <p className="whitespace-pre-line leading-relaxed max-w-prose">
            {film.opening_crawl.replace(/\r\n/g, "\n")}
          </p>
        </DetailField>
      </dl>

      <div className="mt-6 flex flex-col gap-2">
        <RelationDetails
          label="Characters"
          urls={film.characters}
          resource={PeopleResource}
          labelKey="name"
          routePrefix="/people"
        />
        <RelationDetails
          label="Planets"
          urls={film.planets}
          resource={PlanetsResource}
          labelKey="name"
          routePrefix="/planets"
        />
        <RelationDetails
          label="Starships"
          urls={film.starships}
          resource={StarshipsResource}
          labelKey="name"
          routePrefix="/starships"
        />
        <RelationDetails
          label="Vehicles"
          urls={film.vehicles}
          resource={VehiclesResource}
          labelKey="name"
          routePrefix="/vehicles"
        />
        <RelationDetails
          label="Species"
          urls={film.species}
          resource={SpeciesResource}
          labelKey="name"
          routePrefix="/species"
        />
      </div>
    </main>
  );
}
