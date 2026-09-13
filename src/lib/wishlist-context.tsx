"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "dod.wishlist.v1";

/* Same tiny external-store pattern as cart-context.tsx — see there for why
 * (avoids setState-in-effect, syncs across tabs, no hydration mismatch). */

let ids: string[] = [];
let initialized = false;
const listeners = new Set<() => void>();
const EMPTY: string[] = [];

function parse(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  ids = parse(localStorage.getItem(STORAGE_KEY));
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable — keep working in memory */
  }
}

function setIds(next: string[]) {
  ids = next;
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  ensureInit();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      ids = parse(e.newValue);
      listeners.forEach((l) => l());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => {
  ensureInit();
  return ids;
};
const getServerSnapshot = () => EMPTY;

export interface Wishlist {
  ids: string[];
  count: number;
  hydrated: boolean;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export function useWishlist(): Wishlist {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const toggle = useCallback((id: string) => {
    setIds(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  }, []);
  const remove = useCallback((id: string) => {
    setIds(ids.filter((x) => x !== id));
  }, []);
  const clear = useCallback(() => setIds([]), []);

  return useMemo<Wishlist>(
    () => ({
      ids: current,
      count: current.length,
      hydrated,
      has: (id: string) => current.includes(id),
      toggle,
      remove,
      clear,
    }),
    [current, hydrated, toggle, remove, clear],
  );
}
