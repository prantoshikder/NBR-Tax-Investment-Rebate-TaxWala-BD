"use client";

import { useState, type ReactNode } from "react";

/**
 * Height animation without measuring: grid rows 0fr ↔ 1fr. Hidden content is inert.
 * Content is clipped only while closed or animating; once fully open it may overflow,
 * so tooltips and focus rings near the edges aren't cut off.
 */
export function Collapse({ open, children }: { open: boolean; children: ReactNode }) {
  const [settled, setSettled] = useState(true);
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    setSettled(false);
  }

  return (
    <div
      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
      inert={!open}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && e.propertyName === "grid-template-rows") setSettled(true);
      }}
    >
      <div className={`min-h-0 ${open && settled ? "overflow-visible" : "overflow-hidden"}`}>{children}</div>
    </div>
  );
}
