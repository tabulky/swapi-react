import { createElement } from "react";
import { renderToString } from "react-dom/server";

import { createStoreProvider } from "@/lib/store/createStoreProvider";

type State = { count: number };
type Action = { type: "increment" } | { type: "decrement" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
};

describe("createStoreProvider", () => {
  describe("getState / dispatch", () => {
    it("getState returns the initial state", () => {
      const { getState } = createStoreProvider(reducer, { count: 5 });
      expect(getState()).toEqual({ count: 5 });
    });

    it("dispatch updates state and getState reflects the new value", () => {
      const store = createStoreProvider(reducer, { count: 0 });
      let capturedDispatch: ((action: Action) => void) | undefined;

      function Capturer() {
        capturedDispatch = store.useDispatch();
        return null;
      }

      renderToString(
        createElement(store.Provider, null, createElement(Capturer)),
      );

      capturedDispatch!({ type: "increment" });
      expect(store.getState()).toEqual({ count: 1 });

      capturedDispatch!({ type: "increment" });
      expect(store.getState()).toEqual({ count: 2 });

      capturedDispatch!({ type: "decrement" });
      expect(store.getState()).toEqual({ count: 1 });
    });
  });

  describe("useSelector", () => {
    it("throws when rendered outside <Provider>", () => {
      const store = createStoreProvider(reducer, { count: 0 });

      function TestComponent() {
        store.useSelector((s) => s.count);
        return null;
      }

      expect(() =>
        renderToString(createElement(TestComponent)),
      ).toThrow("Store hooks must be used within their Provider");
    });

    it("returns selected state when rendered inside <Provider>", () => {
      const store = createStoreProvider(reducer, { count: 42 });
      let selected: number | undefined;

      function TestComponent() {
        selected = store.useSelector((s) => s.count);
        return null;
      }

      renderToString(
        createElement(store.Provider, null, createElement(TestComponent)),
      );

      expect(selected).toBe(42);
    });
  });

  describe("useDispatch", () => {
    it("throws when rendered outside <Provider>", () => {
      const store = createStoreProvider(reducer, { count: 0 });

      function TestComponent() {
        store.useDispatch();
        return null;
      }

      expect(() =>
        renderToString(createElement(TestComponent)),
      ).toThrow("Store hooks must be used within their Provider");
    });
  });
});
