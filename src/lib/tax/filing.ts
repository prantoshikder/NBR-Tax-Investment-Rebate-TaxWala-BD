import type { FilingWindow, TaxRules } from "./rules/types";

export interface FilingOutcome {
  window: FilingWindow | null;
  /** Negative = incentive (less tax), positive = extra tax. */
  adjustment: number;
  total: number;
  /** true when the date falls after the last regular window (late-return regime applies). */
  afterLastWindow: boolean;
}

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Filing-time incentive / extra tax on the tax payable u/s 173 (Nirdeshika 2026-27 p.12, example p.78). */
export function filingOutcome(netTax: number, date: Date, rules: TaxRules): FilingOutcome {
  const day = toISO(date);
  const window = rules.filingWindows.find((w) => day >= w.from && day <= w.to) ?? null;
  const last = rules.filingWindows[rules.filingWindows.length - 1];
  const afterLastWindow = !window && day > last.to;

  let adjustment = 0;
  if (window && netTax > 0) {
    if (window.kind === "incentive") adjustment = -Math.round(Math.min(netTax * window.rate, window.amount));
    if (window.kind === "extra") adjustment = Math.round(Math.max(netTax * window.rate, window.amount));
  }
  return { window, adjustment, total: netTax + adjustment, afterLastWindow };
}
