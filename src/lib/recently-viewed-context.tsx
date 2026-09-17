"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "dod.recently-viewed.v1";
const MAX = 8;

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

export interface RecentlyViewed {
  ids: string[];
  hydrated: boolean;
  /** Moves id to the front, dedupes, and caps the list at MAX entries. */
  record: (id: string) => void;
}

export function useRecentlyViewed(): RecentlyViewed {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const record = useCallback((id: string) => {
    const next = [id, ...ids.filter((x) => x !== id)].slice(0, MAX);
    if (next.length === ids.length && next.every((v, i) => v === ids[i])) return;
    setIds(next);
  }, []);

  return useMemo<RecentlyViewed>(
    () => ({ ids: current, hydrated, record }),
    [current, hydrated, record],
  );
}
