"use client";

import { CheckCircle2, Info, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export interface ToastOptions {
  message: string;
  tone?: "success" | "info";
  action?: { label: string; onClick: () => void };
  durationMs?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
}

const MAX_TOASTS = 3;

/** Keep at most MAX_TOASTS; make room by dropping the oldest toast that has no action (undo). */
function trimToasts(list: ToastItem[]): ToastItem[] {
  const out = [...list];
  while (out.length > MAX_TOASTS) {
    const i = out.findIndex((t) => !t.action);
    out.splice(i === -1 ? 0 : i, 1);
  }
  return out;
}
const ToastContext = createContext<{ show: (t: ToastOptions) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setItems((all) => all.filter((t) => t.id !== id)), []);
  const show = useCallback((t: ToastOptions) => {
    const id = nextId.current++;
    setItems((all) => trimToasts([...all, { ...t, id }]));
  }, []);
  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-3 bottom-24 z-40 flex flex-col items-center gap-2 lg:bottom-6 print:hidden"
        role="status"
        aria-live="polite"
      >
        {items.map((t) => (
          <ToastView key={t.id} item={t} dismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastView({ item, dismiss }: { item: ToastItem; dismiss: (id: number) => void }) {
  // Timer pauses while the pointer or keyboard focus is on the toast, so there is time
  // to reach "Undo"; it then finishes only the remaining time.
  const [paused, setPaused] = useState(false);
  const remaining = useRef(item.durationMs ?? 3500);
  useEffect(() => {
    if (paused) return;
    const started = Date.now();
    const timer = window.setTimeout(() => dismiss(item.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - started;
    };
  }, [paused, item.id, dismiss]);
  const onDismiss = () => dismiss(item.id);

  const Icon = item.tone === "info" ? Info : CheckCircle2;
  return (
    <div
      data-toast
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
      }}
      className="pointer-events-auto flex w-full max-w-md animate-[toast-in_220ms_ease-out] items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-2xl shadow-slate-900/30">
      <Icon className={`size-4 shrink-0 ${item.tone === "info" ? "text-sky-300" : "text-emerald-400"}`} />
      <span className="flex-1">{item.message}</span>
      {item.action && (
        <button
          type="button"
          onClick={() => {
            item.action?.onClick();
            onDismiss();
          }}
          className="rounded-lg px-2.5 py-1 font-semibold text-emerald-300 transition hover:bg-white/10 active:scale-95"
        >
          {item.action.label}
        </button>
      )}
      <button type="button" onClick={onDismiss} aria-label="বন্ধ করুন" className="text-slate-500 transition hover:text-slate-300">
        <X className="size-4" />
      </button>
    </div>
  );
}
