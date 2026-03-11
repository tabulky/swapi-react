import { createRelationLinkCell } from "./createRelationLinkCell";
import { createRelationTagsCell } from "./createRelationTagsCell";
import {
  PlanetsResource,
  FilmsResource,
  SpeciesResource,
  VehiclesResource,
  StarshipsResource,
  PeopleResource,
} from "@/lib/swapi/resources";

export const PlanetLinkCell = createRelationLinkCell(
  PlanetsResource,
  "name",
  "/planets",
);

export const FilmTagsCell = createRelationTagsCell(
  FilmsResource,
  "title",
  "/films",
);

export const SpeciesTagsCell = createRelationTagsCell(
  SpeciesResource,
  "name",
  "/species",
);

export const VehicleTagsCell = createRelationTagsCell(
  VehiclesResource,
  "name",
  "/vehicles",
);

export const StarshipTagsCell = createRelationTagsCell(
  StarshipsResource,
  "name",
  "/starships",
);

export const PersonTagsCell = createRelationTagsCell(
  PeopleResource,
  "name",
  "/people",
);
