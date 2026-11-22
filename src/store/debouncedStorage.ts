import type { StateStorage } from "zustand/middleware";

type BaseStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

/**
 * Wraps a storage so bursts of writes (dragging a slider fires ~60/s) become a single
 * write `waitMs` after the last one. Reads see pending values; `flush()` writes them now.
 */
export function createDebouncedStorage(base: BaseStorage, waitMs = 300): StateStorage & { flush(): void } {
  const pending = new Map<string, string>();
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = () => {
    if (timer) clearTimeout(timer);
    timer = null;
    for (const [k, v] of pending) {
      try {
        base.setItem(k, v);
      } catch {
        // storage full or disabled (private mode) — the app keeps working without saving
      }
    }
    pending.clear();
  };

  return {
    getItem: (k) => pending.get(k) ?? base.getItem(k),
    setItem: (k, v) => {
      pending.set(k, v);
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, waitMs);
    },
    removeItem: (k) => {
      pending.delete(k);
      base.removeItem(k);
    },
    flush,
  };
}

let instance: ReturnType<typeof createDebouncedStorage> | null = null;

/** Browser-only debounced localStorage; flushes when the page is hidden or closed. */
export function getDebouncedLocalStorage() {
  if (!instance) {
    instance = createDebouncedStorage(window.localStorage);
    const flush = instance.flush;
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flush();
    });
  }
  return instance;
}
