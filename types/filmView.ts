/**
 * Enriched Film schema for app use.
 * Extends the auto-generated filmSchema, overriding
 * `producer` from a comma-separated string to a string array,
 * and foreign key arrays to validated URL arrays.
 */

import * as v from "valibot";
import { filmSchema, type Film } from "./swapi-schema/filmSchema";
import { toStringArray } from "./viewSchemaHelpers";

export const filmViewSchema = v.object({
  ...filmSchema.entries,
  // key field, validated as URL
  url: v.pipe(v.string(), v.url()),
  // override: comma-separated producers to string array
  producer: toStringArray,
  // foreign key fields
  characters: v.array(v.pipe(v.string(), v.url())),
  planets: v.array(v.pipe(v.string(), v.url())),
  starships: v.array(v.pipe(v.string(), v.url())),
  vehicles: v.array(v.pipe(v.string(), v.url())),
  species: v.array(v.pipe(v.string(), v.url())),
});

// This will ensure that the API output match expected input for the view
export type FilmViewInput = v.InferInput<typeof filmSchema> & Film;
export type FilmView = v.InferOutput<typeof filmViewSchema>;
