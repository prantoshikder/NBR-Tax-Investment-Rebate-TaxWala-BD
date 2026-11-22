"use client";

import clsx from "clsx";
import { Info } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { num, parseAmount } from "@/lib/format";

export function Card({ className, children, id }: { className?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className={clsx("rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]", className)}>
      {children}
    </section>
  );
}

export function CardHeader({
  step,
  title,
  subtitle,
  action,
}: {
  step?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex items-start gap-3">
        {step && (
          <span className="num mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
            {step}
          </span>
        )}
        <div>
          <h2 className="text-[17px] font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </header>
  );
}

/** Info tooltip: hover on desktop, tap/focus on touch & keyboard. Escape or blur closes it. */
export function Hint({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label="বিস্তারিত"
        aria-describedby={id}
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault(); // don't let a parent <label> focus its input
          setOpen((o) => !o);
        }}
        onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        className="-m-1 rounded-full p-1 text-slate-400 transition hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-emerald-500"
      >
        <Info className="size-3.5" aria-hidden />
      </button>
      <span
        id={id}
        role="tooltip"
        className={clsx(
          "pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-60 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-normal leading-relaxed text-slate-100 shadow-lg transition duration-150",
          open
            ? "translate-y-0 opacity-100"
            : "translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100",
        )}
      >
        {children}
      </span>
    </span>
  );
}

/** ৳-prefixed amount input with lakh-style grouping that doesn't fight the cursor while typing. */
export function AmountField({
  label,
  value,
  onChange,
  hint,
  suffix,
  note,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: ReactNode;
  suffix?: string;
  note?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
        {label}
        {hint && <Hint>{hint}</Hint>}
      </label>
      <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50/60 px-3 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
        <span className="text-slate-400">৳</span>
        <input
          id={id}
          inputMode="numeric"
          autoComplete="off"
          className="num w-full bg-transparent px-2 py-2.5 text-[15px] font-medium text-slate-900 outline-none"
          value={draft ?? num(value)}
          onFocus={(e) => {
            setDraft(value ? String(value) : "");
            requestAnimationFrame(() => e.target.select());
          }}
          onChange={(e) => {
            setDraft(e.target.value);
            onChange(parseAmount(e.target.value));
          }}
          onBlur={() => setDraft(null)}
        />
        {suffix && <span className="shrink-0 text-xs text-slate-400">{suffix}</span>}
      </div>
      {note && <p className="mt-1 text-xs text-slate-400">{note}</p>}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  size?: "sm" | "md";
}) {
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const n = options.length;
  return (
    <div
      className="relative inline-grid rounded-xl bg-slate-100 p-1"
      style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      role="radiogroup"
    >
      {/* Sliding highlight: equal-width columns, so position follows the index. */}
      <span
        aria-hidden
        className="absolute inset-y-1 left-1 rounded-lg bg-white shadow-sm transition-transform duration-300 ease-out"
        style={{ width: `calc((100% - 0.5rem) / ${n})`, transform: `translateX(${index * 100}%)` }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={clsx(
            "relative z-10 whitespace-nowrap rounded-lg font-medium transition-colors duration-200 active:scale-[0.97]",
            size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm",
            value === o.value ? "text-slate-900" : "text-slate-500 hover:text-slate-700",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Switch({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 px-4 py-3 text-left transition hover:border-slate-300 active:scale-[0.99]"
    >
      <span>
        <span className="block text-sm font-medium text-slate-800">{label}</span>
        {description && <span className="block text-xs text-slate-500">{description}</span>}
      </span>
      <span className={clsx("relative h-6 w-11 shrink-0 rounded-full transition", checked ? "bg-emerald-500" : "bg-slate-200")}>
        <span
          className={clsx(
            "absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-200 ease-out",
            checked ? "left-[22px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

/** Range slider with a filled track and an optional marker (e.g. the rebate cap). */
export function RangeSlider({
  value,
  max,
  step,
  onChange,
  marker,
  label,
}: {
  value: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  marker?: number;
  label: string;
}) {
  const pctFill = Math.min(100, (value / max) * 100);
  return (
    <div className="relative py-2">
      {marker !== undefined && marker < max && (
        <span
          className="pointer-events-none absolute top-0 h-[22px] w-px bg-amber-400"
          style={{ left: `${(marker / max) * 100}%` }}
          aria-hidden
        />
      )}
      <input
        type="range"
        aria-label={label}
        min={0}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range w-full"
        style={{ ["--fill" as string]: `${pctFill}%` }}
      />
    </div>
  );
}
