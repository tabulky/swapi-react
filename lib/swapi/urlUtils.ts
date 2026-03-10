import { SWAPI_BASE_URL } from "./config";

/** Extract the ID from a SWAPI URL: "https://swapi.info/api/people/1" → "1" */
export function extractIdFromUrl(url: string): string {
  const segments = url.replace(/\/$/, "").split("/");
  return segments[segments.length - 1];
}

/**
 * Convert a SWAPI URL to an internal route path.
 * "https://swapi.info/api/people/1" → "/people/1"
 */
export function swapiUrlToRoute(url: string): string {
  return url.replace(SWAPI_BASE_URL, "");
}
