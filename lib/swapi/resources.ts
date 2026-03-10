import * as v from "valibot";
import { defineResource } from "@/lib/fetch-store/defineResource";
import { SWAPI_BASE_URL } from "./config";
import { planetViewSchema, type PlanetView } from "./schema/planetView";
import { personViewSchema, type PersonView } from "./schema/personView";
import { filmViewSchema, type FilmView } from "./schema/filmView";
import { starshipViewSchema, type StarshipView } from "./schema/starshipView";
import { vehicleViewSchema, type VehicleView } from "./schema/vehicleView";
import { speciesViewSchema, type SpeciesView } from "./schema/speciesView";

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

const parseVehicles = (raw: unknown): VehicleView[] =>
  v.parse(v.array(vehicleViewSchema), raw);

export const VehiclesResource = defineResource(
  `${SWAPI_BASE_URL}/vehicles`,
  parseVehicles,
);

const parseSpecies = (raw: unknown): SpeciesView[] =>
  v.parse(v.array(speciesViewSchema), raw);

export const SpeciesResource = defineResource(
  `${SWAPI_BASE_URL}/species`,
  parseSpecies,
);

// ---------------------------------------------------------------------------
// Individual (detail) resources — for /people/:id, /planets/:id, etc.
// ---------------------------------------------------------------------------

export const PersonDetailResource = defineResource(
  (id: string) => `${SWAPI_BASE_URL}/people/${id}`,
  (raw: unknown): PersonView => v.parse(personViewSchema, raw),
);

export const PlanetDetailResource = defineResource(
  (id: string) => `${SWAPI_BASE_URL}/planets/${id}`,
  (raw: unknown): PlanetView => v.parse(planetViewSchema, raw),
);

export const FilmDetailResource = defineResource(
  (id: string) => `${SWAPI_BASE_URL}/films/${id}`,
  (raw: unknown): FilmView => v.parse(filmViewSchema, raw),
);

export const StarshipDetailResource = defineResource(
  (id: string) => `${SWAPI_BASE_URL}/starships/${id}`,
  (raw: unknown): StarshipView => v.parse(starshipViewSchema, raw),
);

export const VehicleDetailResource = defineResource(
  (id: string) => `${SWAPI_BASE_URL}/vehicles/${id}`,
  (raw: unknown): VehicleView => v.parse(vehicleViewSchema, raw),
);

export const SpeciesDetailResource = defineResource(
  (id: string) => `${SWAPI_BASE_URL}/species/${id}`,
  (raw: unknown): SpeciesView => v.parse(speciesViewSchema, raw),
);
