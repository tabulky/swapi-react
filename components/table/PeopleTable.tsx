"use client";

import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { PeopleResource } from "@/lib/swapi/resources";

import { Tag } from "../Tag";
import { TableLoadingState } from "../TableLoadingState";
import { MixedCell } from "./MixedCell";

export default function PeopleTable() {
  const people = useSwapiResource(PeopleResource);

  return (
    <div>
      <div className="flex items-center gap-2 px-2">
        <button
          className="font-bold rounded bg-foreground/10 px-2 py-1 hover:bg-foreground/20"
          onClick={() => people.refetch(true)}
        >
          Refresh
        </button>

        <div>
          <TableLoadingState resource={people} />
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-background/90 backdrop-blur-sm">
          <tr className="border-b border-foreground/20 text-left">
            <th scope="col" className="p-2">Name</th>
            <th scope="col" className="p-2">Gender</th>
            <th scope="col" className="p-2">Birth Year</th>
            <th scope="col" className="p-2 text-center">Height</th>
            <th scope="col" className="p-2 text-center">Mass</th>
            <th scope="col" className="p-2">Hair Color</th>
            <th scope="col" className="p-2">Eye Color</th>
            <th scope="col" className="p-2">Skin Color</th>
          </tr>
        </thead>
        <tbody>
          {people.data?.map((person) => (
            <tr
              key={person.url}
              className="border-b border-foreground/10 hover:bg-foreground/5"
            >
              <td className="p-2 font-medium">{person.name}</td>
              <td className="p-2">{person.gender}</td>
              <td className="p-2">{person.birth_year}</td>
              <MixedCell value={person.height} numericUnit=" cm" />
              <MixedCell value={person.mass} numericUnit=" kg" />
              <td className="p-2">
                {person.hair_color.map((color) => <Tag key={color}>{color}
                </Tag>)}
              </td>
              <td className="p-2">
                {person.eye_color.map((color) => <Tag key={color}>{color}
                </Tag>)}
              </td>
              <td className="p-2">
                {person.skin_color.map((color) => <Tag key={color}>{color}
                </Tag>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
