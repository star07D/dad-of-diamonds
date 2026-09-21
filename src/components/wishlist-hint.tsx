"use client";

import { useState } from "react";
import { ShareButtons } from "./share-buttons";
import { SITE } from "@/lib/site";

/** Max pieces put in a shared link — keeps the URL a sensible length. */
const HINT_MAX = 24;

export function WishlistHint({ slugs }: { slugs: string[] }) {
  const [name, setName] = useState("");

  const origin =
    typeof window === "undefined" ? SITE.url : window.location.origin;
  const from = name.trim().slice(0, 40);
  const url =
    `${origin}/wishlist/shared?items=${slugs.slice(0, HINT_MAX).join(",")}` +
    (from ? `&from=${encodeURIComponent(from)}` : "");

  return (
    <div className="mt-10 rounded-lg border border-border bg-surface-muted p-6">
      <p className="eyebrow">Drop a hint</p>
      <h2 className="mt-2 font-display text-xl">Send this list to someone</h2>
      <p className="mt-2 max-w-lg text-sm text-muted">
        They&apos;ll see exactly the pieces you&apos;ve saved. Nothing is
        stored — the link itself carries the list.
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          placeholder="Your name (optional)"
          aria-label="Your name (optional)"
          className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/10 sm:max-w-xs"
        />
        <ShareButtons
          title={
            from
              ? `${from} dropped a hint — a few pieces from ${SITE.name}`
              : `A few pieces I love from ${SITE.name}`
          }
          url={url}
        />
      </div>
    </div>
  );
}
