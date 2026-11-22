import type { TaxRules } from "./types";
import { TY_2026_27 } from "./ty2026-27";

/**
 * Tax year 2027-28  (income year 1 July 2026 – 30 June 2027) — the current income year,
 * i.e. the one people are planning investments for now.
 *
 * Source: Finance Act 2026, Schedule 2 (তফসিল-২) Part 1, Anuchchhed-Ka (PDF p.142):
 * one rate table "for tax years 2026-27 and 2027-28", so thresholds and slabs are identical
 * to TY 2026-27. Minimum tax: same Schedule (p.143). Rebate (s.78, 3% / 10% / ৳7.5 lakh),
 * salary exemption and 6th Schedule Part 3 limits: no further amendment for this year
 * (Income Tax Paripatra 2026-27, PDF p.68–69, p.128–129). Filing-time incentive/extra tax:
 * s.170 as substituted by Finance Act 2026 is permanent law (Paripatra 2026-27 p.94);
 * windows move one year forward.
 *
 * From TY 2028-29 the threshold rises to ৳4.5 lakh and a 35% band applies above ৳3 crore
 * (Finance Act 2026 p.143) — add a separate rules file for that year.
 */
export const TY_2027_28: TaxRules = {
  ...TY_2026_27,
  id: "2027-28",
  label: "করবর্ষ ২০২৭-২৮ (আয়বর্ষ ২০২৬-২৭)",
  shortLabel: "আয়বর্ষ ২০২৬-২৭",
  incomeYear: { start: "2026-07-01", end: "2027-06-30" },
  verifiedOn: "2026-11-22",
  basis: "অর্থ আইন ২০২৬, তফসিল-২",
  purpose: "চলতি বছর — বিনিয়োগ পরিকল্পনার জন্য (জুলাই ২০২৬ – জুন ২০২৭)",
  sources: [
    { title: "Finance Act, 2026 (NBR)", url: "https://nbr.gov.bd/uploads/acts/Finance_Act_2026.pdf" },
    {
      title: "আয়কর পরিপত্র ২০২৬-২০২৭ (NBR)",
      url: "https://nbr.gov.bd/uploads/paripatra/Aykor_Poripothro_2026-2027_BG_Press_Modify_Copy.pdf",
    },
  ],
  filingWindows: [
    { from: "2027-07-01", to: "2027-09-30", kind: "incentive", rate: 0.05, amount: 25_000 },
    { from: "2027-10-01", to: "2027-12-31", kind: "none", rate: 0, amount: 0 },
    { from: "2028-01-01", to: "2028-03-31", kind: "extra", rate: 0.02, amount: 3_000 },
    { from: "2028-04-01", to: "2028-06-30", kind: "extra", rate: 0.05, amount: 5_000 },
  ],
};
