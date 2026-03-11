"use client";

import type { SpeciesView } from "@/lib/swapi/schema/speciesView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { SpeciesResource } from "@/lib/swapi/resources";

import {
  ColumnPanel,
  ResourceTable,
  schemaColumn,
  useSortedData,
  useTableState,
} from "../resource-table";

import { createNameCell } from "./cells/createNameCell";
import {
  FilmTagsCell,
  PersonTagsCell,
  PlanetLinkCell,
} from "./cells/relationCells";

const col = schemaColumn<SpeciesView>();
const columns = [
  col("name", {
    type: "text",
    label: "Name",
    CellComponent: createNameCell("/species"),
  }),
  col("classification", { type: "text", label: "Classification" }),
  col("designation", { type: "text", label: "Designation" }),
  col("language", { type: "text", label: "Language" }),
  col("average_height", {
    type: "numeric",
    label: "Avg. Height",
    numericUnit: " cm",
  }),
  col("average_lifespan", {
    type: "numeric",
    label: "Avg. Lifespan",
    numericUnit: " years",
  }),
  col("skin_colors", { type: "tagArray", label: "Skin Colors" }),
  col("hair_colors", { type: "tagArray", label: "Hair Colors" }),
  col("eye_colors", { type: "tagArray", label: "Eye Colors" }),
  col("homeworld", { label: "Homeworld", CellComponent: PlanetLinkCell }),
  col("people", { label: "People", CellComponent: PersonTagsCell }),
  col("films", { label: "Films", CellComponent: FilmTagsCell }),
];

export default function SpeciesTable() {
  const species = useSwapiResource(SpeciesResource);
  const tableState = useTableState(columns);
  const sortedData = useSortedData(
    species.data,
    columns,
    tableState.sortEntries,
  );

  return (
    <>
      <ColumnPanel tableState={tableState} />
      <ResourceTable
        resource={species}
        tableState={tableState}
        data={sortedData}
        getRowKey={(s) => s.url}
      />
    </>
  );
}
