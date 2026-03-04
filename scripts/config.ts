export { SWAPI_BASE_URL } from "../lib/swapi/config.ts";

export const SWAPI_SCHEMA_DIR = new URL(
  "../lib/swapi/schema/swapi-schema/",
  import.meta.url,
).pathname;

export const SWAPI_SAMPLE_DATA_DIR = new URL(
  "../sample-data/swapi.info/",
  import.meta.url,
).pathname;
