"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";

interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  status: "available" | "reserved" | "sold";
  image: string | null;
  summary: string;
}

export default function CartPage() {
  const { lines, remove, clear, hydrated } = useCart();
  const [catalog, setCatalog] = useState<CatalogItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enquiry, setEnquiry] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setCatalog)
      .catch(() => setError("Could not load the catalogue. Please refresh."));
  }, []);

  const items = useMemo(() => {
    if (!catalog) return [];
    return lines
      .map((l) => catalog.find((c) => c.id === l.id))
      .filter((x): x is CatalogItem => Boolean(x));
  }, [catalog, lines]);

  const total = items.reduce((sum, i) => sum + i.price, 0);
  const unavailable = items.filter((i) => i.status !== "available");

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: items.map((i) => i.id) }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      if (data.configured === false) {
        setEnquiry(true);
        return;
      }
      setError(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!hydrated || catalog === null) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <p className="text-muted">Loading your cart…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <DiamondMark className="animate-float h-10 w-10 text-accent" />
        <h1 className="mt-6 font-display text-3xl">Your cart is empty</h1>
        <p className="mt-3 text-muted">
          Browse the collection and reserve a piece.
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
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <Reveal as="h1" className="font-display text-4xl">
        Your cart
      </Reveal>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {items.map((item, i) => (
          <Reveal as="li" key={item.id} delay={i * 60}>
            <div className="group flex gap-4 rounded-lg px-2 py-5 -mx-2 transition-colors hover:bg-surface-muted/60">
              <Link
                href={`/product/${item.slug}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border bg-surface-muted"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </Link>
              <div className="flex flex-1 flex-col">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-display text-lg transition-colors hover:text-accent"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-muted">{item.summary}</p>
                {item.status !== "available" && (
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                    No longer available — please remove to continue.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="mt-auto w-fit text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
                >
                  Remove
                </button>
              </div>
              <div className="text-sm font-medium">{formatPrice(item.price)}</div>
            </div>
          </Reveal>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={clear}
          className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
        >
          Clear cart
        </button>
        <div className="text-right">
          <p className="eyebrow">Total</p>
          <p className="font-display text-2xl">{formatPrice(total)}</p>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-md bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          {error}
        </p>
      )}

      {enquiry ? (
        <div className="mt-6 rounded-lg border border-border bg-surface-muted p-5 text-sm">
          <p className="font-medium">Online payment isn&apos;t live yet.</p>
          <p className="mt-2 text-muted">
            Send this list and we&apos;ll confirm availability and share payment
            details directly.
          </p>
          <Link
            href={`/contact?items=${items.map((i) => i.slug).join(",")}`}
            className="mt-4 inline-block rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
          >
            Send enquiry
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={checkout}
          disabled={busy || unavailable.length > 0}
          className="mt-6 w-full rounded-full bg-accent px-6 py-3.5 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
        >
          {busy
            ? "Redirecting to secure checkout…"
            : unavailable.length > 0
              ? "Remove unavailable items to continue"
              : "Proceed to checkout"}
        </button>
      )}

      <p className="mt-3 text-center text-xs text-muted">
        Payments are processed securely by Stripe. We never see your card
        details.
      </p>
    </div>
  );
}
