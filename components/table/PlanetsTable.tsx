"use client";

import type { PlanetView } from "@/lib/swapi/schema/planetView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { PlanetsResource } from "@/lib/swapi/resources";

import {
  ColumnPanel,
  ResourceTable,
  schemaColumn,
  useSortedData,
  useTableState,
} from "../resource-table";

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
  const tableState = useTableState(columns);
  const sortedData = useSortedData(
    planets.data,
    columns,
    tableState.sortEntries,
  );

  return (
    <>
      <ColumnPanel tableState={tableState} />
      <ResourceTable
        resource={planets}
        tableState={tableState}
        data={sortedData}
        getRowKey={(p) => p.url}
      />
    </>
  );
}
