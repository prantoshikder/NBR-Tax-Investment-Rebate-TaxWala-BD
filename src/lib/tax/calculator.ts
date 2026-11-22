import type { TaxRules } from "./rules/types";
import type { IncomeInput, InvestmentInput, SlabLine, TaxResult } from "./types";

const round = (n: number) => Math.round(n);
const nonNeg = (n: number) => (Number.isFinite(n) && n > 0 ? n : 0);

export function grossSalaryOf(income: IncomeInput): number {
  return (
    nonNeg(income.basicSalary) +
    nonNeg(income.houseRent) +
    nonNeg(income.medical) +
    nonNeg(income.conveyance) +
    nonNeg(income.festivalBonus) +
    nonNeg(income.employerPF) +
    nonNeg(income.otherSalary)
  );
}

/**
 * Salary exemption.
 * - private: lower of 1/3 of gross salary receipts and the cap (Nirdeshika p.31, examples p.99–108).
 * - govt pay scale: no para-27 exemption; the pay-order allowances (house rent, medical,
 *   conveyance & similar) are exempt instead (p.31–33, example p.96–97).
 */
export function salaryExemptionOf(income: IncomeInput, rules: TaxRules): number {
  if (income.employerType === "govt_pay_scale") {
    return nonNeg(income.houseRent) + nonNeg(income.medical) + nonNeg(income.conveyance);
  }
  const gross = grossSalaryOf(income);
  return round(Math.min(gross * rules.salaryExemption.fraction, rules.salaryExemption.cap));
}

export function thresholdOf(income: IncomeInput, rules: TaxRules): number {
  const extra = Math.max(0, Math.floor(nonNeg(income.disabledDependants))) * rules.disabledDependantBonus;
  return rules.thresholds[income.category] + extra;
}

export function slabTax(totalIncome: number, threshold: number, rules: TaxRules) {
  const lines: SlabLine[] = [
    { from: 0, to: threshold, rate: 0, amountInBand: Math.min(totalIncome, threshold), tax: 0 },
  ];
  let remaining = Math.max(0, totalIncome - threshold);
  let cursor = threshold;
  let tax = 0;
  for (const band of rules.slabs) {
    const inBand = Math.min(remaining, band.width);
    const bandTax = inBand * band.rate;
    lines.push({ from: cursor, to: cursor + band.width, rate: band.rate, amountInBand: inBand, tax: round(bandTax) });
    tax += bandTax;
    remaining -= inBand;
    cursor += band.width;
  }
  return { lines, tax: round(tax) };
}

export function eligibleInvestmentOf(inv: InvestmentInput, income: IncomeInput, rules: TaxRules) {
  const { limits } = rules.rebate;
  const total =
    nonNeg(inv.dps) +
    nonNeg(inv.govtSecurities) +
    nonNeg(inv.listedSecurities) +
    nonNeg(inv.employeePF) +
    nonNeg(income.employerPF) +
    nonNeg(inv.lifeInsurance) +
    nonNeg(inv.universalPension) +
    nonNeg(inv.others);
  // Both employee and employer PF contributions count (Nirdeshika p.67, example p.107).
  const eligible =
    Math.min(nonNeg(inv.dps), limits.dps) +
    Math.min(nonNeg(inv.govtSecurities), limits.govtSecurities) +
    nonNeg(inv.listedSecurities) +
    nonNeg(inv.employeePF) +
    nonNeg(income.employerPF) +
    nonNeg(inv.lifeInsurance) +
    nonNeg(inv.universalPension) +
    nonNeg(inv.others);
  return { total, eligible };
}

/**
 * Tax payable u/s 173 for a resident individual with salary (+ optional other regular income).
 * Out of scope: final-tax / reduced-rate income, firm share, capital gains, wealth surcharge.
 */
export function calculateTax(income: IncomeInput, investments: InvestmentInput, rules: TaxRules): TaxResult {
  const grossSalary = grossSalaryOf(income);
  const salaryExemption = Math.min(grossSalary, salaryExemptionOf(income, rules));
  const taxableSalary = grossSalary - salaryExemption;
  const totalIncome = taxableSalary + nonNeg(income.otherIncome);

  const threshold = thresholdOf(income, rules);
  const { lines: slabs, tax: grossTax } = slabTax(totalIncome, threshold, rules);

  const { total: totalInvestment, eligible: eligibleInvestment } = eligibleInvestmentOf(investments, income, rules);

  // Rebate = least of 3% × income ('ক'), 10% × eligible investment ('খ'), ৳7.5 lakh (p.67)
  const rebateIncomeLimit = round(Math.min(totalIncome * rules.rebate.incomeRate, rules.rebate.cap));
  const rebateFromInvestment = round(
    Math.min(rebateIncomeLimit, eligibleInvestment * rules.rebate.investmentRate),
  );
  // Rebate only offsets an actual liability (p.20)
  const rebate = Math.min(rebateFromInvestment, grossTax);
  const taxAfterRebate = grossTax - rebate;

  // Minimum tax whenever income exceeds the tax-free threshold (p.66)
  const aboveThreshold = totalIncome > threshold;
  const minimumTax = aboveThreshold
    ? income.isNewTaxpayer
      ? rules.minimumTax.newTaxpayer
      : rules.minimumTax.regular
    : 0;
  const netTax = aboveThreshold ? Math.max(taxAfterRebate, minimumTax) : 0;
  const minimumTaxApplied = aboveThreshold && minimumTax > taxAfterRebate;

  const grossIncome = grossSalary + nonNeg(income.otherIncome);

  return {
    grossSalary,
    salaryExemption,
    taxableSalary,
    totalIncome,
    threshold,
    slabs,
    grossTax,
    totalInvestment,
    eligibleInvestment,
    rebateIncomeLimit,
    rebateFromInvestment,
    rebate,
    taxAfterRebate,
    minimumTax,
    minimumTaxApplied,
    netTax,
    effectiveRate: grossIncome > 0 ? netTax / grossIncome : 0,
  };
}
