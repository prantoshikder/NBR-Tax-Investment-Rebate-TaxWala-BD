"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_RULES_ID } from "@/lib/tax/rules";
import type { IncomeInput, InvestmentInput } from "@/lib/tax/types";

export const initialIncome: IncomeInput = {
  category: "general",
  employerType: "private",
  isNewTaxpayer: false,
  disabledDependants: 0,
  basicSalary: 600_000, // ৳50,000 / month
  houseRent: 300_000, // ৳25,000 / month
  medical: 60_000, // ৳5,000 / month
  conveyance: 36_000, // ৳3,000 / month
  festivalBonus: 100_000, // two bonuses
  employerPF: 0,
  otherSalary: 0,
  otherIncome: 0,
};

export const initialInvestments: InvestmentInput = {
  dps: 60_000,
  govtSecurities: 0,
  listedSecurities: 0,
  employeePF: 0,
  lifeInsurance: 0,
  universalPension: 0,
  others: 0,
};

interface TaxState {
  rulesId: string;
  /** Show recurring salary fields per month (stored annually either way). */
  monthlyEntry: boolean;
  income: IncomeInput;
  investments: InvestmentInput;
  setIncome: (patch: Partial<IncomeInput>) => void;
  setInvestments: (patch: Partial<InvestmentInput>) => void;
  setMonthlyEntry: (v: boolean) => void;
  setRulesId: (id: string) => void;
  reset: () => void;
}

export const useTaxStore = create<TaxState>()(
  persist(
    (set) => ({
      rulesId: DEFAULT_RULES_ID,
      monthlyEntry: true,
      income: initialIncome,
      investments: initialInvestments,
      setIncome: (patch) => set((s) => ({ income: { ...s.income, ...patch } })),
      setInvestments: (patch) => set((s) => ({ investments: { ...s.investments, ...patch } })),
      setMonthlyEntry: (monthlyEntry) => set({ monthlyEntry }),
      setRulesId: (rulesId) => set({ rulesId }),
      reset: () => set({ income: initialIncome, investments: initialInvestments, monthlyEntry: true }),
    }),
    {
      name: "nbr-tax-simulator:v1",
      version: 1,
      // Rehydrated manually after mount (see <StoreHydrator/>) so the server HTML and the
      // first client render match — no hydration mismatch.
      skipHydration: true,
      // Merge so fields added in later releases get defaults instead of `undefined`.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<TaxState>;
        return {
          ...current,
          ...p,
          income: { ...current.income, ...p.income },
          investments: { ...current.investments, ...p.investments },
        };
      },
    },
  ),
);
