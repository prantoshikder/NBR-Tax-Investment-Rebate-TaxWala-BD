import { calculateTax } from "./calculator";
import type { TaxRules } from "./rules/types";
import type { IncomeInput, InvestmentInput, TaxResult } from "./types";

export type Sector = "dps" | "govtSecurities" | "listedSecurities";

export interface Suggestion {
  sector: Sector;
  additional: number;
  /** Real reduction in net tax from this step, computed by re-running the calculator. */
  taxSaved: number;
}

export type AdvicePlan =
  | { status: "NO_TAX" }
  | { status: "MINIMUM_TAX" }
  | { status: "OPTIMIZED"; rebate: number }
  | {
      status: "ACTION_NEEDED";
      gap: number;
      targetRebate: number;
      totalSaving: number;
      suggestions: Suggestion[];
    };

/**
 * How much more eligible investment would bring the most tax saving, and where to put it.
 * The useful rebate is limited by: 3% of income, the ৳7.5 lakh cap, and the fact that the
 * tax can never go below the minimum tax.
 */
export function buildAdvice(
  income: IncomeInput,
  investments: InvestmentInput,
  rules: TaxRules,
  current: TaxResult = calculateTax(income, investments, rules),
): AdvicePlan {
  if (current.netTax === 0) return { status: "NO_TAX" };

  const usefulRebate = Math.min(current.rebateIncomeLimit, Math.max(0, current.grossTax - current.minimumTax));
  if (usefulRebate <= 0) return { status: "MINIMUM_TAX" };

  const requiredEligible = Math.ceil(usefulRebate / rules.rebate.investmentRate);
  const gap = Math.max(0, requiredEligible - current.eligibleInvestment);
  if (gap === 0) return { status: "OPTIMIZED", rebate: current.rebate };

  const order: { sector: Sector; room: number }[] = [
    { sector: "dps", room: Math.max(0, rules.rebate.limits.dps - investments.dps) },
    { sector: "govtSecurities", room: Math.max(0, rules.rebate.limits.govtSecurities - investments.govtSecurities) },
    { sector: "listedSecurities", room: Infinity },
  ];

  let remaining = gap;
  let running: InvestmentInput = { ...investments };
  let runningTax = current.netTax;
  const suggestions: Suggestion[] = [];

  for (const { sector, room } of order) {
    if (remaining <= 0) break;
    const add = Math.min(remaining, room);
    if (add <= 0) continue;
    running = { ...running, [sector]: running[sector] + add };
    const next = calculateTax(income, running, rules);
    suggestions.push({ sector, additional: add, taxSaved: runningTax - next.netTax });
    runningTax = next.netTax;
    remaining -= add;
  }

  return {
    status: "ACTION_NEEDED",
    gap,
    targetRebate: usefulRebate,
    totalSaving: current.netTax - runningTax,
    suggestions,
  };
}
