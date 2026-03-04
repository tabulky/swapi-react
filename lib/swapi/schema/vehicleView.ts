/**
 * Enriched Vehicle schema for app use.
 * Extends the auto-generated vehicleSchema, overriding
 * `manufacturer` from a comma-separated string to a string array,
 * and numeric string fields to `number | string`.
 */

import * as v from "valibot";
import { vehicleSchema, type Vehicle } from "./swapi-schema/vehicleSchema";
import { toCorpStringArray, toNumberOrString } from "./viewSchemaHelpers";

export const vehicleViewSchema = v.object({
  ...vehicleSchema.entries,
  // key field, validated as URL
  url: v.pipe(v.string(), v.url()),
  // numeric fields: convert to number when possible, keep string otherwise
  cost_in_credits: toNumberOrString,
  length: toNumberOrString,
  max_atmosphering_speed: toNumberOrString,
  crew: toNumberOrString,
  passengers: toNumberOrString,
  cargo_capacity: toNumberOrString,
  // override: comma-separated manufacturers to string array
  manufacturer: toCorpStringArray,
  // foreign key fields
  pilots: v.array(v.pipe(v.string(), v.url())),
  films: v.array(v.pipe(v.string(), v.url())),
});

// This will ensure that the API output match expected input for the view
export type VehicleViewInput = v.InferInput<typeof vehicleSchema> & Vehicle;
export type VehicleView = v.InferOutput<typeof vehicleViewSchema>;
