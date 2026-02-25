# createStoreProvider

A single-file, zero-dependency, Redux-inspired state management micro-library for React 18+.

`createStoreProvider` gives you the familiar `useSelector` / `useDispatch` API in **~60 lines of TypeScript**, backed entirely by React's built-in `useSyncExternalStore`. No middleware layer, no devtools protocol, no selector memoization library — just the reducer pattern wired up to a subscription model.

## API

### `createStoreProvider<S, A>(reducer, initialState): StoreProvider<S, A>`

Creates an independent store instance. Each call returns its own isolated provider and hooks — there is no global store.

| Parameter      | Type            | Description                               |
| -------------- | --------------- | ----------------------------------------- |
| `reducer`      | `Reducer<S, A>` | Pure `(state, action) => state` function. |
| `initialState` | `S`             | The initial state value.                  |

Returns a `StoreProvider<S, A>` with:

| Member        | Type                              | Description                                                                |
| ------------- | --------------------------------- | -------------------------------------------------------------------------- |
| `Provider`    | `FC<{ children: ReactNode }>`     | Wrap your tree to enable the hooks below.                                  |
| `useSelector` | `<T>(selector: (s: S) => T) => T` | Derives a value from state; re-renders only on reference-equality changes. |
| `useDispatch` | `() => (action: A) => void`       | Returns a stable dispatch function.                                        |
| `getState`    | `() => S`                         | Read current state outside React (tests, event handlers, etc.).            |

### `Reducer<S, A>`

```ts
type Reducer<S, A> = (state: S, action: A) => S;
```

Identical in shape to a Redux reducer. Must be pure — no mutations, no side effects.

## Usage

```tsx
import { createStoreProvider, type Reducer } from "./createStoreProvider";

// 1. Define state & actions
type State = { count: number };
type Action = { type: "increment" } | { type: "reset" };

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "reset":
      return { count: 0 };
  }
};

// 2. Create the store
const { Provider, useSelector, useDispatch } = createStoreProvider(reducer, {
  count: 0,
});

// 3. Consume it
function Counter() {
  const count = useSelector((s) => s.count);
  const dispatch = useDispatch();
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}

function App() {
  return (
    <Provider>
      <Counter />
    </Provider>
  );
}
```

## Redux Inspiration

This micro-store is a **direct descendant** of the Redux/react-redux design philosophy. It deliberately preserves:

- **The reducer contract** — `(state, action) => state`, pure and predictable.
- **Hook naming** — `useSelector` and `useDispatch`, identical to react-redux.
- **Unidirectional data flow** — dispatch → reducer → new state → subscribers notified.
- **Provider pattern** — a context-based `<Provider>` gates access to hooks.

What it intentionally drops:

- **Action creators & `createSlice`** — define actions as plain union types. TypeScript discriminated unions replace the need for builder-pattern boilerplate.
- **Middleware pipeline** — no `applyMiddleware`, no thunks, no sagas, no epics. Side effects live outside the store (in components, hooks, or plain functions).
- **Selector memoization (reselect)** — `useSelector` relies on `useSyncExternalStore`'s built-in reference equality check. If you need derived computations, compose with `useMemo` yourself.
- **DevTools integration** — no `__REDUX_DEVTOOLS_EXTENSION__` support. State is inspectable via `getState()` and standard React DevTools.
- **`combineReducers`** — single reducer, single state tree. Compose reducers manually if needed.
- **`configureStore` / `RTK`** — there is no toolkit layer. The 60-line file _is_ the toolkit.

The mental model is "what if Redux shipped as one function instead of a framework."

## Pros & Cons vs `react-redux` (with `@reduxjs/toolkit`)

An honest comparison, treating `createStoreProvider` as a standalone package competing against the full react-redux + RTK stack (v9.x / RTK 2.x, circa 2025–2026).

### Use `react-redux` if you wish more of

- Devtools
- Middleware
- Async patterns
- Memoization
- Ecosystem
- SSR / hydration
- Data fetching
- Scalability
- Community support

## When to Use This

Use `createStoreProvider` when:

- The state is **small-to-medium** and the reducer is straightforward.
- You want **zero added dependencies** and the smallest possible footprint.
- You need **multiple isolated stores** without fighting the framework.
- TypeScript inference matters more to you than runtime safety nets like Immer.
- You **don't need** middleware, devtools, RTK Query, or normalized entity management.

Use `react-redux` + RTK when:

- The app has **complex async flows** (API caching, optimistic updates, polling).
- You need **Redux DevTools** for debugging state transitions.
- **Selector memoization** is critical for performance in large state trees.
- The team expects a **well-documented, community-supported** solution with established patterns.
- You're building at a scale where battle-tested infrastructure matters more than bundle size.

This is not a replacement for Redux. It's what Redux would look like if your requirements fit in 60 lines.
