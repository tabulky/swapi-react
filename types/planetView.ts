/**
 * Enriched Planet schema for app use.
 * Extends the auto-generated planetSchema, overriding
 * `climate` and `terrain` from comma-separated strings to string arrays.
 */

import * as v from "valibot";
import { planetSchema, type Planet } from "./swapi-schema/planetSchema";

const RE_SPLIT_COMMA = /,\s*/;

export const planetViewSchema = v.object({
  ...planetSchema.entries,
  // key field, not specified in the original schema
  url: v.pipe(v.string(), v.url()),
  // override fields, converting comma-separated strings to string arrays
  climate: v.pipe(
    v.string(),
    v.transform((str) => str.split(RE_SPLIT_COMMA).map((s) => s.trim())),
  ),
  terrain: v.pipe(
    v.string(),
    v.transform((str) => str.split(RE_SPLIT_COMMA).map((s) => s.trim())),
  ),
  // foreign key fields
  residents: v.array(v.pipe(v.string(), v.url())),
  films: v.array(v.pipe(v.string(), v.url())),
});

// This will ensure that the API output match expected input for the view
export type PlanetViewInput = v.InferInput<typeof planetSchema> & Planet;
export type PlanetView = v.InferOutput<typeof planetViewSchema>;
