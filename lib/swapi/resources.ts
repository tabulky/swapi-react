import * as v from "valibot";
import { defineResource } from "@/lib/fetch-store/defineResource";
import { SWAPI_BASE_URL } from "./config";
import { planetViewSchema, type PlanetView } from "@/types/planetView";
import { personViewSchema, type PersonView } from "@/types/personView";

const parsePlanets = (raw: unknown): PlanetView[] =>
  v.parse(v.array(planetViewSchema), raw);

export const PlanetsResource = defineResource(
  `${SWAPI_BASE_URL}/planets`,
  parsePlanets,
);

const parsePersons = (raw: unknown): PersonView[] =>
  v.parse(v.array(personViewSchema), raw);

export const PeopleResource = defineResource(
  `${SWAPI_BASE_URL}/people`,
  parsePersons,
);
