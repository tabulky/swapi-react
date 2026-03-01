"use client";

import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { PlanetsResource } from "@/lib/swapi/resources";

import { Tag } from "./Tag";
import { TableLoadingState } from "./TableLoadingState";

function MixedCell({ value }: { value: number | string }) {
  const isNumber = typeof value === "number";
  return (
    <td className={`p-2 tabular-nums${isNumber ? " text-right" : ""}`}>
      {isNumber ? value.toLocaleString() : value}
    </td>
  );
}

export default function PlanetsTable() {
  const planets = useSwapiResource(PlanetsResource);

  return (
    <div>
      <div className="flex items-center gap-2 px-2">
        <button
          className="font-bold rounded bg-foreground/10 px-2 py-1 hover:bg-foreground/20"
          onClick={() => planets.refetch(true)}
        >
          Refresh
        </button>

        <div>
          <TableLoadingState resource={planets} />
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-background/90 backdrop-blur-sm">
          <tr className="border-b border-foreground/20 text-left">
            <th scope="col" className="p-2">Name</th>
            <th scope="col" className="p-2">Climate</th>
            <th scope="col" className="p-2">Terrain</th>
            <th scope="col" className="p-2">Population</th>
            <th scope="col" className="p-2">Diameter</th>
            <th scope="col" className="p-2">Gravity</th>
          </tr>
        </thead>
        <tbody>
          {planets.data?.map((planet) => (
            <tr
              key={planet.url}
              className="border-b border-foreground/10 hover:bg-foreground/5"
            >
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
              <MixedCell value={planet.population} />
              <MixedCell value={planet.diameter} />
              <td className="p-2">{planet.gravity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
