import type { ResourceDefinition, ResourceParser } from "./types";

/**
 * Binds a URL (or URL factory) to a parser, creating a typed resource definition.
 *
 * @example Static URL
 * ```ts
 * const PlanetsResource = defineResource(
 *   "https://swapi.info/api/planets",
 *   parsePlanets,
 * );
 * ```
 *
 * @example Dynamic URL
 * ```ts
 * const PlanetResource = defineResource(
 *   (id: string) => `https://swapi.info/api/planets/${id}`,
 *   parsePlanet,
 * );
 * ```
 *
 * @example Conditional — return `null` to skip the fetch
 * ```ts
 * const MaybePlanetResource = defineResource(
 *   (id: string | undefined) => id ? `https://swapi.info/api/planets/${id}` : null,
 *   parsePlanet,
 * );
 * ```
 */
export function defineResource<T>(
  url: string,
  parser: ResourceParser<T>,
): ResourceDefinition<T, []>;
export function defineResource<T, Args extends unknown[]>(
  url: (...args: Args) => string | null,
  parser: ResourceParser<T>,
): ResourceDefinition<T, Args>;
export function defineResource<T, Args extends unknown[]>(
  url: string | ((...args: Args) => string | null),
  parser: ResourceParser<T>,
): ResourceDefinition<T, Args> {
  return { url, parse: parser };
}
