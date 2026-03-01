"use client";

import type { PlanetView } from "@/types/planetView";
import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { PlanetsResource } from "@/lib/swapi/resources";

import type { ColumnDef } from "../resource-table/columns";
import { Tag } from "../Tag";
import ResourceTable from "../resource-table/ResourceTable";

import { MixedCell } from "./cells/MixedCell";

const columns: ColumnDef<PlanetView>[] = [
  {
    id: "name",
    header: "Name",
    sortable: true,
    getSortValue: (p) => p.name,
    cellClassName: "p-2 font-medium",
    renderCell: (p) => p.name,
  },
  {
    id: "climate",
    header: "Climate",
    renderCell: (p) => p.climate.map((c) => <Tag key={c}>{c}</Tag>),
  },
  {
    id: "terrain",
    header: "Terrain",
    renderCell: (p) => p.terrain.map((t) => <Tag key={t}>{t}</Tag>),
  },
  {
    id: "population",
    header: "Population",
    headerClassName: "text-center",
    sortable: true,
    getSortValue: (p) => typeof p.population === "number" ? p.population : null,
    fullCell: true,
    renderCell: (p) => <MixedCell value={p.population} />,
  },
  {
    id: "diameter",
    header: "Diameter",
    headerClassName: "text-center",
    sortable: true,
    getSortValue: (p) => (typeof p.diameter === "number" ? p.diameter : null),
    fullCell: true,
    renderCell: (p) => <MixedCell value={p.diameter} numericUnit=" km" />,
  },
  {
    id: "gravity",
    header: "Gravity",
    sortable: true,
    getSortValue: (p) => p.gravity,
    renderCell: (p) => p.gravity,
  },
  {
    id: "rotation_period",
    header: "Rotation Period",
    headerClassName: "text-center",
    sortable: true,
    getSortValue: (p) =>
      typeof p.rotation_period === "number" ? p.rotation_period : null,
    fullCell: true,
    renderCell: (p) => <MixedCell value={p.rotation_period} numericUnit=" h" />,
  },
  {
    id: "orbital_period",
    header: "Orbital Period",
    headerClassName: "text-center",
    sortable: true,
    getSortValue: (p) =>
      typeof p.orbital_period === "number" ? p.orbital_period : null,
    fullCell: true,
    renderCell: (p) => (
      <MixedCell value={p.orbital_period} numericUnit=" days" />
    ),
  },
  {
    id: "surface_water",
    header: "Surface Water",
    headerClassName: "text-center",
    sortable: true,
    getSortValue: (p) =>
      typeof p.surface_water === "number" ? p.surface_water : null,
    fullCell: true,
    renderCell: (p) => <MixedCell value={p.surface_water} numericUnit="%" />,
  },
];

export default function PlanetsTable() {
  const planets = useSwapiResource(PlanetsResource);

  return (
    <ResourceTable
      resource={planets}
      columns={columns}
      getRowKey={(p) => p.url}
    />
  );
}
