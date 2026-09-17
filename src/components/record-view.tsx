"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/lib/recently-viewed-context";

/** Renders nothing — just logs this product into the visitor's recently-viewed list. */
export function RecordView({ productId }: { productId: string }) {
  const { record } = useRecentlyViewed();

  useEffect(() => {
    record(productId);
  }, [productId, record]);

  return null;
}
