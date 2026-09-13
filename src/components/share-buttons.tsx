"use client";

import { useState, useSyncExternalStore } from "react";

const iconButton =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent active:translate-y-0";

const noSubscription = () => () => {};

export function ShareButtons({ title, url }: { title: string; url: string }) {
  // The capability never changes after mount; this just defers reading it to
  // the client so server and first client render agree (no effect needed).
  const canNativeShare = useSyncExternalStore(
    noSubscription,
    () => typeof navigator !== "undefined" && "share" in navigator,
    () => false,
  );
  const [copied, setCopied] = useState(false);

  async function nativeShare() {
    try {
      await navigator.share({ title, url });
    } catch {
      /* user cancelled the share sheet — nothing to do */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the WhatsApp / native options still work */
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;

  return (
    <div className="flex items-center gap-3">
      <span className="eyebrow">Share</span>
      <div className="flex items-center gap-2">
        {canNativeShare && (
          <button
            type="button"
            onClick={nativeShare}
            aria-label="Share"
            className={iconButton}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15V4M12 4 8 8M12 4l4 4" />
              <path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5" />
            </svg>
          </button>
        )}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Share on WhatsApp"
          className={iconButton}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 20l1.4-4.1A7.9 7.9 0 1 1 8.7 19L4 20Z" />
            <path d="M9 10.5c.3 1.8 2.2 3.7 4 4 .8.1 1.5-.5 1.8-1.2" strokeLinecap="round" />
          </svg>
        </a>
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link"
          className={iconButton}
        >
          {copied ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5 10 17l9-10" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.5 14.5 14.5 9.5" />
              <path d="M11.5 6.5 13 5a3 3 0 0 1 4.2 4.2l-1.5 1.5M12.5 17.5 11 19a3 3 0 0 1-4.2-4.2l1.5-1.5" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
