// @vitest-environment jsdom
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Collapse } from "../Collapse";

const inner = (c: HTMLElement) => c.firstElementChild!.firstElementChild as HTMLElement;

describe("Collapse", () => {
  it("clips content while closed", () => {
    const { container } = render(<Collapse open={false}>x</Collapse>);
    expect(inner(container).className).toContain("overflow-hidden");
  });

  it("stops clipping once open and the height transition has finished (tooltips, focus rings)", () => {
    const { container, rerender } = render(<Collapse open={false}>x</Collapse>);
    rerender(<Collapse open>x</Collapse>);
    const outer = container.firstElementChild as HTMLElement;
    expect(inner(container).className).toContain("overflow-hidden"); // still animating
    fireEvent.transitionEnd(outer, { propertyName: "grid-template-rows" });
    expect(inner(container).className).not.toContain("overflow-hidden");
  });

  it("clips again as soon as it starts closing", () => {
    const { container, rerender } = render(<Collapse open>x</Collapse>);
    fireEvent.transitionEnd(container.firstElementChild!, { propertyName: "grid-template-rows" });
    rerender(<Collapse open={false}>x</Collapse>);
    expect(inner(container).className).toContain("overflow-hidden");
  });
});
