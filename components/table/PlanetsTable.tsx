"use client";

import type { PlanetView } from "@/types/planetView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { PlanetsResource } from "@/lib/swapi/resources";

import { ResourceTable, schemaColumn } from "../resource-table";

import { ResidentsCell } from "./cells/ResidentsCell";

const col = schemaColumn<PlanetView>();

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    cellClassName: "p-2 font-medium",
  }),
  col("climate", { type: "tagArray", label: "Climate" }),
  col("terrain", { type: "tagArray", label: "Terrain" }),
  col("population", { type: "numeric", label: "Population" }),
  col("diameter", { type: "numeric", label: "Diameter", numericUnit: " km" }),
  col("gravity", { type: "text", label: "Gravity" }),
  col("rotation_period", {
    type: "numeric",
    label: "Rotation Period",
    numericUnit: " h",
  }),
  col("orbital_period", {
    type: "numeric",
    label: "Orbital Period",
    numericUnit: " days",
  }),
  col("surface_water", {
    type: "numeric",
    label: "Surface Water",
    numericUnit: "%",
  }),
  col("residents", { label: "People", CellComponent: ResidentsCell }),
];

export default function PlanetsTable() {
  const planets = useSwapiResource(PlanetsResource);

  return (
    <ResourceTable
      resource={planets}
      columns={columns}
      getRowKey={(p) => p.url}
    />
  );
}
