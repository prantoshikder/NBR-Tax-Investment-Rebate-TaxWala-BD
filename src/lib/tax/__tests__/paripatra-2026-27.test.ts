/**
 * Cases from NBR "আয়কর পরিপত্র ২০২৬-২০২৭" and Finance Act 2026 (PDF page numbers).
 */
import { describe, expect, it } from "vitest";
import { calculateTax } from "../calculator";
import { filingOutcome } from "../filing";
import { RULE_SETS } from "../rules";
import { TY_2026_27 } from "../rules/ty2026-27";
import { TY_2027_28 } from "../rules/ty2027-28";
import type { IncomeInput, InvestmentInput } from "../types";

const income = (o: Partial<IncomeInput> = {}): IncomeInput => ({
  category: "general",
  employerType: "private",
  isNewTaxpayer: false,
  disabledDependants: 0,
  basicSalary: 0,
  houseRent: 0,
  medical: 0,
  conveyance: 0,
  festivalBonus: 0,
  employerPF: 0,
  otherSalary: 0,
  otherIncome: 0,
  ...o,
});
const noInv: InvestmentInput = {
  dps: 0,
  govtSecurities: 0,
  listedSecurities: 0,
  employeePF: 0,
  lifeInsurance: 0,
  universalPension: 0,
  others: 0,
};

describe("rebate cap examples (Paripatra p.68–69)", () => {
  it("Example 23: income 5 crore, investment 1 crore → ৳7,50,000 cap", () => {
    const r = calculateTax(income({ otherIncome: 50_000_000 }), { ...noInv, listedSecurities: 10_000_000 }, TY_2026_27);
    expect(r.rebate).toBe(750_000);
  });
  it("Example 24: income 2 crore, investment 40 lakh → ৳4,00,000", () => {
    const r = calculateTax(income({ otherIncome: 20_000_000 }), { ...noInv, listedSecurities: 4_000_000 }, TY_2026_27);
    expect(r.rebate).toBe(400_000);
  });
});

describe("filing incentive / extra tax (Paripatra p.95–96)", () => {
  it("income 9,00,000 → tax 60,000", () => {
    expect(calculateTax(income({ otherIncome: 900_000 }), noInv, TY_2026_27).grossTax).toBe(60_000);
  });
  it("Example 29: ৳45,000 payable, filed 10 Aug 2026 → 42,750", () => {
    expect(filingOutcome(45_000, new Date(2026, 7, 10), TY_2026_27).total).toBe(42_750);
  });
  it("Example 30: ৳45,000 payable, filed 3 Mar 2027 → 48,000", () => {
    expect(filingOutcome(45_000, new Date(2027, 2, 3), TY_2026_27).total).toBe(48_000);
  });
});

describe("tax year 2027-28 (Finance Act 2026 Sch.2 Part 1 Anuchchhed-Ka, p.142)", () => {
  it("is registered", () => expect(RULE_SETS["2027-28"]).toBe(TY_2027_28));

  it("uses the same thresholds, slabs, minimum tax and rebate as 2026-27", () => {
    for (const key of ["thresholds", "slabs", "minimumTax", "rebate", "salaryExemption", "disabledDependantBonus"] as const) {
      expect(TY_2027_28[key]).toEqual(TY_2026_27[key]);
    }
  });

  it("gives the same tax for the same income", () => {
    const i = income({ basicSalary: 1_260_000 });
    const inv = { ...noInv, lifeInsurance: 50_000, dps: 150_000, govtSecurities: 100_000 };
    expect(calculateTax(i, inv, TY_2027_28).netTax).toBe(25_800);
  });

  it("filing windows move one year forward", () => {
    expect(filingOutcome(25_800, new Date(2027, 7, 15), TY_2027_28).total).toBe(24_510);
    expect(filingOutcome(25_800, new Date(2028, 1, 1), TY_2027_28).total).toBe(28_800);
    expect(filingOutcome(25_800, new Date(2027, 0, 15), TY_2027_28).window).toBeNull();
  });
});
