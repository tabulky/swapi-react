import {
  parseColumnsParam,
  serializeColumnsParam,
  parseSortParam,
  serializeSortParam,
  paramName,
} from "./tableParams";

// ---------------------------------------------------------------------------
// parseColumnsParam
// ---------------------------------------------------------------------------

describe("parseColumnsParam", () => {
  it("returns null for null input", () => {
    expect(parseColumnsParam(null)).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseColumnsParam("")).toBeNull();
  });

  it("parses a single column id", () => {
    expect(parseColumnsParam("name")).toEqual(["name"]);
  });

  it("parses multiple comma-separated ids preserving order", () => {
    expect(parseColumnsParam("name,gender,height")).toEqual([
      "name",
      "gender",
      "height",
    ]);
  });

  it("trims whitespace around ids", () => {
    expect(parseColumnsParam(" name , gender , height ")).toEqual([
      "name",
      "gender",
      "height",
    ]);
  });

  it("ignores empty segments from trailing commas", () => {
    expect(parseColumnsParam("name,,gender,")).toEqual(["name", "gender"]);
  });
});

// ---------------------------------------------------------------------------
// serializeColumnsParam
// ---------------------------------------------------------------------------

describe("serializeColumnsParam", () => {
  it("returns null for null input", () => {
    expect(serializeColumnsParam(null)).toBeNull();
  });

  it("returns null for empty array", () => {
    expect(serializeColumnsParam([])).toBeNull();
  });

  it("serialises a single id", () => {
    expect(serializeColumnsParam(["name"])).toBe("name");
  });

  it("joins multiple ids with commas", () => {
    expect(serializeColumnsParam(["name", "gender", "height"])).toBe(
      "name,gender,height",
    );
  });
});

// ---------------------------------------------------------------------------
// parseSortParam
// ---------------------------------------------------------------------------

describe("parseSortParam", () => {
  it("returns empty array for null input", () => {
    expect(parseSortParam(null)).toEqual([]);
  });

  it("returns empty array for empty string", () => {
    expect(parseSortParam("")).toEqual([]);
  });

  it("parses a single ascending column", () => {
    expect(parseSortParam("name")).toEqual([
      { columnId: "name", direction: "asc" },
    ]);
  });

  it("parses a single descending column (dash prefix)", () => {
    expect(parseSortParam("-height")).toEqual([
      { columnId: "height", direction: "desc" },
    ]);
  });

  it("parses multi-column sort preserving order", () => {
    expect(parseSortParam("name,-height,mass")).toEqual([
      { columnId: "name", direction: "asc" },
      { columnId: "height", direction: "desc" },
      { columnId: "mass", direction: "asc" },
    ]);
  });

  it("trims whitespace around tokens", () => {
    expect(parseSortParam(" -mass , name ")).toEqual([
      { columnId: "mass", direction: "desc" },
      { columnId: "name", direction: "asc" },
    ]);
  });

  it("ignores empty segments", () => {
    expect(parseSortParam("name,,-height,")).toEqual([
      { columnId: "name", direction: "asc" },
      { columnId: "height", direction: "desc" },
    ]);
  });
});

// ---------------------------------------------------------------------------
// serializeSortParam
// ---------------------------------------------------------------------------

describe("serializeSortParam", () => {
  it("returns null for empty array", () => {
    expect(serializeSortParam([])).toBeNull();
  });

  it("serialises ascending entry without prefix", () => {
    expect(
      serializeSortParam([{ columnId: "name", direction: "asc" }]),
    ).toBe("name");
  });

  it("serialises descending entry with dash prefix", () => {
    expect(
      serializeSortParam([{ columnId: "height", direction: "desc" }]),
    ).toBe("-height");
  });

  it("serialises multi-column sort in order", () => {
    expect(
      serializeSortParam([
        { columnId: "name", direction: "asc" },
        { columnId: "height", direction: "desc" },
        { columnId: "mass", direction: "asc" },
      ]),
    ).toBe("name,-height,mass");
  });
});

// ---------------------------------------------------------------------------
// Round-trip
// ---------------------------------------------------------------------------

describe("round-trip", () => {
  it("columns: serialize → parse is identity", () => {
    const ids = ["name", "gender", "height"];
    expect(parseColumnsParam(serializeColumnsParam(ids))).toEqual(ids);
  });

  it("sort: serialize → parse is identity", () => {
    const entries = [
      { columnId: "name", direction: "asc" as const },
      { columnId: "height", direction: "desc" as const },
    ];
    expect(parseSortParam(serializeSortParam(entries))).toEqual(entries);
  });
});

// ---------------------------------------------------------------------------
// paramName
// ---------------------------------------------------------------------------

describe("paramName", () => {
  it("returns bare name when no prefix", () => {
    expect(paramName("cols")).toBe("cols");
    expect(paramName("sort")).toBe("sort");
  });

  it("returns prefixed name with dot separator", () => {
    expect(paramName("cols", "people")).toBe("people.cols");
    expect(paramName("sort", "planets")).toBe("planets.sort");
  });
});
