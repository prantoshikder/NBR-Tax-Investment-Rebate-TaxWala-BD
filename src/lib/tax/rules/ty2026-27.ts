import type { TaxRules } from "./types";

/**
 * Tax year 2026-27  (income year 1 July 2025 – 30 June 2026).
 *
 * Source: NBR "আয়কর নির্দেশিকা ২০২৬-২০২৭" (published 1 Sep 2026), which reflects the
 * Income Tax Act 2023 as amended by Finance Act 2026.
 * https://nbr.gov.bd/uploads/publications/Aykor_Nirdashikha_2026-2027_BG_Press_Modify_Copy.pdf
 * Page numbers below are PDF pages (printed page + 8).
 *
 * NOTE: these supersede the figures in Income Tax Paripatra 2025-26 (3.75 lakh threshold,
 * 15% / 10 lakh rebate), which were changed by Finance Act 2026.
 */
export const TY_2026_27: TaxRules = {
  id: "2026-27",
  label: "করবর্ষ ২০২৬-২৭ (আয়বর্ষ ২০২৫-২৬)",
  shortLabel: "আয়বর্ষ ২০২৫-২৬",
  incomeYear: { start: "2025-07-01", end: "2026-06-30" },
  verifiedOn: "2026-11-22",
  basis: "NBR আয়কর নির্দেশিকা ২০২৬-২৭",
  sources: [
    {
      title: "আয়কর নির্দেশিকা ২০২৬-২০২৭ (NBR)",
      url: "https://nbr.gov.bd/uploads/publications/Aykor_Nirdashikha_2026-2027_BG_Press_Modify_Copy.pdf",
    },
    {
      title: "Finance Act, 2026 (NBR)",
      url: "https://nbr.gov.bd/uploads/acts/Finance_Act_2026.pdf",
    },
  ],

  // p.19
  thresholds: {
    general: 400_000,
    female_or_senior: 450_000,
    disabled_or_third_gender: 525_000,
    freedom_fighter_or_july_joddha: 550_000,
  },
  disabledDependantBonus: 50_000, // p.19 (ঘ), per child/ward; only one parent may claim

  // p.19 — bands AFTER the tax-free threshold
  slabs: [
    { width: 300_000, rate: 0.1 },
    { width: 400_000, rate: 0.15 },
    { width: 500_000, rate: 0.2 },
    { width: 2_000_000, rate: 0.25 },
    { width: Infinity, rate: 0.3 },
  ],

  // p.31, p.95 item 17 — 6th Schedule Part 1 para 27
  salaryExemption: { fraction: 1 / 3, cap: 500_000 },

  // p.66 — flat nationwide, no area split
  minimumTax: { regular: 5_000, newTaxpayer: 1_000 },

  // p.67 — least of 3% of income, 10% of investment, ৳7.5 lakh
  rebate: {
    incomeRate: 0.03,
    investmentRate: 0.1,
    cap: 750_000,
    limits: {
      dps: 120_000, // p.67, p.21 row 7
      govtSecurities: 500_000, // p.67, p.21 row 5
    },
  },

  // p.12 — filing-time incentive / extra tax on tax payable u/s 173
  filingWindows: [
    { from: "2026-07-01", to: "2026-09-30", kind: "incentive", rate: 0.05, amount: 25_000 },
    { from: "2026-10-01", to: "2026-12-31", kind: "none", rate: 0, amount: 0 },
    { from: "2027-01-01", to: "2027-03-31", kind: "extra", rate: 0.02, amount: 3_000 },
    { from: "2027-04-01", to: "2027-06-30", kind: "extra", rate: 0.05, amount: 5_000 },
  ],
};
