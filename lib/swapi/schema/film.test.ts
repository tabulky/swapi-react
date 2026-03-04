import * as v from "valibot";

import { filmSchema } from "@/lib/swapi/schema/swapi-schema/filmSchema";

import films from "@/sample-data/swapi.info/film.json";

describe("filmSchema", () => {
  it("parses all sample films from film.json without errors", () => {
    let errorCount = 0;
    for (const film of films) {
      const result = v.safeParse(filmSchema, film);
      if (!result.success) {
        errorCount++;
      }
    }
    expect(errorCount).toBe(0);
  });
});
