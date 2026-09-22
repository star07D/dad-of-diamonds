"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import { DiamondMark } from "./logo";

type Status = "idle" | "sending" | "sent" | "error" | "unavailable";

const TIME_OPTIONS = ["Flexible", "Morning", "Afternoon", "Evening"];

export function ContactForm({
  prefilledItems = [],
  intent,
}: {
  prefilledItems?: string[];
  intent?: "offer" | "viewing";
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [timePref, setTimePref] = useState(TIME_OPTIONS[0]);
  const [message, setMessage] = useState(
    prefilledItems.length && intent !== "viewing"
      ? intent === "offer"
        ? `I'd like to make an offer on:\n${prefilledItems
            .map((s) => `- ${SITE.url}/product/${s}`)
            .join("\n")}\n\nMy offer: $\n\n`
        : `I'm interested in the following piece(s):\n${prefilledItems
            .map((s) => `- ${SITE.url}/product/${s}`)
            .join("\n")}\n\n`
      : "",
  );
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // Rendered once, used to reject bot submits that fire instantly.
  const [startedAt] = useState(() => Date.now());

  // For a viewing request, the date/time fields are the real content — the
  // free-text box becomes an optional note appended after them.
  const fullMessage =
    intent === "viewing"
      ? [
          "I'd like to book a private viewing.",
          "",
          `Preferred date: ${date || "(flexible)"}`,
          `Preferred time: ${timePref}`,
          ...(prefilledItems.length
            ? [
                "",
                "Piece(s):",
                ...prefilledItems.map((s) => `- ${SITE.url}/product/${s}`),
              ]
            : []),
          ...(message.trim() ? ["", message.trim()] : []),
        ].join("\n")
      : message;

  const whatsappText = encodeURIComponent(
    `${fullMessage}\n\n— ${name || "(your name)"}${email ? ` (${email})` : ""}`,
  );
  const whatsapp = `${SITE.whatsapp}?text=${whatsappText}`;
  const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(
    intent === "offer"
      ? "Offer on a piece"
      : intent === "viewing"
        ? "Private viewing request"
        : prefilledItems.length
          ? "Enquiry about a piece"
          : "Enquiry — Dad of Diamonds",
  )}&body=${whatsappText}`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: fullMessage,
          items: prefilledItems,
          intent,
          startedAt,
        }),
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
      <div className="hero-media mt-10 rounded-lg border border-border bg-surface-muted p-6">
        <DiamondMark draw className="h-6 w-6 text-accent" />
        <p className="mt-3 font-display text-xl">
          {intent === "viewing" ? "Request sent." : "Message sent."}
        </p>
        <p className="mt-2 text-sm text-muted">
          {intent === "viewing"
            ? `Thanks, ${name.split(" ")[0]} — we'll confirm your appointment within one business day.`
            : `Thanks, ${name.split(" ")[0]} — you'll hear back within one business day.`}
        </p>
      </div>
    );
  }

  return (
    <form className="mt-10 space-y-5" onSubmit={onSubmit}>
      {/* Honeypot — hidden from people, tempting to bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-muted">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 outline-none transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 outline-none transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/10"
          />
        </label>
      </div>

      {intent === "viewing" && (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted">Preferred date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 outline-none transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/10"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">Preferred time</span>
            <select
              value={timePref}
              onChange={(e) => setTimePref(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 outline-none transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/10"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      <label className="block text-sm">
        <span className="text-muted">
          {intent === "viewing" ? "Anything else? (optional)" : "Message"}
        </span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={intent === "viewing" ? 4 : 7}
          required={intent !== "viewing"}
          placeholder={
            intent === "viewing"
              ? "Any pieces you'd like to see, or scheduling notes."
              : "Tell us the occasion, a rough budget, and any preferences on shape or size."
          }
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 outline-none transition-shadow focus:border-accent focus:ring-4 focus:ring-accent/10"
        />
      </label>

      {(status === "error" || status === "unavailable") && (
        <p className="rounded-md bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300">
          {status === "unavailable"
            ? "The contact form isn't fully set up yet — please use WhatsApp or email below instead."
            : error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 disabled:shadow-none"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border px-6 py-3 text-center text-sm transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0"
        >
          Send on WhatsApp
        </a>
        {status === "unavailable" && (
          <a
            href={mailto}
            className="rounded-full border border-border px-6 py-3 text-center text-sm transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0"
          >
            Open in email app
          </a>
        )}
      </div>

      <p className="text-xs text-muted">
        Sent straight to us — you&apos;ll hear back within one business day.
      </p>
    </form>
  );
}
