"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCompare } from "@/lib/compare-context";
import { useCatalog } from "@/lib/use-catalog";

/** Fixed bottom bar that appears once at least one piece is added to compare. */
export function CompareTray() {
  const { ids, hydrated, remove, clear } = useCompare();
  const { catalog } = useCatalog();

  const products = useMemo(() => {
    if (!catalog) return [];
    const byId = new Map(catalog.map((p) => [p.id, p]));
    return ids.map((id) => byId.get(id)).filter((p) => Boolean(p));
  }, [catalog, ids]);

  if (!hydrated || ids.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          {products.map(
            (p) =>
              p && (
                <div
                  key={p.id}
                  className="group relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-border"
                >
                  <img
                    src={p.images[0]?.src}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    aria-label={`Remove ${p.name} from comparison`}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                    >
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </div>
              ),
          )}
          <span className="text-sm text-muted">
            {ids.length} to compare
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clear}
            className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 active:translate-y-0"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  );
}
