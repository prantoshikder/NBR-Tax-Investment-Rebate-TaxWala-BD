const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/** 1096000 → "10,96,000" (South-Asian lakh grouping, as used in NBR documents). */
export const num = (n: number) => fmt.format(Math.round(n));

/** 1096000 → "৳10,96,000" */
export const taka = (n: number) => `৳${num(n)}`;

export const pct = (r: number, digits = 1) => `${(r * 100).toFixed(digits)}%`;

/** Parse user text like "1,20,000" or "১২০০০০" into a non-negative integer. */
export function parseAmount(text: string): number {
  const western = text.replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));
  const digits = western.replace(/[^0-9]/g, "");
  if (!digits) return 0;
  return Math.min(Number(digits), 99_999_999_999);
}

/** Short Bangla amount: 150000 → "১.৫ লাখ" style but with Latin digits: "1.5 লাখ". */
export function lakh(n: number) {
  if (n >= 10_000_000) return `${+(n / 10_000_000).toFixed(2)} কোটি`;
  if (n >= 100_000) return `${+(n / 100_000).toFixed(2)} লাখ`;
  return num(n);
}
