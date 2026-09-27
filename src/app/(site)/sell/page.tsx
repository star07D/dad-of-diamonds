import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sell or trade in",
  description:
    "Tell us about a diamond or piece of jewellery you'd like to sell or trade in.",
};

export default function SellPage() {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 py-16 sm:px-6">
      <DiamondMark className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-accent/10" />

      <Reveal>
        <p className="eyebrow">Sell or trade in</p>
        <h1 className="mt-2 font-display text-4xl">Have something to sell?</h1>
        <p className="mt-3 text-muted">
          Tell us about the piece — loose stone, ring, or anything else — and
          we&apos;ll let you know if it&apos;s something we&apos;re able to
          offer on. Every piece is reviewed individually, so we can&apos;t
          promise a purchase or a price in advance.{" "}
          <a
            href={SITE.whatsapp}
            className="text-accent underline underline-offset-4"
          >
            WhatsApp
          </a>{" "}
          works too, if that&apos;s easier.
        </p>
      </Reveal>

      <Reveal delay={90}>
        <ContactForm intent="sell" />
      </Reveal>
    </div>
  );
}
