import type { ProductStatus } from "@/lib/types";

const LABELS: Record<ProductStatus, string> = {
  available: "Available",
  reserved: "Reserved",
  sold: "Sold",
};

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
        status === "available"
          ? "bg-accent/15 text-accent-strong"
          : status === "reserved"
            ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
            : "bg-foreground/10 text-muted"
      }`}
    >
      {LABELS[status]}
    </span>
  );
}
