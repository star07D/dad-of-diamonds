import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";
import { getProductBySlug } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Ask about a stone, book a private viewing, or commission a bespoke piece.",
};

export default async function ContactPage({
  searchParams,
}: PageProps<"/contact">) {
  const params = await searchParams;
  const items =
    typeof params.items === "string"
      ? params.items.split(",").filter(Boolean)
      : [];
  const intent =
    params.intent === "offer" ? "offer" : params.intent === "viewing" ? "viewing" : undefined;
  const offerProduct =
    intent === "offer" && items.length === 1
      ? await getProductBySlug(items[0])
      : undefined;

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 py-16 sm:px-6">
      <DiamondMark className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-accent/10" />

      <Reveal>
        <p className="eyebrow">{intent === "viewing" ? "Private viewing" : "Contact"}</p>
        <h1 className="mt-2 font-display text-4xl">
          {intent === "viewing" ? "Book a private viewing" : "Let’s talk"}
        </h1>
        <p className="mt-3 text-muted">
          {intent === "viewing"
            ? "Tell us when suits you and we'll confirm a time to see pieces in person, or by appointment for a specific stone."
            : "Questions about a stone, a bespoke commission, or a private viewing — send a note and you'll hear back within one business day."}{" "}
          You can also reach us on{" "}
          <a
            href={SITE.whatsapp}
            className="text-accent underline underline-offset-4"
          >
            WhatsApp
          </a>{" "}
          or at{" "}
          <a
            href={`mailto:${SITE.email}`}
            className="text-accent underline underline-offset-4"
          >
            {SITE.email}
          </a>
          .
        </p>
      </Reveal>

      {offerProduct && (
        <Reveal
          delay={60}
          className="mt-6 flex items-center gap-3 rounded-lg border border-border bg-surface-muted p-3"
        >
          <img
            src={offerProduct.images[0]?.src}
            alt=""
            className="h-14 w-14 shrink-0 rounded object-cover"
          />
          <div className="min-w-0">
            <p className="eyebrow">Making an offer on</p>
            <p className="truncate text-sm font-medium">{offerProduct.name}</p>
            <p className="text-sm text-muted">{formatPrice(offerProduct.price)}</p>
          </div>
        </Reveal>
      )}

      <Reveal delay={90}>
        <ContactForm prefilledItems={items} intent={intent} />
      </Reveal>
    </div>
  );
}
