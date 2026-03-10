"use client";

import type { StarshipView } from "@/lib/swapi/schema/starshipView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import {
  FilmsResource,
  PeopleResource,
  StarshipsResource,
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

const col = schemaColumn<StarshipView>();

const NameCell = createNameCell("/starships");
const PilotsCell = createRelationCell(PeopleResource, "name", "/people");
const FilmsCell = createRelationCell(FilmsResource, "title", "/films");

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    cellClassName: "p-2 font-medium",
    CellComponent: NameCell,
  }),
  col("model", { type: "text", label: "Model" }),
  col("starship_class", { type: "text", label: "Class" }),
  col("manufacturer", { type: "tagArray", label: "Manufacturer" }),
  col("cost_in_credits", {
    type: "numeric",
    label: "Cost",
    numericUnit: " credits",
  }),
  col("length", { type: "numeric", label: "Length", numericUnit: " m" }),
  col("max_atmosphering_speed", {
    type: "numeric",
    label: "Max Speed",
  }),
  col("crew", { type: "numeric", label: "Crew" }),
  col("passengers", { type: "numeric", label: "Passengers" }),
  col("cargo_capacity", {
    type: "numeric",
    label: "Cargo Capacity",
    numericUnit: " kg",
  }),
  col("hyperdrive_rating", { type: "numeric", label: "Hyperdrive Rating" }),
  col("MGLT", { type: "numeric", label: "MGLT" }),
  col("consumables", { type: "text", label: "Consumables" }),
  col("pilots", { label: "Pilots", CellComponent: PilotsCell }),
  col("films", { label: "Films", CellComponent: FilmsCell }),
];

export default function StarshipsTable() {
  const starships = useSwapiResource(StarshipsResource);
  const tableState = useTableState(columns);
  const sortedData = useSortedData(
    starships.data,
    columns,
    tableState.sortEntries,
  );

  return (
    <>
      <ColumnPanel tableState={tableState} />
      <ResourceTable
        resource={starships}
        tableState={tableState}
        data={sortedData}
        getRowKey={(s) => s.url}
      />
    </>
  );
}
