import { describe, expect, it } from "vitest";
import { initialIncome, restoreSnapshot, takeSnapshot, useTaxStore } from "../useTaxStore";

describe("reset → undo", () => {
  it("restores exactly the previous income, investments, year and entry mode", () => {
    const s = useTaxStore.getState();
    s.setIncome({ basicSalary: 1_234_000, category: "female_or_senior" });
    s.setInvestments({ dps: 90_000, listedSecurities: 50_000 });
    s.setRulesId("2027-28");
    s.setMonthlyEntry(false);
    const before = takeSnapshot();

    useTaxStore.getState().reset();
    expect(useTaxStore.getState().income).toEqual(initialIncome);

    restoreSnapshot(before);
    const after = useTaxStore.getState();
    expect(after.income).toEqual(before.income);
    expect(after.investments).toEqual(before.investments);
    expect(after.rulesId).toBe("2027-28");
    expect(after.monthlyEntry).toBe(false);
  });
});
