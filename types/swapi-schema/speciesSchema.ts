/**
 * This file is auto-generated. Do not edit manually.
 * Run `pnpm gen:swapi` to regenerate the schema.
 */

import * as v from "valibot";

export const speciesSchema = v.object({
  name: v.string(),
  classification: v.string(),
  designation: v.string(),
  average_height: v.string(),
  skin_colors: v.string(),
  hair_colors: v.string(),
  eye_colors: v.string(),
  average_lifespan: v.string(),
  homeworld: v.union([v.string(), v.null_()]),
  language: v.string(),
  people: v.array(v.string()),
  films: v.array(v.string()),
  created: v.string(),
  edited: v.string(),
  url: v.string(),
});

/**
 * See https://swapi.info/api/species/schema for the original JSON schema definition.
 */
export type Species = v.InferOutput<typeof speciesSchema>;
