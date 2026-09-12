import Link from "next/link";
import { DiamondMark } from "@/components/logo";

export default function SiteNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center sm:px-6">
      <DiamondMark draw className="h-12 w-12 text-accent" />
      <p className="eyebrow mt-6">404</p>
      <h1 className="mt-3 font-display text-4xl">This page has been set aside</h1>
      <p className="mt-3 text-muted">
        The piece you&apos;re looking for may have sold, or the link is out of
        date.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-full border border-border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0"
        >
          Home
        </Link>
        <Link
          href="/shop"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
        >
          Back to the collection
        </Link>
      </div>
    </div>
  );
}
