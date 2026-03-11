"use client";

import type { PlanetView } from "@/lib/swapi/schema/planetView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import {
  FilmsResource,
  PeopleResource,
  PlanetsResource,
} from "@/lib/swapi/resources";

import {
  ColumnPanel,
  ResourceTable,
  schemaColumn,
  useSortedData,
  useTableState,
} from "../resource-table";

import { createNameCell } from "./cells/NameCell";
import { createRelationCell } from "./cells/relationCells";

const col = schemaColumn<PlanetView>();

const NameCell = createNameCell("/planets");
const ResidentsCell = createRelationCell(PeopleResource, "name", "/people");
const FilmsCell = createRelationCell(FilmsResource, "title", "/films");

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    cellClassName: "p-2 font-medium",
    CellComponent: NameCell,
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
  col("residents", { label: "Residents", CellComponent: ResidentsCell }),
  col("films", { label: "Films", CellComponent: FilmsCell }),
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
