"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTaxModel } from "@/hooks/useTaxModel";
import { lakh, num, taka } from "@/lib/format";
import type { InvestmentInput } from "@/lib/tax/types";
import { useTaxStore } from "@/store/useTaxStore";
import { AnimatedNumber } from "./ui/AnimatedNumber";
import { Collapse } from "./ui/Collapse";
import { AmountField, Card, CardHeader, RangeSlider } from "./ui/primitives";

type Key = keyof InvestmentInput;

export function InvestmentCard() {
  const { investments, income, rules, result } = useTaxModel();
  const setInvestments = useTaxStore((s) => s.setInvestments);
  const [more, setMore] = useState(false);
  const { limits } = rules.rebate;

  const sliders: { key: Key; label: string; max: number; step: number; cap?: number; note: string }[] = [
    {
      key: "dps",
      label: "ব্যাংক ডিপিএস",
      max: 240_000,
      step: 6_000,
      cap: limits.dps,
      note: `বছরে সর্বোচ্চ ${taka(limits.dps)} রিবেটযোগ্য`,
    },
    {
      key: "govtSecurities",
      label: "সঞ্চয়পত্র / সরকারি সিকিউরিটিজ",
      max: 1_000_000,
      step: 10_000,
      cap: limits.govtSecurities,
      note: `সর্বোচ্চ ${taka(limits.govtSecurities)} রিবেটযোগ্য · মেয়াদের আগে ভাঙালে রিবেট ফেরত দিতে হয়`,
    },
    {
      key: "listedSecurities",
      label: "শেয়ার / মিউচুয়াল ফান্ড (নতুন বিনিয়োগ)",
      max: 2_000_000,
      step: 10_000,
      note: "তালিকাভুক্ত শেয়ার, মিউচুয়াল ফান্ড, ইটিএফ — কোনো আলাদা সীমা নেই",
    },
  ];

  const extras: { key: Key; label: string; hint?: string }[] = [
    { key: "employeePF", label: "প্রভিডেন্ট ফান্ডে নিজের চাঁদা", hint: "স্বীকৃত PF বা সরকারি GPF-এ বছরে আপনার নিজের জমা।" },
    { key: "lifeInsurance", label: "জীবন বীমার প্রিমিয়াম" },
    { key: "universalPension", label: "সর্বজনীন পেনশন স্কিম" },
    {
      key: "others",
      label: "অন্যান্য (দান, যাকাত ফান্ড, কল্যাণ তহবিল…)",
      hint: "NBR অনুমোদিত প্রতিষ্ঠানে দান, যাকাত ফান্ড, কল্যাণ ও গোষ্ঠী বীমা তহবিলে চাঁদা ইত্যাদি।",
    },
  ];

  const used = result.rebate;
  const limit = Math.max(result.rebateIncomeLimit, 1);
  const fill = Math.min(100, (used / limit) * 100);
  const needForFull = Math.ceil(result.rebateIncomeLimit / rules.rebate.investmentRate);

  return (
    <Card id="investments">
      <CardHeader
        step="৩"
        title="বিনিয়োগ ও কর রেয়াত"
        subtitle={`রেয়াত = আয়ের ${rules.rebate.incomeRate * 100}%, বিনিয়োগের ${rules.rebate.investmentRate * 100}% বা ৳${lakh(rules.rebate.cap)} — যেটি কম`}
      />

      <div className="mx-5 mt-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50/60 p-4 ring-1 ring-emerald-100 sm:mx-6">
        <div className="flex items-end justify-between gap-2 text-sm">
          <span className="text-emerald-900">রেয়াত কোটা ব্যবহার হয়েছে</span>
          <span className="num font-semibold text-emerald-900">
            <AnimatedNumber value={used} format={taka} />{" "}
            <span className="font-normal text-emerald-700/70">
              / <AnimatedNumber value={result.rebateIncomeLimit} format={taka} />
            </span>
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-emerald-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-[width] duration-500 ease-out"
            style={{ width: `${fill}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-emerald-800/80">
          অনুমোদিত বিনিয়োগ <b className="num">{taka(result.eligibleInvestment)}</b>
          {income.employerPF > 0 && <> (নিয়োগকর্তার PF {taka(income.employerPF)} সহ)</>} · পূর্ণ রেয়াতের জন্য দরকার{" "}
          <b className="num">{taka(needForFull)}</b>
        </p>
      </div>

      <div className="space-y-5 px-5 pb-2 pt-5 sm:px-6">
        {sliders.map((s) => {
          const v = investments[s.key];
          const over = s.cap !== undefined && v > s.cap;
          return (
            <div key={s.key}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-slate-800">{s.label}</span>
                <AnimatedNumber value={v} format={taka} className="num text-[15px] font-semibold text-emerald-600" />
              </div>
              <RangeSlider
                label={s.label}
                value={v}
                max={Math.max(s.max, v)}
                step={s.step}
                marker={s.cap}
                onChange={(val) => setInvestments({ [s.key]: val })}
              />
              <p className={`text-xs ${over ? "text-amber-600" : "text-slate-400"}`}>
                {over ? `সীমার বেশি ${taka(v - (s.cap ?? 0))} রেয়াতে গণ্য হবে না` : s.note}
              </p>
            </div>
          );
        })}
      </div>

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <button
          type="button"
          onClick={() => setMore((m) => !m)}
          className="mt-3 flex w-full items-center justify-between rounded-xl border border-dashed active:scale-[0.99] border-slate-300 px-4 py-2.5 text-sm text-slate-600 transition hover:border-slate-400 hover:text-slate-800"
          aria-expanded={more}
        >
          <span>
            আরও খাত: PF, বীমা, পেনশন, দান
            {extras.some((e) => investments[e.key] > 0) && (
              <span className="num ml-2 text-emerald-600">
                ({taka(extras.reduce((s, e) => s + investments[e.key], 0))})
              </span>
            )}
          </span>
          <ChevronDown className={`size-4 transition-transform duration-300 ${more ? "rotate-180" : ""}`} />
        </button>
        <Collapse open={more}>
          <div className="grid gap-4 pt-4 sm:grid-cols-2">
            {extras.map((e) => (
              <AmountField
                key={e.key}
                label={e.label}
                hint={e.hint}
                suffix="/ বছর"
                value={investments[e.key]}
                onChange={(val) => setInvestments({ [e.key]: val })}
              />
            ))}
          </div>
        </Collapse>
        <p className="mt-4 text-xs text-slate-400">
          মোট বিনিয়োগ {num(result.totalInvestment)} · শুধু আয়বর্ষের মধ্যে (১ জুলাই – ৩০ জুন) করা বিনিয়োগ গণ্য হয়।
        </p>
      </div>
    </Card>
  );
}
