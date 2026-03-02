import * as v from "valibot";
import { defineResource } from "@/lib/fetch-store/defineResource";
import { SWAPI_BASE_URL } from "./config";
import { planetViewSchema, type PlanetView } from "@/types/planetView";
import { personViewSchema, type PersonView } from "@/types/personView";
import { filmViewSchema, type FilmView } from "@/types/filmView";
import { starshipViewSchema, type StarshipView } from "@/types/starshipView";

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

const parseFilms = (raw: unknown): FilmView[] =>
  v.parse(v.array(filmViewSchema), raw);

export const FilmsResource = defineResource(
  `${SWAPI_BASE_URL}/films`,
  parseFilms,
);

const parseStarships = (raw: unknown): StarshipView[] =>
  v.parse(v.array(starshipViewSchema), raw);

export const StarshipsResource = defineResource(
  `${SWAPI_BASE_URL}/starships`,
  parseStarships,
);
