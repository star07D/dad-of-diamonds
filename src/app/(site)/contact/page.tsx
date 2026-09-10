import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SITE } from "@/lib/site";

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

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-2 font-display text-4xl">Let&apos;s talk</h1>
      <p className="mt-3 text-muted">
        Questions about a stone, a bespoke commission, or a private viewing —
        send a note and you&apos;ll hear back within one business day. You can
        also reach us on{" "}
        <a href={SITE.whatsapp} className="text-accent underline underline-offset-4">
          WhatsApp
        </a>{" "}
        or at{" "}
        <a href={`mailto:${SITE.email}`} className="text-accent underline underline-offset-4">
          {SITE.email}
        </a>
        .
      </p>

      <ContactForm prefilledItems={items} />
    </div>
  );
}
