"use client";

import type { VehicleView } from "@/lib/swapi/schema/vehicleView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { VehiclesResource } from "@/lib/swapi/resources";

import {
  ColumnPanel,
  ResourceTable,
  schemaColumn,
  useSortedData,
  useTableState,
} from "../resource-table";

import { createNameCell } from "./cells/createNameCell";
import { FilmTagsCell, PersonTagsCell } from "./cells/relationCells";

const col = schemaColumn<VehicleView>();

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    CellComponent: createNameCell("/vehicles"),
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
  col("pilots", { label: "Pilots", CellComponent: PersonTagsCell }),
  col("films", { label: "Films", CellComponent: FilmTagsCell }),
];

export default function VehiclesTable() {
  const vehicles = useSwapiResource(VehiclesResource);
  const tableState = useTableState(columns);
  const sortedData = useSortedData(
    vehicles.data,
    columns,
    tableState.sortEntries,
  );

  return (
    <>
      <ColumnPanel tableState={tableState} />
      <ResourceTable
        resource={vehicles}
        tableState={tableState}
        data={sortedData}
        getRowKey={(v) => v.url}
      />
    </>
  );
}
