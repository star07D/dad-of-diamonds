import Link from "next/link";

export default function SiteNotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-28 text-center sm:px-6">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-4xl">This page has been set aside</h1>
      <p className="mt-3 text-muted">
        The piece you&apos;re looking for may have sold, or the link is out of
        date.
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast"
      >
        Back to the collection
      </Link>
    </div>
  );
}
