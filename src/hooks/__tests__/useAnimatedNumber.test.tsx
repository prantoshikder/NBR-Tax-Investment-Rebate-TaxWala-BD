// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAnimatedNumber } from "../useAnimatedNumber";

/** Controllable prefers-reduced-motion media query. */
function mockReducedMotion(initial: boolean) {
  let matches = initial;
  const listeners = new Set<() => void>();
  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() {
      return matches;
    },
    media: query,
    addEventListener: (_: string, cb: () => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: () => void) => listeners.delete(cb),
  }));
  return (next: boolean) => {
    matches = next;
    listeners.forEach((cb) => cb());
  };
}

describe("useAnimatedNumber — reduced motion", () => {
  beforeEach(() => vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame", "performance"] }));
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("shows the new value immediately when reduced motion is on", () => {
    mockReducedMotion(true);
    const { result, rerender } = renderHook(({ v }) => useAnimatedNumber(v), { initialProps: { v: 28_600 } });
    rerender({ v: 22_600 });
    expect(result.current).toBe(22_600);
  });

  it("does not fall back to a stale value when reduced motion is switched off", () => {
    const setReduced = mockReducedMotion(true);
    const { result, rerender } = renderHook(({ v }) => useAnimatedNumber(v), { initialProps: { v: 28_600 } });
    rerender({ v: 22_600 });
    act(() => setReduced(false));
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(22_600);
  });

  it("animates to the final value when motion is allowed", () => {
    mockReducedMotion(false);
    const { result, rerender } = renderHook(({ v }) => useAnimatedNumber(v), { initialProps: { v: 0 } });
    rerender({ v: 10_000 });
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current).toBe(10_000);
  });
});
