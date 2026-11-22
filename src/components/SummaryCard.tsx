"use client";

import { ShieldCheck } from "lucide-react";
import { useTaxModel } from "@/hooks/useTaxModel";
import { pct, taka } from "@/lib/format";
import { AnimatedNumber } from "./ui/AnimatedNumber";

function Row({ label, value, minus, tone }: { label: string; value: number; minus?: boolean; tone?: "good" }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-400">{label}</span>
      <AnimatedNumber
        value={value}
        format={(n) => `${minus ? "− " : ""}${taka(n)}`}
        className={`num ${tone === "good" ? "text-emerald-400" : "text-slate-100"}`}
      />
    </div>
  );
}

export function SummaryCard() {
  const { result, rules, income } = useTaxModel();

  return (
    <section
      id="summary"
      className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/10"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-emerald-500/20 blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-400">নিট প্রদেয় কর</p>
          <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-300 ring-1 ring-white/10">
            {rules.shortLabel}
          </span>
        </div>
        <p className="num mt-1 text-4xl font-bold tracking-tight text-amber-300 sm:text-[44px]" aria-live="polite">
          <AnimatedNumber value={result.netTax} format={taka} />
        </p>
        <p className="mt-1 text-sm text-slate-400">
          মাসে প্রায় <AnimatedNumber value={Math.round(result.netTax / 12)} format={taka} className="num text-slate-200" /> · কার্যকর হার{" "}
          <span className="num text-slate-200">{pct(result.effectiveRate)}</span>
        </p>

        <div className="my-5 h-px bg-white/10" />

        <div className="space-y-2.5">
          <Row label="মোট বেতন ও আয়" value={result.grossSalary + income.otherIncome} />
          <Row label="করমুক্ত অংশ" value={result.salaryExemption} minus />
          <Row label="মোট করযোগ্য আয়" value={result.totalIncome} />
          <Row label="স্ল্যাব অনুযায়ী কর" value={result.grossTax} />
          <Row label="বিনিয়োগ রেয়াত" value={result.rebate} minus tone="good" />
        </div>

        {result.minimumTaxApplied && (
          <p className="mt-4 animate-[fade-in_250ms_ease-out] rounded-lg bg-amber-400/10 px-3 py-2 text-xs leading-relaxed text-amber-200 ring-1 ring-amber-400/20">
            আয় করমুক্ত সীমার বেশি হওয়ায় ন্যূনতম কর {taka(result.minimumTax)} দিতে হবে — হিসাবকৃত কর এর চেয়ে কম।
          </p>
        )}
        {result.netTax === 0 && (
          <p className="mt-4 animate-[fade-in_250ms_ease-out] rounded-lg bg-emerald-400/10 px-3 py-2 text-xs leading-relaxed text-emerald-200 ring-1 ring-emerald-400/20">
            আপনার আয় করমুক্ত সীমার মধ্যে, কোনো কর দিতে হবে না। তবে নির্দিষ্ট ক্ষেত্রে রিটার্ন দাখিল বাধ্যতামূলক হতে পারে।
          </p>
        )}

        <p className="mt-5 flex items-center gap-1.5 text-[11px] text-slate-500">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          {rules.basis} অনুযায়ী
        </p>
      </div>
    </section>
  );
}
