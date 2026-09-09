"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";

export function ContactForm({
  prefilledItems = [],
}: {
  prefilledItems?: string[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    prefilledItems.length
      ? `I'm interested in the following piece(s):\n${prefilledItems
          .map((s) => `- ${SITE.url}/product/${s}`)
          .join("\n")}\n\n`
      : "",
  );

  const body = encodeURIComponent(
    `${message}\n\n— ${name || "(your name)"}${email ? ` (${email})` : ""}`,
  );
  const subject = encodeURIComponent(
    prefilledItems.length
      ? "Enquiry about a piece"
      : "Enquiry — Dad of Diamonds",
  );
  const mailto = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  const whatsapp = `${SITE.whatsapp}?text=${body}`;

  return (
    <form
      className="mt-10 space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        window.location.href = mailto;
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-muted">Your name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 outline-none focus:border-accent"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 outline-none focus:border-accent"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-muted">Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={7}
          required
          placeholder="Tell us the occasion, a rough budget, and any preferences on shape or size."
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2.5 outline-none focus:border-accent"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
        >
          Send by email
        </button>
        <a
          href={whatsapp}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border px-6 py-3 text-center text-sm transition-colors hover:border-accent"
        >
          Send on WhatsApp
        </a>
      </div>

      <p className="text-xs text-muted">
        This opens your own email app or WhatsApp with the message ready to send —
        nothing is submitted through the website.
      </p>
    </form>
  );
}
