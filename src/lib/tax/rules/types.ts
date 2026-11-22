import type { TaxpayerCategory } from "../types";

export interface FilingWindow {
  /** ISO dates, inclusive. */
  from: string;
  to: string;
  /** incentive: rebate = min(rate × tax, amount). extra: added = max(rate × tax, amount). */
  kind: "incentive" | "none" | "extra";
  rate: number;
  amount: number;
}

/**
 * Everything that changes from budget to budget lives here.
 * Add a new file per tax year and register it in ./index.ts — no engine changes needed.
 */
export interface TaxRules {
  id: string;
  label: string;
  shortLabel: string;
  incomeYear: { start: string; end: string };
  /** Date someone last checked these numbers against the official source. */
  verifiedOn: string;
  /** Short Bangla name of the governing source, shown in the UI. */
  basis: string;
  sources: { title: string; url: string }[];

  thresholds: Record<TaxpayerCategory, number>;
  disabledDependantBonus: number;
  /** Progressive bands that follow the tax-free threshold. */
  slabs: { width: number; rate: number }[];
  salaryExemption: { fraction: number; cap: number };
  minimumTax: { regular: number; newTaxpayer: number };
  rebate: {
    incomeRate: number;
    investmentRate: number;
    cap: number;
    limits: { dps: number; govtSecurities: number };
  };
  filingWindows: FilingWindow[];
}
