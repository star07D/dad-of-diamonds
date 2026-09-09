"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "dod.cart.v1";

export interface CartLine {
  id: string;
  qty: number;
}

/* ------------------------------------------------------------------ *
 * A tiny external store so the cart survives navigation and syncs
 * across tabs, without setState-in-effect.
 * ------------------------------------------------------------------ */

let lines: CartLine[] = [];
let initialized = false;
const listeners = new Set<() => void>();
const EMPTY: CartLine[] = [];

function parse(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data
      .filter((l) => l && typeof l.id === "string")
      .map((l) => ({ id: l.id as string, qty: 1 }));
  } catch {
    return [];
  }
}

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  lines = parse(localStorage.getItem(STORAGE_KEY));
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    /* storage unavailable — keep working in memory */
  }
}

function setLines(next: CartLine[]) {
  lines = next;
  persist();
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  ensureInit();
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      lines = parse(e.newValue);
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
  return lines;
};
const getServerSnapshot = () => EMPTY;

/* ------------------------------------------------------------------ */

export interface Cart {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export function useCart(): Cart {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const add = useCallback((id: string) => {
    if (!lines.some((l) => l.id === id)) setLines([...lines, { id, qty: 1 }]);
  }, []);
  const remove = useCallback((id: string) => {
    setLines(lines.filter((l) => l.id !== id));
  }, []);
  const clear = useCallback(() => setLines([]), []);

  return useMemo<Cart>(
    () => ({
      lines: current,
      count: current.length,
      hydrated,
      has: (id: string) => current.some((l) => l.id === id),
      add,
      remove,
      clear,
    }),
    [current, hydrated, add, remove, clear],
  );
}

/** Kept for symmetry with the old API — no longer needs to wrap the tree. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
