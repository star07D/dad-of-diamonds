import { SITE } from "./site";

const formatter = new Intl.NumberFormat(SITE.locale, {
  style: "currency",
  currency: SITE.currency,
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return formatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat(SITE.locale, {
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "numeric",
});

/** `isoDate` as "YYYY-MM-DD" — parsed as UTC so the date shown never shifts
 * a day depending on the reader's timezone. */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}
