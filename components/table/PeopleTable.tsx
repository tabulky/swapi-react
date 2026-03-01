"use client";

import type { PersonView } from "@/types/personView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { PeopleResource } from "@/lib/swapi/resources";

import type { ColumnDef } from "../resource-table/columns";
import { Tag } from "../Tag";
import ResourceTable from "../resource-table/ResourceTable";

import { MixedCell } from "./cells/MixedCell";

const columns: ColumnDef<PersonView>[] = [
  {
    id: "name",
    header: "Name",
    sortable: true,
    getSortValue: (p) => p.name,
    cellClassName: "p-2 font-medium",
    renderCell: (p) => p.name,
  },
  {
    id: "gender",
    header: "Gender",
    sortable: true,
    getSortValue: (p) => p.gender,
    renderCell: (p) => p.gender,
  },
  {
    id: "birth_year",
    header: "Birth Year",
    sortable: true,
    getSortValue: (p) => p.birth_year,
    renderCell: (p) => p.birth_year,
  },
  {
    id: "height",
    header: "Height",
    headerClassName: "text-center",
    sortable: true,
    getSortValue: (p) => (typeof p.height === "number" ? p.height : null),
    fullCell: true,
    renderCell: (p) => <MixedCell value={p.height} numericUnit=" cm" />,
  },
  {
    id: "mass",
    header: "Mass",
    headerClassName: "text-center",
    sortable: true,
    getSortValue: (p) => (typeof p.mass === "number" ? p.mass : null),
    fullCell: true,
    renderCell: (p) => <MixedCell value={p.mass} numericUnit=" kg" />,
  },
  {
    id: "hair_color",
    header: "Hair Color",
    renderCell: (p) =>
      p.hair_color.map((color) => <Tag key={color}>{color}</Tag>),
  },
  {
    id: "eye_color",
    header: "Eye Color",
    renderCell: (p) =>
      p.eye_color.map((color) => <Tag key={color}>{color}</Tag>),
  },
  {
    id: "skin_color",
    header: "Skin Color",
    renderCell: (p) =>
      p.skin_color.map((color) => <Tag key={color}>{color}</Tag>),
  },
];

export default function PeopleTable() {
  const people = useSwapiResource(PeopleResource);

  return (
    <ResourceTable
      resource={people}
      columns={columns}
      getRowKey={(p) => p.url}
    />
  );
}
