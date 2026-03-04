"use client";

import type { PersonView } from "@/types/personView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { PeopleResource } from "@/lib/swapi/resources";

import {
  ColumnPanel,
  ResourceTable,
  schemaColumn,
  useSortedData,
  useTableState,
} from "../resource-table";

const col = schemaColumn<PersonView>();

const columns = [
  col("name", {
    type: "text",
    label: "Name",
    cellClassName: "p-2 font-medium",
  }),
  col("gender", { type: "text", label: "Gender" }),
  col("birth_year", { type: "text", label: "Birth Year" }),
  col("height", { type: "numeric", label: "Height", numericUnit: " cm" }),
  col("mass", { type: "numeric", label: "Mass", numericUnit: " kg" }),
  col("hair_color", { type: "tagArray", label: "Hair Color" }),
  col("eye_color", { type: "tagArray", label: "Eye Color" }),
  col("skin_color", { type: "tagArray", label: "Skin Color" }),
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
