import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useSyncExternalStore,
} from "react";

/**
 * A pure function that takes the current state and an action, and returns
 * the next state. Follows the same contract as a Redux reducer.
 *
 * Must be a pure function — no side effects, no mutations of the previous state.
 *
 * @typeParam S - The state shape.
 * @typeParam A - The action type (typically a discriminated union).
 */
export type Reducer<S, A> = (state: S, action: A) => S;

/**
 * The return value of {@link createStoreProvider}. Contains everything needed
 * to provide and consume a store in a React tree.
 *
 * @typeParam S - The state shape.
 * @typeParam A - The action type.
 */
export type StoreProvider<S, A> = {
  /**
   * React component that makes the store available to descendant hooks.
   * Wrap your component tree (or a subtree) with this provider.
   */
  Provider: FC<{ children: ReactNode }>;

  /**
   * Hook that derives a value from the store state.
   * Re-renders the consuming component only when the selected value changes
   * (reference equality via [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)).
   *
   * @typeParam T - The derived value type.
   * @param selector - Pure function that extracts a value from state.
   * @returns The selected value.
   * @throws If called outside of `<Provider>`.
   */
  useSelector: <T>(selector: (state: S) => T) => T;

  /**
   * Hook that returns the dispatch function.
   *
   * @returns A stable `dispatch` function that accepts an action.
   * @throws If called outside of `<Provider>`.
   */
  useDispatch: () => (action: A) => void;

  /**
   * Returns the current state snapshot outside of React (e.g. in tests,
   * middleware-like logic, or event handlers that don't need reactivity).
   *
   * @returns The current state.
   */
  getState: () => S;
};

/**
 * Creates a self-contained Redux-style store backed by [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore).
 *
 * Each call produces an independent store instance with its own `Provider`,
 * `useSelector`, `useDispatch`, and `getState` — no global singletons, no
 * external dependencies beyond React 18+.
 *
 * @typeParam S - The state shape.
 * @typeParam A - The action type (typically a discriminated union).
 *
 * @param reducer - A pure `(state, action) => state` function.
 * @param initialState - The initial state value supplied to the store.
 * @returns A {@link StoreProvider} object containing the Provider component and hooks.
 *
 * @example
 * ```tsx
 * type State = { count: number };
 * type Action = { type: "increment" } | { type: "decrement" };
 *
 * const reducer: Reducer<State, Action> = (state, action) => {
 *   switch (action.type) {
 *     case "increment": return { count: state.count + 1 };
 *     case "decrement": return { count: state.count - 1 };
 *   }
 * };
 *
 * const { Provider, useSelector, useDispatch } = createStoreProvider(reducer, { count: 0 });
 *
 * function Counter() {
 *   const count = useSelector((s) => s.count);
 *   const dispatch = useDispatch();
 *   return <button onClick={() => dispatch({ type: "increment" })}>{count}</button>;
 * }
 *
 * function App() {
 *   return (
 *     <Provider>
 *       <Counter />
 *     </Provider>
 *   );
 * }
 * ```
 */
export const createStoreProvider = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
): StoreProvider<S, A> => {
  /** Mutable state reference — updated synchronously on every dispatch. */
  let state = initialState;

  /** Active subscriber callbacks, notified after each state transition. */
  const listeners = new Set<() => void>();

  const getState = () => state;

  /** Runs the reducer, replaces state, and notifies all subscribers. */
  const dispatch = (action: A) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  };

  /**
   * Subscribes a listener to state changes.
   * Returns an unsubscribe function — the contract expected by
   * `useSyncExternalStore`.
   */
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  /**
   * Context-based guard that ensures hooks are only called inside
   * `<Provider>`. Value is `true` when provided, `null` otherwise.
   */
  const Guard = createContext<true | null>(null);

  /** @throws Error if the calling hook is rendered outside `<Provider>`. */
  const useGuard = () => {
    if (useContext(Guard) === null) {
      throw new Error("Store hooks must be used within their Provider");
    }
  };

  const Provider: FC<{ children: ReactNode }> = ({ children }) => (
    <Guard.Provider value={true}>{children}</Guard.Provider>
  );

  const useSelector = <T,>(selector: (state: S) => T): T => {
    useGuard();
    return useSyncExternalStore(
      subscribe,
      () => selector(state),
      () => selector(initialState),
    );
  };

  const useDispatch = () => {
    useGuard();
    return dispatch;
  };

  return { Provider, useSelector, useDispatch, getState };
};
