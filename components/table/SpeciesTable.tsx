"use client";

import type { SpeciesView } from "@/lib/swapi/schema/speciesView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import {
  FilmsResource,
  PeopleResource,
  PlanetsResource,
  SpeciesResource,
} from "@/lib/swapi/resources";

import {
  ColumnPanel,
  ResourceTable,
  schemaColumn,
  useSortedData,
  useTableState,
} from "../resource-table";

import { createNameCell } from "./cells/createNameCell";
import { createRelationTagsCell } from "./cells/createRelationTagsCell";
import { createRelationLinkCell } from "./cells/createRelationLinkCell";

const col = schemaColumn<SpeciesView>();

const NameCell = createNameCell("/species");
const HomeworldCell = createRelationLinkCell(
  PlanetsResource,
  "name",
  "/planets",
);
const PeopleCell = createRelationTagsCell(PeopleResource, "name", "/people");
const FilmsCell = createRelationTagsCell(FilmsResource, "title", "/films");

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    cellClassName: "p-2 font-medium",
    CellComponent: NameCell,
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
  col("homeworld", { label: "Homeworld", CellComponent: HomeworldCell }),
  col("people", { label: "People", CellComponent: PeopleCell }),
  col("films", { label: "Films", CellComponent: FilmsCell }),
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
