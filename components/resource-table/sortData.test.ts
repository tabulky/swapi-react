import type { ColumnDef, SortEntry } from "./types";
import { sortData } from "./sortData";

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

type TestRow = {
  name: string;
  height: number | string;
  mass: number | string;
  gender: string;
};

const columns: ColumnDef<TestRow>[] = [
  {
    id: "name",
    header: "Name",
    getValue: (r) => r.name,
    isSortable: true,
    getSortValue: (r) => r.name,
  },
  {
    id: "height",
    header: "Height",
    getValue: (r) => r.height,
    isSortable: true,
    getSortValue: (r) => (typeof r.height === "number" ? r.height : null),
  },
  {
    id: "mass",
    header: "Mass",
    getValue: (r) => r.mass,
    isSortable: true,
    getSortValue: (r) => (typeof r.mass === "number" ? r.mass : null),
  },
  {
    id: "gender",
    header: "Gender",
    getValue: (r) => r.gender,
    // intentionally NOT sortable — no getSortValue
  },
];

const data: TestRow[] = [
  { name: "Luke", height: 172, mass: 77, gender: "male" },
  { name: "Leia", height: 150, mass: 49, gender: "female" },
  { name: "Vader", height: 202, mass: 136, gender: "male" },
  { name: "Yoda", height: 66, mass: 17, gender: "male" },
  { name: "R2-D2", height: 96, mass: 32, gender: "n/a" },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("sortData", () => {
  it("returns a shallow copy when no sort entries are provided", () => {
    const result = sortData(data, columns, []);
    expect(result).toEqual(data);
    expect(result).not.toBe(data); // new array
  });

  it("does not mutate the input array", () => {
    const frozen = Object.freeze([...data]);
    const entries: SortEntry[] = [{ columnId: "name", direction: "asc" }];
    expect(() => sortData(frozen, columns, entries)).not.toThrow();
  });

  // ---------- Single column sort ----------

  it("sorts ascending by string column", () => {
    const result = sortData(data, columns, [
      { columnId: "name", direction: "asc" },
    ]);
    expect(result.map((r) => r.name)).toEqual([
      "Leia",
      "Luke",
      "R2-D2",
      "Vader",
      "Yoda",
    ]);
  });

  it("sorts descending by string column", () => {
    const result = sortData(data, columns, [
      { columnId: "name", direction: "desc" },
    ]);
    expect(result.map((r) => r.name)).toEqual([
      "Yoda",
      "Vader",
      "R2-D2",
      "Luke",
      "Leia",
    ]);
  });

  it("sorts ascending by numeric column", () => {
    const result = sortData(data, columns, [
      { columnId: "height", direction: "asc" },
    ]);
    expect(result.map((r) => r.name)).toEqual([
      "Yoda", // 66
      "R2-D2", // 96
      "Leia", // 150
      "Luke", // 172
      "Vader", // 202
    ]);
  });

  it("sorts descending by numeric column", () => {
    const result = sortData(data, columns, [
      { columnId: "height", direction: "desc" },
    ]);
    expect(result.map((r) => r.name)).toEqual([
      "Vader", // 202
      "Luke", // 172
      "Leia", // 150
      "R2-D2", // 96
      "Yoda", // 66
    ]);
  });

  // ---------- Multi-column sort ----------

  it("breaks ties with secondary sort column", () => {
    // All males first by gender-alpha won't help (gender is not sortable),
    // so build a scenario with actual ties:
    const rows: TestRow[] = [
      { name: "A", height: 100, mass: 50, gender: "male" },
      { name: "B", height: 100, mass: 30, gender: "female" },
      { name: "C", height: 100, mass: 80, gender: "male" },
      { name: "D", height: 200, mass: 10, gender: "female" },
    ];

    const result = sortData(rows, columns, [
      { columnId: "height", direction: "asc" },
      { columnId: "mass", direction: "desc" },
    ]);

    // height=100 tie → mass desc: C(80), A(50), B(30)  |  height=200: D
    expect(result.map((r) => r.name)).toEqual(["C", "A", "B", "D"]);
  });

  // ---------- Null handling ----------

  it("pushes null sort values to the end regardless of direction", () => {
    const rows: TestRow[] = [
      { name: "Known", height: 100, mass: 50, gender: "m" },
      { name: "Unknown", height: "unknown", mass: "n/a", gender: "m" },
      { name: "Tall", height: 200, mass: 80, gender: "m" },
    ];

    // Ascending — nulls last
    const asc = sortData(rows, columns, [
      { columnId: "height", direction: "asc" },
    ]);
    expect(asc.map((r) => r.name)).toEqual(["Known", "Tall", "Unknown"]);

    // Descending — nulls still last
    const desc = sortData(rows, columns, [
      { columnId: "height", direction: "desc" },
    ]);
    expect(desc.map((r) => r.name)).toEqual(["Tall", "Known", "Unknown"]);
  });

  // ---------- Edge cases ----------

  it("silently skips unknown column IDs in sort entries", () => {
    const result = sortData(data, columns, [
      { columnId: "nonexistent", direction: "asc" },
    ]);
    expect(result).toEqual(data);
  });

  it("silently skips non-sortable columns in sort entries", () => {
    const result = sortData(data, columns, [
      { columnId: "gender", direction: "asc" },
    ]);
    expect(result).toEqual(data);
  });

  it("handles empty data array", () => {
    const result = sortData([], columns, [
      { columnId: "name", direction: "asc" },
    ]);
    expect(result).toEqual([]);
  });

  it("handles single-element array", () => {
    const result = sortData([data[0]], columns, [
      { columnId: "name", direction: "asc" },
    ]);
    expect(result).toEqual([data[0]]);
  });
});
