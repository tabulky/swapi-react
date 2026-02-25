"use client";

import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { PlanetsResource } from "@/lib/swapi/resources";

import { Tag } from "./Tag";

export default function PlanetsTable() {
  const planets = useSwapiResource(PlanetsResource);

  if (planets.state === "loading") return <p>Loading planets…</p>;
  if (planets.state === "error") return <p>Error: {planets.error?.message}</p>;
  if (!planets.data) return null;

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-foreground/20 text-left">
          <th className="p-2">Name</th>
          <th className="p-2">Climate</th>
          <th className="p-2">Terrain</th>
          <th className="p-2">Population</th>
          <th className="p-2">Diameter</th>
          <th className="p-2">Gravity</th>
        </tr>
      </thead>
      <tbody>
        {planets.data.map((planet) => (
          <tr key={planet.url} className="border-b border-foreground/10">
            <td className="p-2 font-medium">{planet.name}</td>
            <td className="p-2">
              {planet.climate.map((climate) => (
                <Tag key={climate}>{climate}</Tag>
              ))}
            </td>
            <td className="p-2">
              {planet.terrain.map((terrain) => (
                <Tag key={terrain}>{terrain}</Tag>
              ))}
            </td>
            <td className="p-2">{planet.population}</td>
            <td className="p-2">{planet.diameter}</td>
            <td className="p-2">{planet.gravity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
