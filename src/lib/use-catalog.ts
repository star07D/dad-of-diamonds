"use client";

import { useEffect, useState } from "react";
import type { Product } from "./types";

/** Fetches the public catalogue feed once. Shared by the cart and wishlist pages. */
export function useCatalog() {
  const [catalog, setCatalog] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setCatalog)
      .catch(() => setError("Could not load the catalogue. Please refresh."));
  }, []);

  return { catalog, error };
}
