"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCatalog } from "@/lib/use-catalog";
import { searchProducts } from "@/lib/search";
import { formatPrice } from "@/lib/format";
import { resizedSrc } from "@/lib/image-url";

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  // Only download the catalogue once the search is actually opened.
  const { catalog } = useCatalog(open);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onPointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  const trimmed = query.trim();
  const results = trimmed.length > 1 && catalog ? searchProducts(catalog, trimmed).slice(0, 5) : [];

  function goToResults() {
    if (!trimmed) return;
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Search"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors hover:border-accent hover:text-accent"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-lg border border-border bg-surface p-3 shadow-xl sm:w-96">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToResults();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pieces…"
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/10"
            />
          </form>

          {trimmed.length > 1 && (
            <div className="mt-2">
              {results.length > 0 ? (
                <>
                  <ul className="space-y-1">
                    {results.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/product/${p.slug}`}
                          onClick={() => {
                            setOpen(false);
                            setQuery("");
                          }}
                          className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-surface-muted"
                        >
                          <img
                            src={resizedSrc(p.images[0]?.src, 120)}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm">{p.name}</span>
                            <span className="block text-xs text-muted">
                              {formatPrice(p.price)}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={goToResults}
                    className="mt-1 w-full rounded-md p-2 text-left text-xs text-accent transition-colors hover:bg-surface-muted"
                  >
                    See all results for &ldquo;{trimmed}&rdquo;
                  </button>
                </>
              ) : (
                <p className="p-2 text-sm text-muted">
                  No pieces match &ldquo;{trimmed}&rdquo;.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
