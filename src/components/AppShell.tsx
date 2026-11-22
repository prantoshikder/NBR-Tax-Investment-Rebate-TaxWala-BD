"use client";

import { Calculator, Printer, RotateCcw } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useTaxModel } from "@/hooks/useTaxModel";
import { taka } from "@/lib/format";
import { RULE_SETS } from "@/lib/tax/rules";
import { useToast } from "./ui/Toast";
import { restoreSnapshot, takeSnapshot, useTaxStore } from "@/store/useTaxStore";

/** Loads saved inputs from localStorage after mount (store uses skipHydration). */
export function StoreHydrator() {
  useEffect(() => {
    void useTaxStore.persist.rehydrate();
  }, []);
  return null;
}

export function AppHeader() {
  const reset = useTaxStore((s) => s.reset);
  const toast = useToast();
  const setRulesId = useTaxStore((s) => s.setRulesId);
  const { rules } = useTaxModel();
  const years = Object.values(RULE_SETS);
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-md print:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-600/30">
            <Calculator className="size-[18px]" />
          </span>
          <div className="leading-tight">
            <p className="font-semibold text-slate-900">করহিসাব</p>
            <p className="text-[11px] text-slate-500">আয়কর ও বিনিয়োগ রেয়াত ক্যালকুলেটর</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {years.length > 1 ? (
            <label className="flex items-center gap-2 text-xs text-slate-500">
              <span className="hidden md:inline">হিসাবের বছর</span>
              <select
                value={rules.id}
                onChange={(e) => setRulesId(e.target.value)}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800 outline-none focus:ring-4 focus:ring-emerald-500/15"
              >
                {years.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 md:inline">
              {rules.label}
            </span>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Printer className="size-4" /> <span className="hidden sm:inline">PDF / প্রিন্ট</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const before = takeSnapshot();
              reset();
              toast.show({
                message: "সব ইনপুট রিসেট হয়েছে",
                tone: "info",
                durationMs: 5000,
                action: {
                  label: "ফিরিয়ে আনুন",
                  onClick: () => restoreSnapshot(before),
                },
              });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <RotateCcw className="size-4" /> <span className="hidden sm:inline">রিসেট</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/** Mobile: net tax always visible at the bottom; tap to jump to the summary. */
export function MobileTaxBar() {
  const { result, advice } = useTaxModel();
  return (
    <a
      href="#summary"
      className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-between rounded-2xl bg-slate-900/95 px-4 py-3 text-white shadow-2xl backdrop-blur lg:hidden print:hidden"
    >
      <span className="text-xs text-slate-400">নিট কর</span>
      <span className="num text-lg font-bold text-amber-300">{taka(result.netTax)}</span>
      {advice.status === "ACTION_NEEDED" ? (
        <span className="num rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] text-emerald-300">
          −{taka(advice.totalSaving)} সম্ভব
        </span>
      ) : (
        <span className="text-[11px] text-slate-400">বিস্তারিত ↑</span>
      )}
    </a>
  );
}

export function Footer() {
  const { rules } = useTaxModel();
  return (
    <footer className="mx-auto max-w-7xl px-4 pb-28 pt-4 text-xs leading-relaxed text-slate-500 sm:px-6 lg:pb-10 print:hidden">
      <div className="rounded-2xl border border-slate-200 bg-white/60 p-5">
        <p className="font-medium text-slate-700">তথ্যসূত্র ও সতর্কতা</p>
        <p className="mt-1.5">
          হিসাব জাতীয় রাজস্ব বোর্ডের প্রকাশনা অনুযায়ী ({rules.label}), সর্বশেষ যাচাই {rules.verifiedOn}। NBR-এর নিজস্ব
          উদাহরণগুলো দিয়ে স্বয়ংক্রিয় পরীক্ষা করা হয়। তবে এটি আইনি বা আর্থিক পরামর্শ নয় — রিটার্ন দাখিলের আগে প্রয়োজনে
          কর আইনজীবীর পরামর্শ নিন। চূড়ান্ত করদায়ের আয়, মূলধনী মুনাফা, ব্যবসায়িক আয় ও সম্পদের সারচার্জ এই হিসাবে নেই।
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {rules.sources.map((s) => (
            <li key={s.url}>
              <a className="text-emerald-700 underline-offset-2 hover:underline" href={s.url} target="_blank" rel="noreferrer">
                {s.title} ↗
              </a>
            </li>
          ))}
          <li>
            <a className="text-emerald-700 underline-offset-2 hover:underline" href="https://etaxnbr.gov.bd" target="_blank" rel="noreferrer">
              অনলাইনে রিটার্ন: etaxnbr.gov.bd ↗
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}

export function Container({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>;
}
