/**
 * Every case here is a worked example from NBR's "আয়কর নির্দেশিকা ২০২৬-২০২৭".
 * The expected numbers are NBR's own; "p." = PDF page. If a rule change breaks one of
 * these, the rules file is wrong — not the test.
 */
import { describe, expect, it } from "vitest";
import { buildAdvice } from "../advisor";
import { calculateTax } from "../calculator";
import { filingOutcome } from "../filing";
import { TY_2026_27 as R } from "../rules/ty2026-27";
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

const inv = (o: Partial<InvestmentInput> = {}): InvestmentInput => ({
  dps: 0,
  govtSecurities: 0,
  listedSecurities: 0,
  employeePF: 0,
  lifeInsurance: 0,
  universalPension: 0,
  others: 0,
  ...o,
});

describe("slabs (p.64)", () => {
  it("male, income 50 lakh → 11,10,000", () => {
    expect(calculateTax(income({ otherIncome: 5_000_000 }), inv(), R).grossTax).toBe(1_110_000);
  });
  it("woman, income 50 lakh → 10,95,000", () => {
    const r = calculateTax(income({ category: "female_or_senior", otherIncome: 5_000_000 }), inv(), R);
    expect(r.grossTax).toBe(1_095_000);
  });
});

describe("disabled-child threshold bonus (Example-17, p.65)", () => {
  it("father, 2 disabled children, income 6 lakh → 10,000", () => {
    const r = calculateTax(income({ disabledDependants: 2, otherIncome: 600_000 }), inv(), R);
    expect(r.threshold).toBe(500_000);
    expect(r.grossTax).toBe(10_000);
  });
  it("mother claims instead, income 7 lakh → 15,000", () => {
    const r = calculateTax(
      income({ category: "female_or_senior", disabledDependants: 2, otherIncome: 700_000 }),
      inv(),
      R,
    );
    expect(r.grossTax).toBe(15_000);
  });
});

describe("govt pay-scale employee, Rupali Bank (p.96–97)", () => {
  const r = calculateTax(
    income({
      employerType: "govt_pay_scale",
      basicSalary: 426_000,
      festivalBonus: 71_000,
      otherSalary: 106_500, // incentive bonus
      houseRent: 170_400,
      medical: 18_000,
      conveyance: 7_100, // Nababarsha allowance (exempt)
    }),
    inv({ employeePF: 48_000, others: 3_000 }),
    R,
  );
  it("taxable income 6,03,500", () => expect(r.totalIncome).toBe(603_500));
  it("gross tax 20,350", () => expect(r.grossTax).toBe(20_350));
  it("rebate 5,100", () => expect(r.rebate).toBe(5_100));
  it("net 15,250", () => expect(r.netTax).toBe(15_250));
});

describe("private employee, Ms Mahbuba Akter (p.98–100)", () => {
  const r = calculateTax(
    income({
      category: "female_or_senior",
      basicSalary: 630_000,
      festivalBonus: 105_000,
      medical: 60_000,
      houseRent: 300_000,
      otherSalary: 18_000 + 180_000, // entertainment + car
      otherIncome: 130_000 + 60_000 + 110_000,
    }),
    inv({ govtSecurities: 250_000, lifeInsurance: 60_000 }),
    R,
  );
  it("gross salary 12,93,000, exemption 4,31,000", () => {
    expect(r.grossSalary).toBe(1_293_000);
    expect(r.salaryExemption).toBe(431_000);
  });
  it("total income 11,62,000", () => expect(r.totalIncome).toBe(1_162_000));
  it("gross tax 92,400", () => expect(r.grossTax).toBe(92_400));
  it("rebate 31,000 → 61,400", () => {
    expect(r.rebate).toBe(31_000);
    expect(r.netTax).toBe(61_400);
  });
});

describe("teacher, Mr Toufiqur Rahman (p.102–104)", () => {
  const r = calculateTax(
    income({
      basicSalary: 480_000,
      houseRent: 186_000,
      medical: 24_000,
      festivalBonus: 80_000,
      otherSalary: 10_000,
      otherIncome: 1_536_000,
    }),
    inv({ govtSecurities: 400_000 }),
    R,
  );
  it("exemption 2,60,000, total 20,56,000", () => {
    expect(r.salaryExemption).toBe(260_000);
    expect(r.totalIncome).toBe(2_056_000);
  });
  it("gross 3,04,000, rebate 40,000, after 2,64,000", () => {
    expect(r.grossTax).toBe(304_000);
    expect(r.rebate).toBe(40_000);
    expect(r.netTax).toBe(264_000);
  });
});

describe("doctor, Mr Mehedi Hasan — caps on DPS & sanchaypatra, PF both sides (p.105–107)", () => {
  const r = calculateTax(
    income({
      basicSalary: 720_000,
      houseRent: 350_000,
      festivalBonus: 120_000,
      medical: 36_000,
      employerPF: 84_000,
      otherSalary: 10_000,
      otherIncome: 5_400_000,
    }),
    inv({ employeePF: 84_000, dps: 180_000, govtSecurities: 800_000, listedSecurities: 1_500_000 }),
    R,
  );
  it("gross salary 13,20,000 → exemption 4,40,000", () => {
    expect(r.grossSalary).toBe(1_320_000);
    expect(r.salaryExemption).toBe(440_000);
  });
  it("eligible investment 22,88,000", () => expect(r.eligibleInvestment).toBe(2_288_000));
  it("gross 14,94,000, rebate 1,88,400, net 13,05,600", () => {
    expect(r.grossTax).toBe(1_494_000);
    expect(r.rebate).toBe(188_400);
    expect(r.netTax).toBe(1_305_600);
  });
});

