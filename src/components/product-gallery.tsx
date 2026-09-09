"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  sold = false,
}: {
  images: ProductImage[];
  sold?: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="overflow-hidden rounded-lg border border-border bg-surface-muted">
        <img
          src={current?.src}
          alt={current?.alt}
          className={`aspect-square w-full object-cover ${sold ? "opacity-70 grayscale" : ""}`}
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-16 overflow-hidden rounded-md border transition-colors ${
                i === active ? "border-accent" : "border-border"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <img src={img.src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
