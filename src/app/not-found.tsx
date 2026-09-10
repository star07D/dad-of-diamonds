import Link from "next/link";
import { DiamondMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <DiamondMark draw className="h-12 w-12 text-accent" />
      <p className="eyebrow mt-6">404</p>
      <h1 className="mt-3 font-display text-4xl">This page has been set aside</h1>
      <p className="mt-3 max-w-sm text-muted">
        The piece you&apos;re looking for may have sold, or the link is out of
        date.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-accent"
        >
          Home
        </Link>
        <Link
          href="/shop"
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast"
        >
          Back to the collection
        </Link>
      </div>
    </div>
  );
}
