"use client";

import { useMemo } from "react";
import { buildAdvice } from "@/lib/tax/advisor";
import { calculateTax } from "@/lib/tax/calculator";
import { getRules } from "@/lib/tax/rules";
import { useTaxStore } from "@/store/useTaxStore";

/** Single place that turns store state into results, so every component sees the same numbers. */
export function useTaxModel() {
  const income = useTaxStore((s) => s.income);
  const investments = useTaxStore((s) => s.investments);
  const rulesId = useTaxStore((s) => s.rulesId);
  const rules = getRules(rulesId);

  const result = useMemo(() => calculateTax(income, investments, rules), [income, investments, rules]);
  const advice = useMemo(
    () => buildAdvice(income, investments, rules, result),
    [income, investments, rules, result],
  );

  return { income, investments, rules, result, advice };
}
