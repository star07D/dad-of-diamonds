import Link from "next/link";
import { DiamondMark } from "./logo";
import { SITE, CATEGORIES } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <DiamondMark className="h-6 w-6 text-accent" />
            <span className="font-display text-lg font-semibold">{SITE.name}</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted">{SITE.description}</p>
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
              <a href={`mailto:${SITE.email}`} className="hover:text-accent">
                {SITE.email}
              </a>
            </li>
            <li>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="hover:text-accent">
                {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.whatsapp} className="hover:text-accent" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <Link href="/about" className="hover:text-accent">
                About the collection
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All pieces sold subject to
            availability.
          </p>
          <p>Certificates issued by GIA / IGI. Prices include applicable taxes.</p>
        </div>
      </div>
    </footer>
  );
}
