/**
 * This file is auto-generated. Do not edit manually.
 * Run `pnpm gen:swapi` to regenerate the schema.
 */

import * as v from "valibot";

export const planetSchema = v.object({
  name: v.string(),
  rotation_period: v.string(),
  orbital_period: v.string(),
  diameter: v.string(),
  climate: v.string(),
  gravity: v.string(),
  terrain: v.string(),
  surface_water: v.string(),
  population: v.string(),
  residents: v.array(v.string()),
  films: v.array(v.string()),
  created: v.string(),
  edited: v.string(),
  url: v.string(),
});

/**
 * See https://swapi.info/api/planets/schema for the original JSON schema definition.
 */
export type Planet = v.InferOutput<typeof planetSchema>;
