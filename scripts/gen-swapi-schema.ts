/**
 * This script fetches JSON schemas for all SWAPI entities and generates Valibot schemas in TypeScript.
 * It uses the `json-schema-to-valibot` package to convert JSON schemas to Valibot code.
 * The generated files are saved in `src/lib/swapiSchema/` directory.
 *
 * To run this script, use the command: `pnpm gen:swapi`
 */

import { writeFile } from "node:fs/promises";
import { format } from "prettier";

// there is some bug in node/package, other import variant does not work
import { jsonSchemaToValibot } from "json-schema-to-valibot/dist/index.mjs";
import type { JsonSchemaObject } from "json-schema-to-valibot";

import { toSingularForm } from "./lib/singularForm.ts";
import { toPascalCase } from "./lib/toPascalCase.ts";
import { fetchJSON } from "./lib/fetchJSON.ts";

import { SWAPI_BASE_URL } from "./config.ts";

const processEntity = async (entity: string, url: string) => {
  const singularEntity = toSingularForm(entity);
  const schemaName = `${singularEntity}Schema`;
  const typeName = toPascalCase(singularEntity);
  console.info(`Processing entity: ${entity}`);

  const schema = (await fetchJSON(`${url}/schema`)) as JsonSchemaObject;

  // there is violation in data, so we need fix this manually
  if (entity === "species") {
    schema.properties!.homeworld = {
      type: ["string", "null"],
    };
  }

  const valibotCode = jsonSchemaToValibot(schema, {
    name: schemaName,
    module: "esm",
  });

  const moduleCode = [
    "/**",
    " * This file is auto-generated. Do not edit manually.",
    " * Run `pnpm gen:swapi` to regenerate the schema.",
    " */",
    "",
    valibotCode,
    "/**",
    ` * See ${url}/schema for the original JSON schema definition.`,
    " */",
    `export type ${typeName} = v.InferOutput<typeof ${schemaName}>;`,
  ].join("\n");

  // TODO: move to config.ts
  const absolutePath = new URL(
    `../types/swapi-schema/${schemaName}.ts`,
    import.meta.url,
  ).pathname;

  await writeFile(
    absolutePath,
    await format(moduleCode, { parser: "typescript" }),
  );
};

async function main() {
  console.info("Generating SWAPI schemas...");
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
