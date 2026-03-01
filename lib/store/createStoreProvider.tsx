import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useSyncExternalStore,
} from "react";

/**
 * Action in redux-style store. Must have a string `type` property.
 */
export type Action = { readonly type: string };

/** Pure `(state, action) => state` function. No side effects, no mutations. */
export type Reducer<S, A extends Action> = (
  state: Readonly<S>,
  action: A,
) => Readonly<S>;

/**
 * Return value of {@link createStoreProvider}.
 *
 * @typeParam S - State shape.
 * @typeParam A - Action type.
 */
export type StoreProvider<S, A> = {
  /** Wrap your component tree with this to make the store available. */
  Provider: FC<{ children: ReactNode }>;

  /**
   * Derives a value from state. Re-renders only when the selected value changes.
   * @throws If called outside of `<Provider>`.
   */
  useSelector: <T>(selector: (state: S) => T) => T;

  /** Returns the current state snapshot outside of React. */
  getState: () => Readonly<S>;

  /**
   * Stable dispatch function. Dispatches an action, updates state,
   * and notifies subscribers.
   */
  dispatch: (action: A) => void;
};

/**
 * Creates a self-contained Redux-style store backed by
 * [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore).
 * No global singletons, no external dependencies beyond React 18+.
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
 * const { Provider, useSelector, dispatch } = createStoreProvider(reducer, { count: 0 });
 *
 * function Counter() {
 *   const count = useSelector((s) => s.count);
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
export const createStoreProvider = <S, A extends Action>(
  reducer: Reducer<S, A>,
  initialState: S,
): StoreProvider<S, A> => {
  // Current state — replaced (never mutated) on each dispatch.
  let state = initialState;

  const listeners = new Set<() => void>();

  const getState = () => state;

  const notify = () => listeners.forEach((fn) => fn());

  const dispatch = (action: A) => {
    state = reducer(state, action);
    notify();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  // Sentinel context — present when rendered inside `<Provider>`, null otherwise.
  const ProviderContext = createContext<true | null>(null);

  const useGuard = () => {
    if (useContext(ProviderContext) === null) {
      throw new Error("Store hooks must be used within their Provider");
    }
  };

  const Provider: FC<{ children: ReactNode }> = ({ children }) => (
    <ProviderContext.Provider value={true}>{children}</ProviderContext.Provider>
  );
  Provider.displayName = "StoreProvider";

  const useSelector = <T,>(selector: (state: Readonly<S>) => T): T => {
    useGuard();

    return useSyncExternalStore(
      subscribe,
      () => selector(state),
      // If you see warning pointing here from your devtools,
      // it may be caused by creating new objects in selector in your store implementation.
      () => selector(state),
    );
  };

  return { Provider, useSelector, getState, dispatch };
};
