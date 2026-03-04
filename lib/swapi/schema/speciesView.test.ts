import * as v from "valibot";

import { speciesViewSchema } from "./speciesView";

import species from "../sample-data/swapi.info/species.json";

describe("speciesViewSchema", () => {
  it("parses all sample species from species.json without errors", () => {
    let errorCount = 0;
    for (const s of species) {
      const result = v.safeParse(speciesViewSchema, s);
      if (!result.success) {
        errorCount++;
      }
    }
    expect(errorCount).toBe(0);
  });

  it("converts color fields to arrays", () => {
    const human = species.find((s) => s.name === "Human");
    const result = v.parse(speciesViewSchema, human);
    expect(result.skin_colors).toEqual([
      "caucasian",
      "black",
      "asian",
      "hispanic",
    ]);
    expect(result.hair_colors).toEqual(["blonde", "brown", "black", "red"]);
    expect(result.eye_colors).toEqual([
      "brown",
      "blue",
      "green",
      "hazel",
      "grey",
      "amber",
    ]);
  });

  it("converts numeric fields to numbers", () => {
    const human = species.find((s) => s.name === "Human");
    const result = v.parse(speciesViewSchema, human);
    expect(result.average_height).toBe(180);
    expect(result.average_lifespan).toBe(120);
  });

  it("keeps non-numeric strings as strings", () => {
    const droid = species.find((s) => s.name === "Droid");
    const result = v.parse(speciesViewSchema, droid);
    expect(result.average_height).toBe("n/a");
    expect(result.average_lifespan).toBe("indefinite");
  });

  it("handles null homeworld", () => {
    const droid = species.find((s) => s.name === "Droid");
    const result = v.parse(speciesViewSchema, droid);
    expect(result.homeworld).toBeNull();
  });
});
