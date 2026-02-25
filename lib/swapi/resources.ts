import * as v from "valibot";
import { defineResource } from "@/lib/fetch-store/defineResource";
import { SWAPI_BASE_URL } from "./config";
import {
  planetSchema,
  type Planet,
} from "@/types/swapi-schema/planetSchema";

const parsePlanets = (raw: unknown): Planet[] =>
  v.parse(v.array(planetSchema), raw);

export const PlanetsResource = defineResource(
  `${SWAPI_BASE_URL}/planets`,
  parsePlanets,
);
