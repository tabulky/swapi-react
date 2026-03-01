import * as v from "valibot";

import { personViewSchema } from "@/types/personView";

import people from "@/sample-data/swapi.info/person.json";

describe("personViewSchema", () => {
  it("parses all sample people from person.json without errors", () => {
    let errorCount = 0;
    for (const person of people) {
      const result = v.safeParse(personViewSchema, person);
      if (!result.success) {
        errorCount++;
      }
    }
    expect(errorCount).toBe(0);
  });
});
