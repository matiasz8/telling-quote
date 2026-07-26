'use client';

import { useCallback, useRef, useSyncExternalStore } from 'react';
import { STORAGE_EVENTS } from '@/lib/constants';

/**
 * Subscribe to every source that can change a localStorage key: the native
 * `storage` event (other tabs) and our own event (this tab).
 */
function subscribeToStorage(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(STORAGE_EVENTS.CHANGE, onStoreChange);

  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(STORAGE_EVENTS.CHANGE, onStoreChange);
  };
}

const subscribeToNothing = () => () => {};
const getHydratedSnapshot = () => true;
const getHydratedServerSnapshot = () => false;

/**
 * Persisted state backed by localStorage.
 *
 * The value is read through `useSyncExternalStore`, so the server render and
 * the first client render both see `initialValue` and hydration matches. React
 * swaps in the stored value right after hydrating. Reading localStorage during
 * the first render instead would make the client markup differ from the server
 * HTML and surface as React error #418 in the browser console.
 *
 * The third tuple element reports whether the stored value has been read yet.
 * It is `false` on the server and during the first client render, and `true`
 * from the moment the returned value reflects localStorage. Consumers that
 * render text derived from this state — or that write back into it on mount —
 * must wait for it.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
  // `initialValue` is usually an inline literal, so keep the first one we saw:
  // snapshots must be referentially stable or `useSyncExternalStore` loops.
  const fallbackRef = useRef(initialValue);
  const snapshotRef = useRef<{ raw: string | null; value: T }>({
    raw: null,
    value: initialValue,
  });

  const read = useCallback((): T => {
    const raw = window.localStorage.getItem(key);

    if (raw === snapshotRef.current.raw) {
      return snapshotRef.current.value;
    }

    let value = fallbackRef.current;
    if (raw) {
      try {
        value = JSON.parse(raw) as T;
      } catch (error) {
        console.error(error);
      }
    }

    snapshotRef.current = { raw, value };
    return value;
  }, [key]);

  const getServerSnapshot = useCallback(() => fallbackRef.current, []);

  const storedValue = useSyncExternalStore(subscribeToStorage, read, getServerSnapshot);
  const isHydrated = useSyncExternalStore(
    subscribeToNothing,
    getHydratedSnapshot,
    getHydratedServerSnapshot
  );

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const currentRaw = window.localStorage.getItem(key);
        const valueToStore = value instanceof Function ? value(read()) : value;
        const nextRaw = JSON.stringify(valueToStore);

        window.localStorage.setItem(key, nextRaw);

        // Notify this tab (the native `storage` event only fires in other tabs).
        if (nextRaw !== currentRaw) {
          window.dispatchEvent(
            new CustomEvent(STORAGE_EVENTS.CHANGE, { detail: { key, value: valueToStore } })
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
    [key, read]
  );

  return [storedValue, setValue, isHydrated];
}
