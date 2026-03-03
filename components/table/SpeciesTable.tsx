"use client";

import type { SpeciesView } from "@/types/speciesView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { SpeciesResource } from "@/lib/swapi/resources";

import { ColumnPanel, ResourceTable, schemaColumn, useTableState } from "../resource-table";

const col = schemaColumn<SpeciesView>();

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    cellClassName: "p-2 font-medium",
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
];

export default function SpeciesTable() {
  const species = useSwapiResource(SpeciesResource);
  const tableState = useTableState(columns, species.data);

  return (
    <>
      <ColumnPanel tableState={tableState} />
      <ResourceTable
        resource={species}
        tableState={tableState}
        getRowKey={(s) => s.url}
      />
    </>
  );
}
