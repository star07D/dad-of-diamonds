import Link from "next/link";
import { DiamondMark } from "./logo";
import { NotifyForm } from "./notify-form";
import { TrustBadges } from "./trust-badges";
import { SITE, CATEGORIES } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="eyebrow">New arrivals</p>
            <p className="mt-1 font-display text-xl">Be first to see new pieces</p>
          </div>
          <NotifyForm />
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link href="/" className="group inline-flex items-center gap-2.5">
            <DiamondMark className="h-6 w-6 text-accent transition-transform duration-300 group-hover:rotate-6" />
            <span className="font-display text-lg font-semibold">{SITE.name}</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted">{SITE.description}</p>
          <TrustBadges className="mt-5" />
        </div>

        <div>
          <p className="eyebrow">Collection</p>
          <ul className="mt-3 space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  className="text-muted transition-colors hover:text-accent"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a href={`mailto:${SITE.email}`} className="transition-colors hover:text-accent">
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="transition-colors hover:text-accent">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.whatsapp} className="transition-colors hover:text-accent" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={SITE.instagram} className="transition-colors hover:text-accent" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-accent">
                About the collection
              </Link>
            </li>
            <li>
              <Link href="/guide" className="transition-colors hover:text-accent">
                Understanding the 4 Cs
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition-colors hover:text-accent">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/size-guide" className="transition-colors hover:text-accent">
                Ring size guide
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All pieces sold subject to
            availability.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>Certificates issued by GIA / IGI. Prices include applicable taxes.</p>
            <Link href="/privacy" className="underline underline-offset-4 transition-colors hover:text-accent">
              Privacy Policy
            </Link>
            <Link href="/terms" className="underline underline-offset-4 transition-colors hover:text-accent">
              Terms of Sale
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
