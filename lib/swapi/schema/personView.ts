/**
 * Enriched Person schema for app use.
 * Extends the auto-generated personSchema, overriding
 * `hair_color`, `skin_color`, and `eye_color` from comma-separated strings to string arrays,
 * and numeric string fields to `number | string`.
 */

import * as v from "valibot";
import { personSchema, type Person } from "./swapi-schema/personSchema";
import { toNumberOrString, toStringArray } from "./viewSchemaHelpers";

export const personViewSchema = v.object({
  ...personSchema.entries,
  // key field, validated as URL
  url: v.pipe(v.string(), v.url()),
  // numeric fields: convert to number when possible, keep string otherwise
  height: toNumberOrString,
  mass: toNumberOrString,
  // override fields, converting comma-separated strings to string arrays
  hair_color: toStringArray,
  skin_color: toStringArray,
  eye_color: toStringArray,
  // foreign key fields
  homeworld: v.pipe(v.string(), v.url()),
  films: v.array(v.pipe(v.string(), v.url())),
  species: v.array(v.pipe(v.string(), v.url())),
  vehicles: v.array(v.pipe(v.string(), v.url())),
  starships: v.array(v.pipe(v.string(), v.url())),
});

// This will ensure that the API output match expected input for the view
export type PersonViewInput = v.InferInput<typeof personSchema> & Person;
export type PersonView = v.InferOutput<typeof personViewSchema>;
