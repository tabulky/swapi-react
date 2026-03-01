import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { MixedCell } from "@/components/table/MixedCell";

describe("MixedCell", () => {
  describe("numeric value", () => {
    it("renders a <td> with right-alignment classes", () => {
      const html = renderToString(createElement(MixedCell, { value: 42 }));
      expect(html).toContain("<td");
      expect(html).toContain("text-right");
      expect(html).toContain("tabular-nums");
    });

    it("formats the number with toLocaleString", () => {
      const html = renderToString(
        createElement(MixedCell, { value: 1_000_000 }),
      );
      expect(html).toContain((1_000_000).toLocaleString());
    });

    it("renders zero correctly", () => {
      const html = renderToString(createElement(MixedCell, { value: 0 }));
      expect(html).toContain("0");
      expect(html).toContain("text-right");
    });

    it("appends the numericUnit in a muted span when provided", () => {
      const html = renderToString(
        createElement(MixedCell, { value: 12_742, numericUnit: " km" }),
      );
      expect(html).toContain("text-foreground/75");
      expect(html).toContain(" km");
    });

    it("does not render a unit span when numericUnit is omitted", () => {
      const html = renderToString(createElement(MixedCell, { value: 99 }));
      expect(html).not.toContain("<span");
    });
  });

  describe("string value", () => {
    it("renders a <td> with center-alignment and muted classes", () => {
      const html = renderToString(
        createElement(MixedCell, { value: "unknown" }),
      );
      expect(html).toContain("<td");
      expect(html).toContain("text-center");
      expect(html).toContain("text-foreground/75");
    });

    it("displays the string content", () => {
      const html = renderToString(
        createElement(MixedCell, { value: "arid" }),
      );
      expect(html).toContain("arid");
    });

    it("does not apply right-alignment for string values", () => {
      const html = renderToString(
        createElement(MixedCell, { value: "N/A" }),
      );
      expect(html).not.toContain("text-right");
    });

    it("does not add unit span for string values even if numericUnit is provided", () => {
      const html = renderToString(
        createElement(MixedCell, { value: "unknown", numericUnit: "UNIT" }),
      );
      expect(html).not.toContain("<span");
      expect(html).not.toContain("UNIT");
      expect(html).toContain("unknown");
    });
  });
});
