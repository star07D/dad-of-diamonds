import { Reveal } from "./reveal";
import { SITE } from "@/lib/site";

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** "@handle" taken from SITE.instagram so there's one place to edit. */
function instagramHandle(): string {
  try {
    return new URL(SITE.instagram).pathname.replace(/\//g, "");
  } catch {
    return "";
  }
}

export function InstagramStrip() {
  const handle = instagramHandle();
  if (!handle) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal className="flex flex-col items-center gap-4 text-center">
        <InstagramIcon className="h-7 w-7 text-accent" />
        <div>
          <p className="eyebrow">Instagram</p>
          <h2 className="mt-2 font-display text-3xl">Follow along</h2>
        </div>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent active:translate-y-0"
        >
          @{handle}
        </a>
      </Reveal>
    </section>
  );
}
