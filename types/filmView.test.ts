import * as v from "valibot";

import { filmViewSchema } from "@/types/filmView";

import films from "@/sample-data/swapi.info/film.json";

describe("filmViewSchema", () => {
  it("parses all sample films from film.json without errors", () => {
    let errorCount = 0;
    for (const film of films) {
      const result = v.safeParse(filmViewSchema, film);
      if (!result.success) {
        errorCount++;
      }
    }
    expect(errorCount).toBe(0);
  });
});
