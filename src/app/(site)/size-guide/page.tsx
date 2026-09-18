import type { Metadata } from "next";
import Link from "next/link";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Ring size guide",
  description:
    "Find your ring size — a US/UK/EU conversion chart and two easy ways to measure at home.",
};

const SIZES = [
  { us: "4", uk: "H", eu: "46.5", diameter: "14.9", circumference: "46.8" },
  { us: "4.5", uk: "I", eu: "47.8", diameter: "15.3", circumference: "48.0" },
  { us: "5", uk: "J½", eu: "49.0", diameter: "15.7", circumference: "49.3" },
  { us: "5.5", uk: "K½", eu: "50.3", diameter: "16.1", circumference: "50.6" },
  { us: "6", uk: "L½", eu: "51.5", diameter: "16.5", circumference: "51.9" },
  { us: "6.5", uk: "M½", eu: "52.8", diameter: "16.9", circumference: "53.1" },
  { us: "7", uk: "N½", eu: "54.0", diameter: "17.3", circumference: "54.4" },
  { us: "7.5", uk: "O½", eu: "55.3", diameter: "17.7", circumference: "55.7" },
  { us: "8", uk: "P½", eu: "56.7", diameter: "18.1", circumference: "57.0" },
  { us: "8.5", uk: "Q½", eu: "57.8", diameter: "18.5", circumference: "58.3" },
  { us: "9", uk: "R½", eu: "59.1", diameter: "18.9", circumference: "59.5" },
  { us: "9.5", uk: "S½", eu: "60.3", diameter: "19.4", circumference: "60.8" },
  { us: "10", uk: "T½", eu: "61.5", diameter: "19.8", circumference: "62.1" },
];

export default function SizeGuidePage() {
  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden px-4 py-16 sm:px-6">
      <DiamondMark className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-accent/10" />

      <Reveal>
        <p className="eyebrow">Ring size guide</p>
        <h1 className="mt-2 font-display text-4xl">Finding your size</h1>
        <p className="mt-4 max-w-xl text-muted">
          US, UK/AU and EU ring sizes don&apos;t line up — use the chart below
          to convert, or measure at home with the tips underneath. Outside
          this range, or not sure?{" "}
          <Link href="/contact" className="text-accent underline underline-offset-4">
            Just ask
          </Link>
          .
        </p>
      </Reveal>

      <Reveal delay={70} className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[480px] border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.1em] text-muted">
              <th className="border-b border-border pb-3 pr-4">US</th>
              <th className="border-b border-border pb-3 pr-4">UK / AU</th>
              <th className="border-b border-border pb-3 pr-4">EU</th>
              <th className="border-b border-border pb-3 pr-4">Diameter (mm)</th>
              <th className="border-b border-border pb-3">Circumference (mm)</th>
            </tr>
          </thead>
          <tbody>
            {SIZES.map((s) => (
              <tr key={s.us}>
                <td className="border-b border-border py-2.5 pr-4 font-medium">{s.us}</td>
                <td className="border-b border-border py-2.5 pr-4 text-muted">{s.uk}</td>
                <td className="border-b border-border py-2.5 pr-4 text-muted">{s.eu}</td>
                <td className="border-b border-border py-2.5 pr-4 text-muted">{s.diameter}</td>
                <td className="border-b border-border py-2.5 text-muted">{s.circumference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal
        delay={140}
        className="mt-10 rounded-lg border border-border bg-surface-muted p-6"
      >
        <h2 className="font-display text-xl">How to measure at home</h2>
        <ol className="mt-5 space-y-4 text-sm text-muted">
          <li className="flex gap-3.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-contrast">
              1
            </span>
            <span>
              <span className="font-medium text-foreground">String or paper strip.</span>{" "}
              Wrap it snugly around the base of the finger, mark where it
              overlaps, then measure the length in millimetres — that&apos;s
              your circumference. Match it to the table above.
            </span>
          </li>
          <li className="flex gap-3.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-contrast">
              2
            </span>
            <span>
              <span className="font-medium text-foreground">An existing ring.</span>{" "}
              Measure the inside diameter of a ring that already fits well
              (in millimetres) and match it to the diameter column.
            </span>
          </li>
          <li className="flex gap-3.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-contrast">
              3
            </span>
            <span>
              <span className="font-medium text-foreground">In person.</span>{" "}
              Collecting by appointment? Bring a ring that fits and we&apos;ll
              size it for you on the spot.
            </span>
          </li>
        </ol>
        <p className="mt-5 text-xs text-muted">
          Fingers can vary slightly by time of day and temperature — measure
          when your hands are at a normal temperature, not right after cold
          or heat exposure. Complimentary resizing is available on some
          pieces; check the product page or ask before you buy.
        </p>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/shop?category=rings"
            className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
          >
            Browse rings
          </Link>
          <Link
            href="/contact"
            className="inline-block rounded-full border border-border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0"
          >
            Ask a question
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
