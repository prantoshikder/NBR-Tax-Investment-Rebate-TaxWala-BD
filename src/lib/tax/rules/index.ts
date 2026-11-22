import { TY_2026_27 } from "./ty2026-27";
import { TY_2027_28 } from "./ty2027-28";
import type { TaxRules } from "./types";

/**
 * Only rule sets verified against an official NBR document are listed.
 * Insertion order = order in the year selector.
 */
export const RULE_SETS: Record<string, TaxRules> = {
  [TY_2026_27.id]: TY_2026_27,
  [TY_2027_28.id]: TY_2027_28,
};

/** Return season for income year 2025-26 is open now, so it stays the default. */
export const DEFAULT_RULES_ID = TY_2026_27.id;

export function getRules(id: string): TaxRules {
  return RULE_SETS[id] ?? RULE_SETS[DEFAULT_RULES_ID];
}

export type { TaxRules, FilingWindow } from "./types";
