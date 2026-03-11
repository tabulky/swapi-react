"use client";

import type { VehicleView } from "@/lib/swapi/schema/vehicleView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import {
  FilmsResource,
  PeopleResource,
  VehiclesResource,
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

const col = schemaColumn<VehicleView>();

const NameCell = createNameCell("/vehicles");
const PilotsCell = createRelationTagsCell(PeopleResource, "name", "/people");
const FilmsCell = createRelationTagsCell(FilmsResource, "title", "/films");

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    cellClassName: "p-2 font-medium",
    CellComponent: NameCell,
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
  col("pilots", { label: "Pilots", CellComponent: PilotsCell }),
  col("films", { label: "Films", CellComponent: FilmsCell }),
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
