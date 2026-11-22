import { TY_2026_27 } from "./ty2026-27";
import type { TaxRules } from "./types";

/**
 * Only rule sets verified against an official NBR document are listed.
 * Tax year 2027-28 (income year 2026-27) will be added once its figures are verified
 * from Finance Act 2026 / the next Nirdeshika.
 */
export const RULE_SETS: Record<string, TaxRules> = {
  [TY_2026_27.id]: TY_2026_27,
};

export const DEFAULT_RULES_ID = TY_2026_27.id;

export function getRules(id: string): TaxRules {
  return RULE_SETS[id] ?? RULE_SETS[DEFAULT_RULES_ID];
}

export type { TaxRules, FilingWindow } from "./types";
