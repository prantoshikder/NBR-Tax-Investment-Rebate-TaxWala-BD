"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { COUNT_UP_MS, interpolate } from "@/lib/motion";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** true during SSR/hydration, so the server and first client render show the raw value. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}

/**
 * Tweens towards `value`, starting from whatever is currently on screen, so a value that
 * changes mid-animation (slider drag) continues smoothly instead of snapping back.
 */
export function useAnimatedNumber(value: number, durationMs = COUNT_UP_MS): number {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const shown = useRef(value);

  useEffect(() => {
    if (reduced) {
      shown.current = value;
      return;
    }
    const from = shown.current;
    if (from === value) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = (now - start) / durationMs;
      const next = interpolate(from, value, t);
      shown.current = next;
      setDisplay(next);
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [value, reduced, durationMs]);

  return reduced ? value : display;
}
