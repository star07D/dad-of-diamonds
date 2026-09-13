export function HeartIcon({
  filled = false,
  className = "h-5 w-5",
}: {
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.3S3.5 15.1 3.5 9.1C3.5 6 5.9 3.7 8.8 3.7c1.6 0 3.1.8 4 2 .9-1.2 2.4-2 4-2 2.9 0 5.3 2.3 5.3 5.4 0 6-9.1 11.2-9.1 11.2Z" />
    </svg>
  );
}
