import * as v from "valibot";

import { planetSchema } from "@/types/swapi-schema/planetSchema";

import planets from "@/sample-data/swapi.info/planet.json";

describe("planetSchema", () => {
  it("parses all sample planets from planet.json without errors", () => {
    let errorCount = 0;
    for (const planet of planets) {
      const result = v.safeParse(planetSchema, planet);
      if (!result.success) {
        errorCount++;
      }
    }
    expect(errorCount).toBe(0);
  });
});
