/**
 * This file is auto-generated. Do not edit manually.
 * Run `pnpm gen:swapi` to regenerate the schema.
 */

import * as v from "valibot";

export const vehicleSchema = v.object({
  name: v.string(),
  model: v.string(),
  manufacturer: v.string(),
  cost_in_credits: v.string(),
  length: v.string(),
  max_atmosphering_speed: v.string(),
  crew: v.string(),
  passengers: v.string(),
  cargo_capacity: v.string(),
  consumables: v.string(),
  vehicle_class: v.string(),
  pilots: v.array(v.string()),
  films: v.array(v.string()),
  created: v.string(),
  edited: v.string(),
  url: v.string(),
});

/**
 * See https://swapi.info/api/vehicles/schema for the original JSON schema definition.
 */
export type Vehicle = v.InferOutput<typeof vehicleSchema>;
