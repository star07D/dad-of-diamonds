"use client";

import { useEffect, useState } from "react";
import type { Product } from "./types";

// One shared request for the whole page — several components use the
// catalogue, and each used to download and parse its own copy.
let inflight: Promise<Product[]> | null = null;

function loadCatalog(): Promise<Product[]> {
  inflight ??= fetch("/api/products")
    .then((r) => r.json() as Promise<Product[]>)
    .catch((err) => {
      inflight = null; // let a later caller retry
      throw err;
    });
  return inflight;
}

/**
 * The public catalogue feed, fetched once and shared. Pass `enabled = false`
 * to skip the request until the data is actually needed (e.g. the header
 * search before it's opened, or a tray with nothing in it).
 */
export function useCatalog(enabled = true) {
  const [catalog, setCatalog] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    loadCatalog()
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load the catalogue. Please refresh.");
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { catalog, error };
}
