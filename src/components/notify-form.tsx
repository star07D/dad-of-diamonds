"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error" | "unavailable";

export function NotifyForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // Rendered once, used to reject bot submits that fire instantly.
  const [startedAt] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, startedAt }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("sent");
      } else if (data.configured === false) {
        setStatus("unavailable");
      } else {
        setStatus("error");
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <p className="text-sm text-accent-strong">
        You&apos;re on the list — we&apos;ll email you about new pieces.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      {/* Honeypot — hidden from people, tempting to bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full min-w-0 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/10"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0 disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "sending" ? "…" : "Notify me"}
        </button>
      </div>

      {(status === "error" || status === "unavailable") && (
        <p className="mt-2 text-xs text-amber-800 dark:text-amber-300">
          {status === "unavailable"
            ? "Signup isn't fully set up yet — try WhatsApp instead."
            : error}
        </p>
      )}
    </form>
  );
}
