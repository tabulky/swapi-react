import * as v from "valibot";

import { planetViewSchema } from "@/types/planetView";

import planets from "@/sample-data/swapi.info/planet.json";

describe("planetViewSchema", () => {
  it("parses all sample planets from planet.json without errors", () => {
    let errorCount = 0;
    for (const planet of planets) {
      const result = v.safeParse(planetViewSchema, planet);
      if (!result.success) {
        errorCount++;
      }
    }
    expect(errorCount).toBe(0);
  });
});
