import * as v from "valibot";

import { personSchema } from "@/types/swapi-schema/personSchema";

import people from "@/sample-data/swapi.info/person.json";

describe("personSchema", () => {
  it("parses all sample people from person.json without errors", () => {
    let errorCount = 0;
    for (const person of people) {
      const result = v.safeParse(personSchema, person);
      if (!result.success) {
        errorCount++;
      }
    }
    expect(errorCount).toBe(0);
  });
});
