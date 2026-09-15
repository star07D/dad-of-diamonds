const BADGES = [
  {
    label: "GIA / IGI certified",
    path: "M12 3 3 7.5v6c0 4.5 3.6 7.7 9 10.5 5.4-2.8 9-6 9-10.5v-6L12 3Z m-3.5 9 2.3 2.3L15.5 10",
  },
  {
    label: "Secure Stripe checkout",
    path: "M6 11V8a6 6 0 0 1 12 0v3 M5 11h14v9H5v-9Z",
  },
  {
    label: "Insured, tracked delivery",
    path: "M3 7h11v10H3V7Z M14 10h4l3 3v4h-7v-7Z M6.5 20.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z M17 20.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5Z",
  },
];

export function TrustBadges({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 ${className}`}>
      {BADGES.map((b) => (
        <li
          key={b.label}
          className="inline-flex items-center gap-1.5 text-xs text-muted"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={b.path} />
          </svg>
          {b.label}
        </li>
      ))}
    </ul>
  );
}
