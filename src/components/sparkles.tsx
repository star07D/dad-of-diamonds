/**
 * Four-point star glints scattered across the hero, each twinkling on its own
 * loop. Purely decorative; positions are fixed (no hydration mismatch) and the
 * twinkle animation only runs when the visitor allows motion (globals.css).
 */
const SPARKS = [
  { top: "12%", left: "2%", size: 13, delay: "0.4s" },
  { top: "86%", left: "5%", size: 10, delay: "2.6s" },
  { top: "6%", left: "47%", size: 11, delay: "1.5s" },
  { top: "20%", left: "56%", size: 16, delay: "0s" },
  { top: "40%", left: "95%", size: 12, delay: "3.4s" },
  { top: "73%", left: "97%", size: 9, delay: "1.9s" },
  { top: "92%", left: "62%", size: 14, delay: "3.1s" },
  { top: "34%", left: "70%", size: 8, delay: "0.9s" },
];

export function Sparkles({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-30 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {SPARKS.map((s, i) => (
        <svg
          key={i}
          className="sparkle absolute opacity-0"
          viewBox="0 0 24 24"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            color: "#fff",
            filter: "drop-shadow(0 0 5px var(--accent-strong))",
            // @ts-expect-error custom property
            "--spark-delay": s.delay,
          }}
        >
          <path
            d="M12 0c.7 5.3 6 10.6 11.3 11.3C18 12 12.7 17.3 12 22.6 11.3 17.3 6 12 0.7 11.3 6 10.6 11.3 5.3 12 0Z"
            fill="currentColor"
          />
        </svg>
      ))}
    </div>
  );
}
