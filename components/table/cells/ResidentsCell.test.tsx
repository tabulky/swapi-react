import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { vi } from "vitest";

import { useSwapiResource } from "@/lib/swapi/createSwapiStore";
import { PersonView } from "@/types/personView";

import { ResidentsCell } from "./ResidentsCell";

vi.mock("@/lib/swapi/createSwapiStore", () => ({
  useSwapiResource: vi.fn(),
}));

function setPeople(data: PersonView[] | null) {
  vi.mocked(useSwapiResource).mockReturnValue({
    data,
    state: data ? "success" : "loading",
    error: null,
    refetch: vi.fn(),
  });
}

const p1 = {
  url: "https://swapi.dev/api/people/1/",
  name: "Luke Skywalker",
} as PersonView;
const p2 = {
  url: "https://swapi.dev/api/people/2/",
  name: "C-3PO",
} as PersonView;

describe("ResidentsCell", () => {
  describe("no URLs", () => {
    it("renders an empty <td> with no Tag and no + count", () => {
      setPeople([p1, p2]);
      const html = renderToString(
        createElement(ResidentsCell, { value: [], row: {} }),
      );
      expect(html).toContain("<td");
      expect(html).not.toContain("opacity-40");
      expect(html).not.toContain("+");
    });
  });

  describe("people not loaded", () => {
    it("renders +N inside an opacity-40 Tag when people are null", () => {
      setPeople(null);
      const html = renderToString(
        createElement(ResidentsCell, {
          value: [p1.url, p2.url],
          row: {},
        }),
      );
      expect(html).toContain("opacity-40");
      expect(html).toContain("+2");
    });
  });

  describe("all found", () => {
    it("renders a Tag for each person and no opacity-40 Tag", () => {
      setPeople([p1, p2]);
      const html = renderToString(
        createElement(ResidentsCell, {
          value: [p1.url, p2.url],
          row: {},
        }),
      );
      expect(html).toContain("Luke Skywalker");
      expect(html).toContain("C-3PO");
      expect(html).not.toContain("opacity-40");
    });
  });

  describe("partial match", () => {
    it("renders found person Tag plus +1 opacity-40 Tag for missing", () => {
      setPeople([p1]);
      const html = renderToString(
        createElement(ResidentsCell, {
          value: [p1.url, "https://swapi.dev/api/people/99/"],
          row: {},
        }),
      );
      expect(html).toContain("Luke Skywalker");
      expect(html).toContain("opacity-40");
      expect(html).toContain("+1");
    });
  });

  describe("none found (loaded)", () => {
    it("renders +1 opacity-40 Tag and no person name when loaded but no match", () => {
      setPeople([p1]);
      const html = renderToString(
        createElement(ResidentsCell, {
          value: ["https://swapi.dev/api/people/99/"],
          row: {},
        }),
      );
      expect(html).toContain("opacity-40");
      expect(html).toContain("+1");
      expect(html).not.toContain("Luke Skywalker");
    });
  });
});
