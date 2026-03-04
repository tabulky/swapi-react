import * as v from "valibot";

import { toCorpStringArray } from "./viewSchemaHelpers";
import { starshipViewSchema } from "./starshipView";

import starships from "../sample-data/swapi.info/starship.json";

describe("toCorpStringArray", () => {
  const parse = (input: string) => v.parse(toCorpStringArray, input);

  it("returns a single-element array for a plain name", () => {
    expect(parse("Corellian Engineering Corporation")).toEqual([
      "Corellian Engineering Corporation",
    ]);
  });

  it("splits two manufacturers separated by comma", () => {
    expect(parse("Sienar Fleet Systems, Cygnus Spaceworks")).toEqual([
      "Sienar Fleet Systems",
      "Cygnus Spaceworks",
    ]);
  });

  it("splits multiple manufacturers", () => {
    expect(
      parse("Imperial Department of Military Research, Sienar Fleet Systems"),
    ).toEqual([
      "Imperial Department of Military Research",
      "Sienar Fleet Systems",
    ]);
  });

  it('keeps "Gallofree Yards, Inc." intact', () => {
    expect(parse("Gallofree Yards, Inc.")).toEqual(["Gallofree Yards, Inc."]);
  });

  it('keeps "Hoersch-Kessel Drive, Inc." intact', () => {
    expect(parse("Hoersch-Kessel Drive, Inc.")).toEqual([
      "Hoersch-Kessel Drive, Inc.",
    ]);
  });

  it("keeps Inc without trailing dot intact", () => {
    expect(parse("Acme, Inc")).toEqual(["Acme, Inc"]);
  });

  it("keeps Ltd. suffix intact", () => {
    expect(parse("Widgets, Ltd.")).toEqual(["Widgets, Ltd."]);
  });

  it("keeps Corp. suffix intact", () => {
    expect(parse("Starworks, Corp.")).toEqual(["Starworks, Corp."]);
  });

  it("splits around a corporate name when followed by another manufacturer", () => {
    expect(parse("Gallofree Yards, Inc., Kuat Drive Yards")).toEqual([
      "Gallofree Yards, Inc.",
      "Kuat Drive Yards",
    ]);
  });

  it('splits when suffix is a prefix of a longer word ("Incom Corporation")', () => {
    expect(
      parse("Alliance Underground Engineering, Incom Corporation"),
    ).toEqual(["Alliance Underground Engineering", "Incom Corporation"]);
  });
});

describe("starshipViewSchema", () => {
  it("parses all sample starships from starship.json without errors", () => {
    let errorCount = 0;
    for (const starship of starships) {
      const result = v.safeParse(starshipViewSchema, starship);
      if (!result.success) {
        errorCount++;
      }
    }
    expect(errorCount).toBe(0);
  });

  it("parses manufacturer with corporate suffix into correct array", () => {
    const gallofree = starships.find((s) => s.name === "Rebel transport");
    const result = v.parse(starshipViewSchema, gallofree);
    expect(result.manufacturer).toEqual(["Gallofree Yards, Inc."]);
  });

  it("splits plain comma-separated manufacturers", () => {
    const sentinel = starships.find(
      (s) => s.name === "Sentinel-class landing craft",
    );
    const result = v.parse(starshipViewSchema, sentinel);
    expect(result.manufacturer).toEqual([
      "Sienar Fleet Systems",
      "Cygnus Spaceworks",
    ]);
  });
});
