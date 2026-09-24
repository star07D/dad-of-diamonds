"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCompare } from "@/lib/compare-context";
import { useCatalog } from "@/lib/use-catalog";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { StatusBadge } from "@/components/status-badge";
import { formatPrice } from "@/lib/format";
import { resizedSrc } from "@/lib/image-url";
import type { Product } from "@/lib/types";

const ROWS: Array<{ label: string; value: (p: Product) => string | undefined }> = [
  { label: "Price", value: (p) => formatPrice(p.price) },
  { label: "Metal", value: (p) => p.material },
  {
    label: "Carat",
    value: (p) => (p.diamond?.carat ? `${p.diamond.carat.toFixed(2)} ct` : undefined),
  },
  { label: "Shape", value: (p) => p.diamond?.shape },
  { label: "Cut", value: (p) => p.diamond?.cut },
  { label: "Colour", value: (p) => p.diamond?.color },
  { label: "Clarity", value: (p) => p.diamond?.clarity },
  { label: "Certificate", value: (p) => p.diamond?.certificateLab },
];

export default function ComparePage() {
  const { ids, remove, clear, hydrated } = useCompare();
  const { catalog, error } = useCatalog();

  const products = useMemo(() => {
    if (!catalog) return [];
    const byId = new Map(catalog.map((p) => [p.id, p]));
    return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
  }, [catalog, ids]);

  if (!hydrated || catalog === null) {
    return (
      <div className="mx-auto min-h-[70vh] max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-muted">{error ?? "Loading…"}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <DiamondMark className="animate-float h-10 w-10 text-accent" />
        <h1 className="mt-6 font-display text-3xl">Nothing to compare yet</h1>
        <p className="mt-3 text-muted">
          Use the compare icon on any diamond&apos;s product card, or the
          &ldquo;Compare&rdquo; button on its page, to add it here — up to 3
          at a time.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
        >
          Go to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Compare</p>
          <h1 className="mt-2 font-display text-4xl">Side by side</h1>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
        >
          Clear all
        </button>
      </Reveal>

      <Reveal delay={60} className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="w-28" />
              {products.map((p) => (
                <th
                  key={p.id}
                  className="min-w-[180px] border-b border-border px-3 pb-4 text-left align-top font-normal"
                >
                  <div className="relative">
                    <Link href={`/product/${p.slug}`} className="block">
                      <img
                        src={resizedSrc(p.images[0]?.src, 600)}
                        alt={p.images[0]?.alt ?? p.name}
                        className="aspect-square w-full rounded-md object-cover"
                      />
                      <p className="mt-3 font-display text-base leading-snug">
                        {p.name}
                      </p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => remove(p.id)}
                      aria-label={`Remove ${p.name} from comparison`}
                      className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                      >
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                    {p.status !== "available" && (
                      <div className="mt-2">
                        <StatusBadge status={p.status} />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th className="eyebrow border-b border-border py-3 pr-3 text-left align-top font-normal">
                  {row.label}
                </th>
                {products.map((p) => (
                  <td
                    key={p.id}
                    className="border-b border-border px-3 py-3 align-top text-sm"
                  >
                    {row.value(p) ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