describe("engineer — ৳5 lakh exemption cap binds (p.108–109)", () => {
  const r = calculateTax(income({ basicSalary: 1_800_000, otherIncome: 1_360_000 + 180_000 }), inv(), R);
  it("exemption 5,00,000", () => expect(r.salaryExemption).toBe(500_000));
  it("gross tax 5,00,000", () => expect(r.grossTax).toBe(500_000));
});

describe("Mr Abdur Rouf + filing windows (Example-23, p.76–78)", () => {
  const r = calculateTax(
    income({ basicSalary: 1_260_000 }),
    inv({ lifeInsurance: 50_000, dps: 150_000, govtSecurities: 100_000 }),
    R,
  );
  it("taxable 8,40,000, eligible 2,70,000", () => {
    expect(r.totalIncome).toBe(840_000);
    expect(r.eligibleInvestment).toBe(270_000);
  });
  it("gross 51,000, rebate 25,200, net 25,800", () => {
    expect(r.grossTax).toBe(51_000);
    expect(r.rebate).toBe(25_200);
    expect(r.netTax).toBe(25_800);
  });
  it("filed Jul–Sep → 24,510", () => expect(filingOutcome(25_800, new Date(2026, 7, 15), R).total).toBe(24_510));
  it("filed Oct–Dec → 25,800", () => expect(filingOutcome(25_800, new Date(2026, 10, 22), R).total).toBe(25_800));
  it("filed Jan–Mar → 28,800", () => expect(filingOutcome(25_800, new Date(2027, 1, 1), R).total).toBe(28_800));
  it("filed Apr–Jun → 30,800", () => expect(filingOutcome(25_800, new Date(2027, 4, 1), R).total).toBe(30_800));
});

describe("minimum tax", () => {
  it("new taxpayer pays ৳1,000 (Example-22, p.74–75)", () => {
    const r = calculateTax(income({ isNewTaxpayer: true, otherIncome: 430_000 }), inv({ dps: 96_000 }), R);
    expect(r.grossTax).toBe(3_000);
    expect(r.netTax).toBe(1_000);
    expect(r.minimumTaxApplied).toBe(true);
  });
  it("regular taxpayer pays ৳5,000 in the same case (p.66)", () => {
    const r = calculateTax(income({ otherIncome: 430_000 }), inv({ dps: 96_000 }), R);
    expect(r.netTax).toBe(5_000);
  });
  it("no tax at or below threshold", () => {
    expect(calculateTax(income({ otherIncome: 400_000 }), inv(), R).netTax).toBe(0);
  });
});

describe("rebate-chapter examples", () => {
  it("Example-18 (p.69–70): 9,80,000 woman → 35,100", () => {
    const r = calculateTax(
      income({ category: "female_or_senior", otherIncome: 980_000 }),
      inv({ employeePF: 96_000, others: 3_000, govtSecurities: 150_000, lifeInsurance: 18_000, listedSecurities: 50_000 }),
      R,
    );
    expect(r.grossTax).toBe(64_500);
    expect(r.rebate).toBe(29_400);
    expect(r.netTax).toBe(35_100);
  });
  it("Example-19 (p.70–71): 6,80,000 → 8,200", () => {
    const r = calculateTax(income({ otherIncome: 680_000 }), inv({ others: 198_000 }), R);
    expect(r.grossTax).toBe(28_000);
    expect(r.rebate).toBe(19_800);
    expect(r.netTax).toBe(8_200);
  });
  it("Example-20 (p.72–73): 28,50,000 → 4,17,000", () => {
    const r = calculateTax(
      income({ otherIncome: 2_850_000 }),
      inv({ lifeInsurance: 60_000, dps: 240_000, govtSecurities: 150_000, others: 50_000, listedSecurities: 700_000 }),
      R,
    );
    expect(r.eligibleInvestment).toBe(1_080_000);
    expect(r.grossTax).toBe(502_500);
    expect(r.rebate).toBe(85_500);
    expect(r.netTax).toBe(417_000);
  });
  it("Example-21 (p.73–74): woman 6,50,000 → 12,800", () => {
    const r = calculateTax(income({ category: "female_or_senior", otherIncome: 650_000 }), inv({ dps: 72_000 }), R);
    expect(r.grossTax).toBe(20_000);
    expect(r.rebate).toBe(7_200);
    expect(r.netTax).toBe(12_800);
  });
});

describe("advisor", () => {
  const i = income({ basicSalary: 600_000, houseRent: 300_000, medical: 60_000, conveyance: 36_000, festivalBonus: 100_000 });
  const v = inv({ dps: 60_000 });

  it("default scenario: net 28,600, can save 15,920 more", () => {
    const r = calculateTax(i, v, R);
    expect(r.netTax).toBe(28_600);
    const plan = buildAdvice(i, v, R, r);
    expect(plan.status).toBe("ACTION_NEEDED");
    if (plan.status !== "ACTION_NEEDED") return;
    expect(plan.gap).toBe(159_200);
    expect(plan.totalSaving).toBe(15_920);
    expect(plan.suggestions.map((s) => [s.sector, s.additional])).toEqual([
      ["dps", 60_000],
      ["govtSecurities", 99_200],
    ]);
  });

  it("never suggests investing past the point where minimum tax kicks in", () => {
    // gross tax 3,000 < minimum 5,000 → nothing to gain
    expect(buildAdvice(income({ otherIncome: 430_000 }), inv(), R).status).toBe("MINIMUM_TAX");
  });

  it("OPTIMIZED once the 3% limit is reached", () => {
    expect(buildAdvice(i, inv({ dps: 120_000, govtSecurities: 100_000 }), R).status).toBe("OPTIMIZED");
  });
});
