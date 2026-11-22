// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flash } from "@/lib/motion";
import { AnimatedNumber } from "../AnimatedNumber";
import { AmountField, Hint, Segmented } from "../primitives";
import { ToastProvider, useToast, type ToastOptions } from "../Toast";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

function Trigger({ toasts }: { toasts: ToastOptions[] }) {
  const t = useToast();
  return <button onClick={() => toasts.forEach((x) => t.show(x))}>go</button>;
}

describe("Toast", () => {
  beforeEach(() => vi.useFakeTimers());

  it("pauses while hovered or focused, then finishes the remaining time", () => {
    render(
      <ToastProvider>
        <Trigger toasts={[{ message: "undo me", durationMs: 5000 }]} />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("go"));
    act(() => vi.advanceTimersByTime(3000));
    const toast = screen.getByText("undo me").closest("[data-toast]")!;
    fireEvent.mouseEnter(toast);
    act(() => vi.advanceTimersByTime(10_000));
    expect(screen.queryByText("undo me")).not.toBeNull();
    fireEvent.mouseLeave(toast);
    act(() => vi.advanceTimersByTime(1900));
    expect(screen.queryByText("undo me")).not.toBeNull();
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText("undo me")).toBeNull();
  });

  it("never drops a toast with an action (undo) to make room", () => {
    render(
      <ToastProvider>
        <Trigger
          toasts={[
            { message: "reset", action: { label: "undo", onClick: () => {} } },
            { message: "a" },
            { message: "b" },
            { message: "c" },
          ]}
        />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText("go"));
    expect(screen.queryByText("reset")).not.toBeNull();
    expect(screen.queryByText("a")).toBeNull();
  });
});

describe("Hint", () => {
  it("is not part of the input's accessible name", () => {
    render(<AmountField label="উৎসব বোনাস" value={0} onChange={() => {}} hint="tooltip text" />);
    expect(screen.getByLabelText("উৎসব বোনাস", { exact: true }).tagName).toBe("INPUT");
  });

  it("closes on a tap outside (iOS doesn't blur buttons on tap)", () => {
    render(<Hint>tip</Hint>);
    const btn = screen.getByRole("button");
    fireEvent.click(btn);
    expect(btn.getAttribute("aria-expanded")).toBe("true");
    fireEvent.pointerDown(document.body);
    expect(btn.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("flash()", () => {
  it("a second flash restarts the full highlight instead of being cut short", () => {
    vi.useFakeTimers();
    const el = document.createElement("div");
    el.id = "target";
    document.body.appendChild(el);
    flash("target");
    vi.advanceTimersByTime(600);
    flash("target");
    vi.advanceTimersByTime(600); // 1200ms after the first flash
    expect(el.classList.contains("flash")).toBe(true);
    vi.advanceTimersByTime(400);
    expect(el.classList.contains("flash")).toBe(false);
  });
});

describe("AnimatedNumber", () => {
  it("contains the number only once at rest (copy / find-in-page)", () => {
    vi.stubGlobal("matchMedia", () => ({ matches: true, addEventListener() {}, removeEventListener() {} }));
    const { container } = render(<AnimatedNumber value={28_600} format={(n) => `৳${n}`} />);
    expect(container.textContent).toBe("৳28600");
  });
});

describe("Segmented", () => {
  it("hides the highlight when no option matches", () => {
    const { container } = render(
      <Segmented value={"zzz" as string} onChange={() => {}} options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]} />,
    );
    expect(container.querySelector("[data-pill]")!.className).toContain("opacity-0");
  });
});
