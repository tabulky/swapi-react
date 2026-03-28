import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Same signature as `useState` but synchronised with `localStorage`.
 */
export type LocalStorageState<T> = [T, (value: T) => void];

/**
 * Configuration options for {@link useLocalStorageState}.
 */
export type LocalStorageStateConfig<T> = {
  /**
   * The `localStorage` key to read/write.
   */
  key: string;
  /**
   * The default value to use when `localStorage` is empty or unavailable.
   */
  defaultValue: T;
  /**
   * Parse the string value from `localStorage` into the desired type.
   * Throwing inside the parser will cause the hook to return the default value.
   */
  parse: (raw: string) => T;
  /**
   * Serialize the value into a string for `localStorage`.
   */
  serialize: (value: T) => string;
};

// Per-key listener registry so same-tab writes notify all hook instances.
const listeners = new Map<string, Set<() => void>>();

function getListeners(key: string): Set<() => void> {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  return set;
}

function emitChange(key: string) {
  for (const listener of getListeners(key)) {
    listener();
  }
}

/**
 * A React hook for managing state synchronized with `localStorage`.
 *
 * @param config Configuration options for the hook.
 */
export function useLocalStorageState<T>(
  config: LocalStorageStateConfig<T>,
): LocalStorageState<T> {
  const { key, defaultValue, parse, serialize } = config;

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const set = getListeners(key);
      set.add(onStoreChange);

      // Cross-tab sync: the `storage` event fires in *other* tabs.
      const handleStorage = (e: StorageEvent) => {
        if (e.key === key) onStoreChange();
      };
      window.addEventListener("storage", handleStorage);

      return () => {
        set.delete(onStoreChange);
        window.removeEventListener("storage", handleStorage);
      };
    },
    [key],
  );

  const getSnapshot = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return parse(raw);
    } catch {
      return defaultValue;
    }
  }, [key, defaultValue, parse]);

  const getServerSnapshot = useCallback((): T => defaultValue, [defaultValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: T) => {
      try {
        localStorage.setItem(key, serialize(next));
      } catch {
        // Storage full or unavailable — silently ignore.
      }
      emitChange(key);
    },
    [key, serialize],
  );

  return useMemo(() => [value, setValue], [value, setValue]);
}
