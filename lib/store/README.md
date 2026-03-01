# createStoreProvider

A scholarly, single-file implementation of Redux-style state islands for React 18+. Uses `useSyncExternalStore` under the hood. Each call produces an isolated store with its own `Provider`, `useSelector`, `dispatch`, and `getState`.

Not a Redux replacement — a minimal study of the pattern.

## API

### `Action`

```ts
type Action = { readonly type: string };
```

Base constraint for all action types. Actions must carry a string `type` discriminant.

### `Reducer<S, A extends Action>`

```ts
type Reducer<S, A extends Action> = (
  state: Readonly<S>,
  action: A,
) => Readonly<S>;
```

Pure `(state, action) => state` function. No mutations, no side effects.

### `createStoreProvider<S, A extends Action>(reducer, initialState)`

| Parameter      | Type            | Description                               |
| -------------- | --------------- | ----------------------------------------- |
| `reducer`      | `Reducer<S, A>` | Pure `(state, action) => state` function. |
| `initialState` | `S`             | The initial state value.                  |

Returns a `StoreProvider<S, A>`:

| Member        | Type                              | Description                                                                |
| ------------- | --------------------------------- | -------------------------------------------------------------------------- |
| `Provider`    | `FC<{ children: ReactNode }>`     | Wrap your tree to enable the hooks below.                                  |
| `useSelector` | `<T>(selector: (s: S) => T) => T` | Derives a value from state; re-renders only on reference-equality changes. |
| `dispatch`    | `(action: A) => void`             | Stable dispatch function. Updates state and notifies subscribers.          |
| `getState`    | `() => Readonly<S>`               | Read current state outside React (tests, event handlers, etc.).            |

## Usage

```tsx
import { createStoreProvider, type Reducer } from "./createStoreProvider";

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

const { Provider, useSelector, dispatch } = createStoreProvider(reducer, {
  count: 0,
});

function Counter() {
  const count = useSelector((s) => s.count);
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

## Relationship to Redux

This is a distilled implementation of the Redux pattern — `(state, action) => state`, unidirectional data flow, `useSelector` / `dispatch`, context-based `<Provider>`.

What it intentionally omits:

- Action creators, `createSlice`, RTK — actions are plain discriminated unions.
- Middleware — no thunks, sagas, or epics. Side effects live outside the store.
- Selector memoization — relies on `useSyncExternalStore`'s reference equality.
- DevTools — state is inspectable via `getState()`.
- `combineReducers` — single reducer, single state tree.

For devtools, middleware, async patterns, memoization, SSR/hydration, data fetching, or large-scale state management, use `react-redux` + RTK.

> **SSR note:** `useSelector` passes `initialState` as the server snapshot to `useSyncExternalStore`, so SSR always renders the initial state. Actions dispatched before rendering are not reflected server-side.
