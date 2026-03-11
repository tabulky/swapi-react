"use client";

import type { PersonView } from "@/lib/swapi/schema/personView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import {
  FilmsResource,
  PeopleResource,
  PlanetsResource,
  SpeciesResource,
  StarshipsResource,
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
import { createRelationLinkCell } from "./cells/createRelationLinkCell";

const col = schemaColumn<PersonView>();

const NameCell = createNameCell("/people");
const HomeworldCell = createRelationLinkCell(
  PlanetsResource,
  "name",
  "/planets",
);
const FilmsCell = createRelationTagsCell(FilmsResource, "title", "/films");
const SpeciesCell = createRelationTagsCell(SpeciesResource, "name", "/species");
const VehiclesCell = createRelationTagsCell(
  VehiclesResource,
  "name",
  "/vehicles",
);
const StarshipsCell = createRelationTagsCell(
  StarshipsResource,
  "name",
  "/starships",
);

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    cellClassName: "p-2 font-light",
    CellComponent: NameCell,
  }),
  col("gender", { type: "text", label: "Gender" }),
  col("birth_year", { type: "text", label: "Birth Year" }),
  col("height", { type: "numeric", label: "Height", numericUnit: " cm" }),
  col("mass", { type: "numeric", label: "Mass", numericUnit: " kg" }),
  col("hair_color", { type: "tagArray", label: "Hair Color" }),
  col("eye_color", { type: "tagArray", label: "Eye Color" }),
  col("skin_color", { type: "tagArray", label: "Skin Color" }),
  col("homeworld", { label: "Homeworld", CellComponent: HomeworldCell }),
  col("films", { label: "Films", CellComponent: FilmsCell }),
  col("species", { label: "Species", CellComponent: SpeciesCell }),
  col("vehicles", { label: "Vehicles", CellComponent: VehiclesCell }),
  col("starships", { label: "Starships", CellComponent: StarshipsCell }),
];

export default function PeopleTable() {
  const people = useSwapiResource(PeopleResource);
  const tableState = useTableState(columns);
  const sortedData = useSortedData(
    people.data,
    columns,
    tableState.sortEntries,
  );

  return (
    <>
      <ColumnPanel tableState={tableState} />
      <ResourceTable
        resource={people}
        tableState={tableState}
        data={sortedData}
        getRowKey={(p) => p.url}
      />
    </>
  );
}
