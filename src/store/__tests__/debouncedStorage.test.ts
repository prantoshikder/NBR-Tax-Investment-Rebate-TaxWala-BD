import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createDebouncedStorage } from "../debouncedStorage";

function fakeBase() {
  const data = new Map<string, string>();
  const writes: [string, string][] = [];
  return {
    writes,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => {
      writes.push([k, v]);
      data.set(k, v);
    },
    removeItem: (k: string) => void data.delete(k),
  };
}

describe("createDebouncedStorage", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("collapses rapid writes (slider drag) into one write of the last value", () => {
    const base = fakeBase();
    const s = createDebouncedStorage(base, 300);
    s.setItem("k", "1");
    vi.advanceTimersByTime(100);
    s.setItem("k", "2");
    vi.advanceTimersByTime(100);
    s.setItem("k", "3");
    expect(base.writes).toEqual([]);
    vi.advanceTimersByTime(300);
    expect(base.writes).toEqual([["k", "3"]]);
  });

  it("flush() writes the pending value immediately (page closing)", () => {
    const base = fakeBase();
    const s = createDebouncedStorage(base, 300);
    s.setItem("k", "pending");
    s.flush();
    expect(base.writes).toEqual([["k", "pending"]]);
    vi.advanceTimersByTime(1000);
    expect(base.writes).toHaveLength(1);
  });

  it("reads see the pending value before it is written", () => {
    const base = fakeBase();
    base.setItem("k", "old");
    const s = createDebouncedStorage(base, 300);
    s.setItem("k", "new");
    expect(s.getItem("k")).toBe("new");
  });

  it("reads through to the base storage", () => {
    const base = fakeBase();
    base.setItem("k", "stored");
    expect(createDebouncedStorage(base).getItem("k")).toBe("stored");
  });
});
