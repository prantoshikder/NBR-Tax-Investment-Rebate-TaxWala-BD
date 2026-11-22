import { describe, expect, it } from "vitest";
import { easeOutCubic, interpolate } from "../motion";

describe("easeOutCubic", () => {
  it("starts at 0 and ends at 1", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });
  it("is ahead of linear midway (ease-out)", () => expect(easeOutCubic(0.5)).toBeGreaterThan(0.5));
  it("clamps outside [0,1]", () => {
    expect(easeOutCubic(-1)).toBe(0);
    expect(easeOutCubic(3)).toBe(1);
  });
});

describe("interpolate", () => {
  it("returns from at t=0 and exactly to at t>=1", () => {
    expect(interpolate(100, 200, 0)).toBe(100);
    expect(interpolate(100, 200, 1)).toBe(200);
    expect(interpolate(200, 100, 2)).toBe(100);
  });
  it("returns whole taka mid-way", () => {
    expect(Number.isInteger(interpolate(0, 28_600, 0.37))).toBe(true);
  });
});
