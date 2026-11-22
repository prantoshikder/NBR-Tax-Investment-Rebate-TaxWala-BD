"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * Today's date as "YYYY-MM-DD" on the client, `null` during SSR and hydration —
 * so date-dependent UI never causes a hydration mismatch.
 */
export function useToday(): string | null {
  return useSyncExternalStore(noopSubscribe, todayISO, () => null);
}
