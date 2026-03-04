/**
 * This file is auto-generated. Do not edit manually.
 * Run `pnpm gen:swapi` to regenerate the schema.
 */

import * as v from "valibot";

export const personSchema = v.object({
  name: v.string(),
  height: v.string(),
  mass: v.string(),
  hair_color: v.string(),
  skin_color: v.string(),
  eye_color: v.string(),
  birth_year: v.string(),
  gender: v.string(),
  homeworld: v.string(),
  films: v.array(v.string()),
  species: v.array(v.string()),
  vehicles: v.array(v.string()),
  starships: v.array(v.string()),
  created: v.string(),
  edited: v.string(),
  url: v.string(),
});

/**
 * See https://swapi.info/api/people/schema for the original JSON schema definition.
 */
export type Person = v.InferOutput<typeof personSchema>;
