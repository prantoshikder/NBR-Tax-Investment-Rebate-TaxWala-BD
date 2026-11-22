/** Taxpayer category — decides the tax-free threshold (first 0% slab). */
export type TaxpayerCategory =
  | "general"
  | "female_or_senior" // women, or aged 65+
  | "disabled_or_third_gender"
  | "freedom_fighter_or_july_joddha"; // gazetted war-wounded freedom fighter / gazetted July Joddha

/**
 * private: 6th Schedule Part 1 para 27 applies (exempt = min(1/3 of salary, cap)).
 * govt_pay_scale: govt pay-scale employees (SRO 225/2023). Para 27 does NOT apply;
 *   only basic, festival bonus, incentive bonus etc. are taxable, the listed allowances
 *   (house rent, medical, conveyance, Nababarsha ...) are exempt.
 */
export type EmployerType = "private" | "govt_pay_scale";

/** All amounts are ANNUAL, in BDT. */
export interface IncomeInput {
  category: TaxpayerCategory;
  employerType: EmployerType;
  /** First-time return filer → minimum tax ৳1,000 instead of ৳5,000. */
  isNewTaxpayer: boolean;
  /** Number of disabled children/dependants claimed by this parent (+৳50,000 each). */
  disabledDependants: number;

  basicSalary: number;
  houseRent: number;
  medical: number;
  conveyance: number;
  festivalBonus: number;
  /** Employer's contribution to a recognised provident fund (part of gross salary). */
  employerPF: number;
  /** Any other salary receipt (incentive bonus, mobile/entertainment allowance, car benefit …). */
  otherSalary: number;
  /** Non-salary regular income added to total income (rent, interest, practice …). */
  otherIncome: number;
}

/** All amounts are ANNUAL, in BDT, invested during the income year. */
export interface InvestmentInput {
  dps: number;
  /** Government securities incl. sanchaypatra. */
  govtSecurities: number;
  /** New investment in listed shares / mutual funds / ETFs / unit certificates. */
  listedSecurities: number;
  /** Employee's own contribution to recognised PF (employer's part comes from income). */
  employeePF: number;
  lifeInsurance: number;
  universalPension: number;
  /** Donations to approved institutions, zakat fund, welfare/group insurance funds etc. */
  others: number;
}

export interface SlabLine {
  /** Width of the band in BDT; Infinity for the last band. */
  from: number;
  to: number;
  rate: number;
  amountInBand: number;
  tax: number;
}

export interface TaxResult {
  grossSalary: number;
  salaryExemption: number;
  taxableSalary: number;
  totalIncome: number;
  threshold: number;
  slabs: SlabLine[];
  grossTax: number;

  totalInvestment: number;
  eligibleInvestment: number;
  /** min(3% of income, cap) — the best rebate this income could ever get. */
  rebateIncomeLimit: number;
  rebateFromInvestment: number;
  /** Rebate actually used against the tax. */
  rebate: number;

  taxAfterRebate: number;
  minimumTax: number;
  minimumTaxApplied: boolean;
  /** Tax payable u/s 173 (before filing-time incentive / extra tax). */
  netTax: number;
  effectiveRate: number;
}
