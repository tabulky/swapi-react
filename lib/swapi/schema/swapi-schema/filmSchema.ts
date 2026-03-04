/**
 * This file is auto-generated. Do not edit manually.
 * Run `pnpm gen:swapi` to regenerate the schema.
 */

import * as v from "valibot";

export const filmSchema = v.object({
  title: v.string(),
  episode_id: v.pipe(v.number(), v.integer()),
  opening_crawl: v.string(),
  director: v.string(),
  producer: v.string(),
  release_date: v.string(),
  characters: v.array(v.string()),
  planets: v.array(v.string()),
  starships: v.array(v.string()),
  vehicles: v.array(v.string()),
  species: v.array(v.string()),
  created: v.string(),
  edited: v.string(),
  url: v.string(),
});

/**
 * See https://swapi.info/api/films/schema for the original JSON schema definition.
 */
export type Film = v.InferOutput<typeof filmSchema>;
