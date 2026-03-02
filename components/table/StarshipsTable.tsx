"use client";

import type { StarshipView } from "@/types/starshipView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { StarshipsResource } from "@/lib/swapi/resources";

import { ResourceTable, schemaColumn, useTableState } from "../resource-table";

const col = schemaColumn<StarshipView>();

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    cellClassName: "p-2 font-medium",
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
];

export default function StarshipsTable() {
  const starships = useSwapiResource(StarshipsResource);
  const tableState = useTableState(columns, starships.data);

  return (
    <ResourceTable
      resource={starships}
      tableState={tableState}
      getRowKey={(s) => s.url}
    />
  );
}
