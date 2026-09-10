import Link from "next/link";
import { SITE } from "@/lib/site";

/** The diamond mark on its own — a stylised brilliant cut, top view. */
export function DiamondMark({
  className = "",
  draw = false,
}: {
  className?: string;
  /** Animate the facets drawing themselves in on mount. */
  draw?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={`${className} ${draw ? "mark-draw" : ""}`}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
        {/* girdle outline */}
        <path d="M24 3 44 18 24 45 4 18Z" />
        {/* table */}
        <path d="M15 18h18l-9-12-9 12Z" />
        {/* table to culet */}
        <path d="M15 18 24 45 33 18" />
        {/* crown facets */}
        <path d="M4 18 15 18M44 18 33 18" />
        <path d="M24 6 15 18M24 6 33 18" />
        {/* pavilion facets */}
        <path d="M4 18 24 45M44 18 24 45" />
      </g>
    </svg>
  );
}

export function Logo({
  className = "",
  markClassName = "h-7 w-7",
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label={`${SITE.name} — home`}
    >
      <DiamondMark className={`${markClassName} text-accent transition-transform duration-300 group-hover:rotate-6`} />
      <span className="font-display text-xl leading-none tracking-wide sm:text-[1.35rem]">
        <span className="font-semibold">Dad</span>
        <span className="mx-1 text-muted">of</span>
        <span className="font-semibold">Diamonds</span>
      </span>
    </Link>
  );
}
