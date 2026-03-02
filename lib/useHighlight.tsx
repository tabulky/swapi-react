"use client";
import { useEffect, useRef } from "react";

export function useHighlight(query: string, dependencies: unknown[] = []) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !query) {
      CSS.highlights.delete("search");
      return;
    }

    const treeWalker = document.createTreeWalker(
      ref.current,
      NodeFilter.SHOW_TEXT,
    );
    const ranges: Range[] = [];

    while (treeWalker.nextNode()) {
      const node = treeWalker.currentNode;
      const text = node.textContent?.toLowerCase() ?? "";
      let startIdx = 0;

      while ((startIdx = text.indexOf(query.toLowerCase(), startIdx)) !== -1) {
        const range = new Range();
        range.setStart(node, startIdx);
        range.setEnd(node, startIdx + query.length);
        ranges.push(range);
        startIdx += query.length;
      }
    }

    if (ranges.length > 0) {
      console.log(`Highlighting ${ranges.length} occurrences of "${query}"`);
      CSS.highlights.set("search", new Highlight(...ranges));
    } else {
      console.log(`No occurrences of "${query}" found`);
      CSS.highlights.delete("search");
    }

    return () => {
      CSS.highlights.delete("search");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, ...dependencies]);

  return ref;
}
