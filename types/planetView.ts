/**
 * Enriched Planet schema for app use.
 * Extends the auto-generated planetSchema, overriding
 * `climate` and `terrain` from comma-separated strings to string arrays,
 * and numeric string fields to `number | string`.
 */

import * as v from "valibot";
import { planetSchema, type Planet } from "./swapi-schema/planetSchema";
import { toNumberOrString, toStringArray } from "./viewSchemaHelpers";

export const planetViewSchema = v.object({
  ...planetSchema.entries,
  // key field, not specified in the original schema
  url: v.pipe(v.string(), v.url()),
  // numeric fields: convert to number when possible, keep string otherwise
  rotation_period: toNumberOrString,
  orbital_period: toNumberOrString,
  diameter: toNumberOrString,
  surface_water: toNumberOrString,
  population: toNumberOrString,
  // override fields, converting comma-separated strings to string arrays
  climate: toStringArray,
  terrain: toStringArray,
  // foreign key fields
  residents: v.array(v.pipe(v.string(), v.url())),
  films: v.array(v.pipe(v.string(), v.url())),
});

// This will ensure that the API output match expected input for the view
export type PlanetViewInput = v.InferInput<typeof planetSchema> & Planet;
export type PlanetView = v.InferOutput<typeof planetViewSchema>;
