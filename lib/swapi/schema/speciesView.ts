/**
 * Enriched Species schema for app use.
 * Extends the auto-generated speciesSchema, overriding
 * color fields from comma-separated strings to string arrays,
 * and numeric string fields to `number | string`.
 */

import * as v from "valibot";
import { speciesSchema, type Species } from "./swapi-schema/speciesSchema";
import { toNumberOrString, toStringArray } from "./viewSchemaHelpers";

export const speciesViewSchema = v.object({
  ...speciesSchema.entries,
  // key field, validated as URL
  url: v.pipe(v.string(), v.url()),
  // numeric fields: convert to number when possible, keep string otherwise
  average_height: toNumberOrString,
  average_lifespan: toNumberOrString,
  // override: comma-separated colors to string arrays
  skin_colors: toStringArray,
  hair_colors: toStringArray,
  eye_colors: toStringArray,
  // homeworld can be null for some species (e.g. Droids)
  homeworld: v.union([v.pipe(v.string(), v.url()), v.null_()]),
  // foreign key fields
  people: v.array(v.pipe(v.string(), v.url())),
  films: v.array(v.pipe(v.string(), v.url())),
});

export type SpeciesViewInput = v.InferInput<typeof speciesSchema> & Species;
export type SpeciesView = v.InferOutput<typeof speciesViewSchema>;
