"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import { useLoupe } from "@/lib/use-loupe";
import { Lightbox } from "./lightbox";

export function ProductGallery({
  images,
  sold = false,
}: {
  images: ProductImage[];
  sold?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const current = images[active] ?? images[0];
  const loupe = useLoupe();

  return (
    <div>
      <div
        {...loupe}
        onClick={() => setLightboxOpen(true)}
        className="cursor-light group relative cursor-zoom-in overflow-hidden rounded-lg border border-border bg-surface-muted"
      >
        <img
          src={current?.src}
          alt={current?.alt}
          className={`aspect-square w-full object-cover transition-transform duration-[900ms] ease-out ${
            sold ? "opacity-70 grayscale" : ""
          }`}
        />
        <span className="absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </span>
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
        Hover to inspect · click to zoom
      </p>

      {lightboxOpen && (
        <Lightbox
          images={images}
          index={active}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setActive}
        />
      )}
    </div>
  );
}
