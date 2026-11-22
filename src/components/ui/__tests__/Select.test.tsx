// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Select } from "../Select";

afterEach(cleanup);

const OPTIONS = [
  { value: "2026-27", label: "আয়বর্ষ ২০২৫-২৬", description: "এখন যে রিটার্ন দাখিল হচ্ছে" },
  { value: "2027-28", label: "আয়বর্ষ ২০২৬-২৭", description: "চলতি বছরের বিনিয়োগ পরিকল্পনা" },
];

const setup = (onChange = vi.fn()) => {
  render(<Select label="হিসাবের বছর" value="2026-27" onChange={onChange} options={OPTIONS} />);
  return { onChange, trigger: screen.getByRole("combobox", { name: /হিসাবের বছর/ }) };
};

describe("Select", () => {
  it("shows the selected option on the trigger and starts closed", () => {
    const { trigger } = setup();
    expect(trigger.textContent).toContain("আয়বর্ষ ২০২৫-২৬");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("opens on click and marks the current option selected", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const opts = screen.getAllByRole("option");
    expect(opts[0].getAttribute("aria-selected")).toBe("true");
    expect(opts[1].getAttribute("aria-selected")).toBe("false");
  });

  it("selects with the mouse and closes", () => {
    const { trigger, onChange } = setup();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("আয়বর্ষ ২০২৬-২৭"));
    expect(onChange).toHaveBeenCalledWith("2027-28");
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("is fully keyboard operable: ArrowDown opens, ArrowDown moves, Enter picks", () => {
    const { trigger, onChange } = setup();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const list = screen.getByRole("listbox");
    fireEvent.keyDown(list, { key: "ArrowDown" });
    fireEvent.keyDown(list, { key: "Enter" });
    expect(onChange).toHaveBeenCalledWith("2027-28");
  });

  it("Escape closes without changing and returns focus to the trigger", () => {
    const { trigger, onChange } = setup();
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(onChange).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes on a click/tap outside", () => {
    const { trigger } = setup();
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("does not call onChange when re-picking the current value", () => {
    const { trigger, onChange } = setup();
    fireEvent.click(trigger);
    fireEvent.click(screen.getAllByRole("option")[0]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
