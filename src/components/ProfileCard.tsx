"use client";

import { Minus, Plus } from "lucide-react";
import { useTaxModel } from "@/hooks/useTaxModel";
import { taka } from "@/lib/format";
import type { EmployerType, TaxpayerCategory } from "@/lib/tax/types";
import { useTaxStore } from "@/store/useTaxStore";
import { Card, CardHeader, Hint, Segmented, Switch } from "./ui/primitives";

const CATEGORIES: { value: TaxpayerCategory; label: string }[] = [
  { value: "general", label: "সাধারণ" },
  { value: "female_or_senior", label: "নারী / ৬৫+ বছর" },
  { value: "disabled_or_third_gender", label: "প্রতিবন্ধী / তৃতীয় লিঙ্গ" },
  { value: "freedom_fighter_or_july_joddha", label: "যুদ্ধাহত মুক্তিযোদ্ধা / জুলাই যোদ্ধা" },
];

export function ProfileCard() {
  const { income, result, rules } = useTaxModel();
  const setIncome = useTaxStore((s) => s.setIncome);

  return (
    <Card>
      <CardHeader step="১" title="করদাতার পরিচয়" subtitle="করমুক্ত আয়ের সীমা এর ওপর নির্ভর করে" />
      <div className="space-y-5 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {CATEGORIES.map((c) => {
            const active = income.category === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => setIncome({ category: c.value })}
                aria-pressed={active}
                className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? "border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-4 ring-emerald-500/10"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="block font-medium leading-snug">{c.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            নিয়োগকর্তা
            <Hint>
              সরকারি বেতন স্কেলভুক্ত কর্মচারীরা (সরকারি ব্যাংকসহ) বেতনের ১/৩ অংশের সাধারণ ছাড় পান না; তাঁদের বাড়িভাড়া,
              চিকিৎসা ও যাতায়াতসহ বেতন আদেশে উল্লিখিত ভাতাগুলো করমুক্ত।
            </Hint>
          </div>
          <Segmented<EmployerType>
            value={income.employerType}
            onChange={(employerType) => setIncome({ employerType })}
            options={[
              { value: "private", label: "বেসরকারি" },
              { value: "govt_pay_scale", label: "সরকারি বেতন স্কেল" },
            ]}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Switch
            checked={income.isNewTaxpayer}
            onChange={(isNewTaxpayer) => setIncome({ isNewTaxpayer })}
            label="প্রথমবার রিটার্ন দিচ্ছি"
            description={`ন্যূনতম কর ${taka(rules.minimumTax.regular)}-এর বদলে ${taka(rules.minimumTax.newTaxpayer)}`}
          />
          <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <span>
              <span className="block text-sm font-medium text-slate-800">প্রতিবন্ধী সন্তান/পোষ্য</span>
              <span className="block text-xs text-slate-500">প্রতিজনে করমুক্ত সীমা +{taka(rules.disabledDependantBonus)}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="কমান"
                onClick={() => setIncome({ disabledDependants: Math.max(0, income.disabledDependants - 1) })}
                className="grid size-7 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <Minus className="size-3.5" />
              </button>
              <span className="num w-4 text-center font-semibold">{income.disabledDependants}</span>
              <button
                type="button"
                aria-label="বাড়ান"
                onClick={() => setIncome({ disabledDependants: Math.min(10, income.disabledDependants + 1) })}
                className="grid size-7 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        <p className="rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
          আপনার করমুক্ত আয়ের সীমা: <b className="num text-slate-900">{taka(result.threshold)}</b>
        </p>
      </div>
    </Card>
  );
}
