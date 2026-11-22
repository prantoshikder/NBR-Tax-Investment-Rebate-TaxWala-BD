"use client";

import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

/** Renders a number that counts smoothly to its new value. `format` turns it into text. */
export function AnimatedNumber({
  value,
  format,
  className,
}: {
  value: number;
  format: (n: number) => string;
  className?: string;
}) {
  const shown = useAnimatedNumber(value);
  return (
    <span className={className}>
      <span aria-hidden>{format(shown)}</span>
      {/* Screen readers get the final value only, not every frame. */}
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}
