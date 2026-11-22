"use client";

import clsx from "clsx";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

/**
 * Accessible custom select (WAI-ARIA combobox + listbox, "select-only" pattern).
 * Mouse, touch and keyboard: ↑ ↓ Home End to move, Enter/Space to pick, Esc/Tab to close.
 */
export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  icon,
  align = "end",
  hideLabelBelow = "md",
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: SelectOption<T>[];
  icon?: ReactNode;
  align?: "start" | "end";
  /** Visually hide the text label below this breakpoint (it stays the accessible name). */
  hideLabelBelow?: "sm" | "md" | "never";
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const [active, setActive] = useState(selectedIndex);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const selected = options[selectedIndex];

  const openList = (at = selectedIndex) => {
    setActive(at);
    setOpen(true);
  };
  const close = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) trigger.current?.focus();
  };
  const pick = (i: number) => {
    const opt = options[i];
    if (opt && opt.value !== value) onChange(opt.value);
    close();
  };

  // Focus the list when it opens; close on any pointer down outside.
  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const onTriggerKey = (e: KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openList(e.key === "ArrowUp" ? Math.max(0, selectedIndex - 1) : selectedIndex);
    }
  };

  const onListKey = (e: KeyboardEvent) => {
    const last = options.length - 1;
    const moves: Record<string, () => void> = {
      ArrowDown: () => setActive((a) => Math.min(last, a + 1)),
      ArrowUp: () => setActive((a) => Math.max(0, a - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => pick(active),
      " ": () => pick(active),
      Escape: () => close(),
    };
    if (e.key === "Tab") return close(false);
    const fn = moves[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div ref={root} className="relative flex items-center gap-2">
      <span
        id={labelId}
        className={clsx(
          "text-xs text-slate-500",
          hideLabelBelow === "md" && "hidden md:inline",
          hideLabelBelow === "sm" && "hidden sm:inline",
        )}
      >
        {label}
      </span>

      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-labelledby={`${labelId} ${id}-value`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onTriggerKey}
        className={clsx(
          "group inline-flex h-9 items-center gap-2 rounded-xl border bg-white pl-2.5 pr-2 text-sm font-medium text-slate-800 shadow-sm outline-none transition",
          "hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:border-emerald-500 focus-visible:ring-4 focus-visible:ring-emerald-500/15 active:scale-[0.98]",
          open ? "border-emerald-500 ring-4 ring-emerald-500/15" : "border-slate-200",
        )}
      >
        {icon && <span className="text-emerald-600">{icon}</span>}
        <span id={`${id}-value`} className="whitespace-nowrap">
          {selected?.label}
        </span>
        <ChevronDown
          aria-hidden
          className={clsx("size-4 text-slate-400 transition-transform duration-200", open && "rotate-180 text-emerald-600")}
        />
      </button>

      {open && (
        <ul
          ref={list}
          id={listId}
          role="listbox"
          tabIndex={-1}
          aria-labelledby={labelId}
          aria-activedescendant={`${id}-opt-${active}`}
          onKeyDown={onListKey}
          className={clsx(
            "absolute top-full z-50 mt-2 w-80 max-w-[calc(100vw-1.5rem)] origin-top animate-[pop-in_160ms_ease-out] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10 outline-none",
            align === "end" ? "right-0 origin-top-right" : "left-0 origin-top-left",
          )}
        >
          <li role="presentation" className="px-3 pb-1.5 pt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
            {label}
          </li>
          {options.map((o, i) => {
            const isSelected = o.value === value;
            return (
              <li
                key={o.value}
                id={`${id}-opt-${i}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => pick(i)}
                onPointerMove={() => setActive(i)}
                className={clsx(
                  "flex cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 transition-colors",
                  i === active ? "bg-slate-50" : "",
                  isSelected && "bg-emerald-50/70",
                )}
              >
                <span
                  className={clsx(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border transition",
                    isSelected ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-transparent",
                  )}
                >
                  <Check className="size-3" strokeWidth={3} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className={clsx("block text-sm font-medium", isSelected ? "text-emerald-900" : "text-slate-800")}>
                    {o.label}
                  </span>
                  {o.description && <span className="mt-0.5 block text-xs text-slate-500">{o.description}</span>}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
