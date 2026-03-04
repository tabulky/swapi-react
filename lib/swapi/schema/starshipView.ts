/**
 * Enriched Starship schema for app use.
 * Extends the auto-generated starshipSchema, overriding
 * `manufacturer` from a comma-separated string to a string array,
 * and numeric string fields to `number | string`.
 */

import * as v from "valibot";
import { starshipSchema, type Starship } from "./swapi-schema/starshipSchema";
import { toCorpStringArray, toNumberOrString } from "./viewSchemaHelpers";

export const starshipViewSchema = v.object({
  ...starshipSchema.entries,
  // key field, validated as URL
  url: v.pipe(v.string(), v.url()),
  // numeric fields: convert to number when possible, keep string otherwise
  cost_in_credits: toNumberOrString,
  length: toNumberOrString,
  max_atmosphering_speed: toNumberOrString,
  crew: toNumberOrString,
  passengers: toNumberOrString,
  cargo_capacity: toNumberOrString,
  hyperdrive_rating: toNumberOrString,
  MGLT: toNumberOrString,
  // override: comma-separated manufacturers to string array
  manufacturer: toCorpStringArray,
  // foreign key fields
  pilots: v.array(v.pipe(v.string(), v.url())),
  films: v.array(v.pipe(v.string(), v.url())),
});

// This will ensure that the API output match expected input for the view
export type StarshipViewInput = v.InferInput<typeof starshipSchema> & Starship;
export type StarshipView = v.InferOutput<typeof starshipViewSchema>;
