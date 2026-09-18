"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "dod.compare.v1";
const MAX = 3;

/* Same external-store pattern as cart-context.tsx / wishlist-context.tsx. */

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

export interface Compare {
  ids: string[];
  count: number;
  hydrated: boolean;
  max: number;
  has: (id: string) => boolean;
  /** No-ops past MAX entries rather than bumping the oldest. */
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export function useCompare(): Compare {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const toggle = useCallback((id: string) => {
    if (ids.includes(id)) {
      setIds(ids.filter((x) => x !== id));
    } else if (ids.length < MAX) {
      setIds([...ids, id]);
    }
  }, []);
  const remove = useCallback((id: string) => {
    setIds(ids.filter((x) => x !== id));
  }, []);
  const clear = useCallback(() => setIds([]), []);

  return useMemo<Compare>(
    () => ({
      ids: current,
      count: current.length,
      hydrated,
      max: MAX,
      has: (id: string) => current.includes(id),
      toggle,
      remove,
      clear,
    }),
    [current, hydrated, toggle, remove, clear],
  );
}
