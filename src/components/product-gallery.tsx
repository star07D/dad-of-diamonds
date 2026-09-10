"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import { useLoupe } from "@/lib/use-loupe";

export function ProductGallery({
  images,
  sold = false,
}: {
  images: ProductImage[];
  sold?: boolean;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  const loupe = useLoupe();

  return (
    <div>
      <div
        {...loupe}
        className="cursor-light overflow-hidden rounded-lg border border-border bg-surface-muted"
      >
        <img
          src={current?.src}
          alt={current?.alt}
          className={`aspect-square w-full object-cover transition-transform duration-[900ms] ease-out ${
            sold ? "opacity-70 grayscale" : ""
          }`}
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

      <p className="mt-3 hidden text-xs text-muted sm:block">
        Hover to inspect
      </p>
    </div>
  );
}
