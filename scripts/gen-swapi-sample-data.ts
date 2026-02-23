/**
 * This script fetches JSON data for all SWAPI entities
 *
 * To run this script, use the command: `pnpm gen:mock-data`
 */

import { writeFile } from "node:fs/promises";
import { format } from "prettier";

import { toSingularForm } from "./lib/singularForm.ts";
// import { toPascalCase } from "./lib/toPascalCase.ts";
import { fetchJSON } from "./lib/fetchJSON.ts";

import { SWAPI_BASE_URL } from "./config.ts";

const processEntity = async (entity: string, url: string) => {
  const singularEntity = toSingularForm(entity);
  // const schemaName = `${singularEntity}Schema`;
  // const typeName = toPascalCase(singularEntity);
  console.info(`Processing entity: ${entity}`);

  const entities = await fetchJSON(url);

  // TODO: move to config.ts
  const absolutePath = new URL(
    `../sample-data/swapi.info/${singularEntity}.json`,
    import.meta.url,
  ).pathname;

  await writeFile(
    absolutePath,
    await format(JSON.stringify(entities, null, 2), { parser: "json" }),
  );
};

async function main() {
  console.info("Generating SWAPI sample data...");
  const entities = (await fetchJSON(`${SWAPI_BASE_URL}`)) as Record<
    string,
    string
  >;

  await Promise.all(
    Object.entries(entities).map(([entity, url]) => processEntity(entity, url)),
  );

  console.info("Done!");
}
main();
