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
  VehicleDetailResource,
  VehiclesResource,
} from "@/lib/swapi/resources";

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: vehicle } = useSwapiResource(VehicleDetailResource, id);

  useSwapiResource(VehiclesResource);

  if (!vehicle) {
    return (
      <main className="max-w-3xl mx-auto p-8">
        <p className="text-foreground/50">Loading…</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-8">
      <Link
        href="/vehicles"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        &larr; Back to Vehicles
      </Link>
      <h1 className="text-3xl font-bold mt-2 mb-6">{vehicle.name}</h1>

      <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
        <DetailField label="Model">{vehicle.model}</DetailField>
        <DetailField label="Class">{vehicle.vehicle_class}</DetailField>
        <DetailField label="Manufacturer">
          <TagArrayValue value={vehicle.manufacturer} />
        </DetailField>
        <DetailField label="Cost">
          <NumericValue value={vehicle.cost_in_credits} unit=" credits" />
        </DetailField>
        <DetailField label="Length">
          <NumericValue value={vehicle.length} unit=" m" />
        </DetailField>
        <DetailField label="Max Speed">
          <NumericValue value={vehicle.max_atmosphering_speed} />
        </DetailField>
        <DetailField label="Crew">
          <NumericValue value={vehicle.crew} />
        </DetailField>
        <DetailField label="Passengers">
          <NumericValue value={vehicle.passengers} />
        </DetailField>
        <DetailField label="Cargo Capacity">
          <NumericValue value={vehicle.cargo_capacity} unit=" kg" />
        </DetailField>
        <DetailField label="Consumables">{vehicle.consumables}</DetailField>
        <DetailField label="Pilots">
          <RelationLinks
            urls={vehicle.pilots}
            resource={PeopleResource}
            labelKey="name"
            routePrefix="/people"
          />
        </DetailField>
        <DetailField label="Films">
          <RelationLinks
            urls={vehicle.films}
            resource={FilmsResource}
            labelKey="title"
            routePrefix="/films"
          />
        </DetailField>
      </dl>
    </main>
  );
}
