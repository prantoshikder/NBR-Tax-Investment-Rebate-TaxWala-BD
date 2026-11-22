/** Motion helpers. Pure functions are unit-tested; DOM helpers are no-ops on the server. */

export const COUNT_UP_MS = 350;

export function easeOutCubic(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return 1 - Math.pow(1 - x, 3);
}

/** Whole-taka value between `from` and `to` at progress `t` (exactly `to` once t ≥ 1). */
export function interpolate(from: number, to: number, t: number): number {
  if (t >= 1) return to;
  return Math.round(from + (to - from) * easeOutCubic(t));
}

/** Briefly highlight an element (CSS `.flash`), restarting the animation if it is running. */
export function flash(elementId: string): void {
  if (typeof document === "undefined") return;
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.remove("flash");
  void el.offsetWidth; // force reflow so the animation restarts
  el.classList.add("flash");
  window.setTimeout(() => el.classList.remove("flash"), 950);
}
