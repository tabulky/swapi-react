"use client";

import type { VehicleView } from "@/types/vehicleView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { VehiclesResource } from "@/lib/swapi/resources";

import { ResourceTable, schemaColumn, useTableState } from "../resource-table";

const col = schemaColumn<VehicleView>();

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    cellClassName: "p-2 font-medium",
  }),
  col("model", { type: "text", label: "Model" }),
  col("vehicle_class", { type: "text", label: "Class" }),
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
  col("consumables", { type: "text", label: "Consumables" }),
];

export default function VehiclesTable() {
  const vehicles = useSwapiResource(VehiclesResource);
  const tableState = useTableState(columns, vehicles.data);

  return (
    <ResourceTable
      resource={vehicles}
      tableState={tableState}
      getRowKey={(v) => v.url}
    />
  );
}
