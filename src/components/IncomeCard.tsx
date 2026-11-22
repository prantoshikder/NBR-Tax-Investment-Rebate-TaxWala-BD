"use client";

import { useTaxModel } from "@/hooks/useTaxModel";
import { lakh, taka } from "@/lib/format";
import type { IncomeInput } from "@/lib/tax/types";
import { useTaxStore } from "@/store/useTaxStore";
import { AmountField, Card, CardHeader, Segmented } from "./ui/primitives";

type RecurringKey = "basicSalary" | "houseRent" | "medical" | "conveyance" | "employerPF" | "otherSalary";

export function IncomeCard() {
  const { income, result, rules } = useTaxModel();
  const setIncome = useTaxStore((s) => s.setIncome);
  const monthly = useTaxStore((s) => s.monthlyEntry);
  const setMonthly = useTaxStore((s) => s.setMonthlyEntry);
  const isGovt = income.employerType === "govt_pay_scale";

  const factor = monthly ? 12 : 1;
  const unit = monthly ? "/ মাস" : "/ বছর";
  const recurring = (key: RecurringKey) => ({
    value: Math.round(income[key] / factor),
    onChange: (v: number) => setIncome({ [key]: v * factor } as Partial<IncomeInput>),
    suffix: unit,
  });

  const exemptNote = isGovt
    ? "সরকারি বেতন আদেশভুক্ত ভাতা — করমুক্ত"
    : undefined;

  return (
    <Card>
      <CardHeader
        step="২"
        title="বেতন ও আয়"
        subtitle="স্যালারি স্লিপ দেখে লিখুন"
        action={
          <Segmented
            size="sm"
            value={monthly ? "m" : "y"}
            onChange={(v) => setMonthly(v === "m")}
            options={[
              { value: "m", label: "মাসিক" },
              { value: "y", label: "বার্ষিক" },
            ]}
          />
        }
      />
      <div className="grid gap-4 px-5 pb-5 pt-4 sm:grid-cols-2 sm:px-6 sm:pb-6">
        <AmountField label="মূল বেতন (Basic)" {...recurring("basicSalary")} />
        <AmountField label="বাড়িভাড়া ভাতা" {...recurring("houseRent")} note={exemptNote} />
        <AmountField label="চিকিৎসা ভাতা" {...recurring("medical")} note={exemptNote} />
        <AmountField
          label={isGovt ? "যাতায়াত ও অন্যান্য করমুক্ত ভাতা" : "যাতায়াত ভাতা"}
          {...recurring("conveyance")}
          note={exemptNote}
          hint={isGovt ? "বাংলা নববর্ষ ভাতাসহ বেতন আদেশে উল্লিখিত অন্যান্য ভাতা এখানে যোগ করুন।" : undefined}
        />
        <AmountField
          label="উৎসব বোনাস"
          value={income.festivalBonus}
          onChange={(festivalBonus) => setIncome({ festivalBonus })}
          suffix="/ বছর"
          hint="বছরে পাওয়া সব উৎসব বোনাসের যোগফল। উৎসব বোনাস করযোগ্য।"
        />
        <AmountField
          label="প্রভিডেন্ট ফান্ডে নিয়োগকর্তার অংশ"
          {...recurring("employerPF")}
          hint="স্বীকৃত PF-এ নিয়োগকর্তার চাঁদা আপনার বেতনের অংশ, আবার রিবেটযোগ্য বিনিয়োগও।"
        />
        <AmountField
          label={isGovt ? "অন্যান্য করযোগ্য ভাতা / ইনসেনটিভ বোনাস" : "অন্যান্য ভাতা (মোবাইল, গাড়ি, ইনসেনটিভ…)"}
          {...recurring("otherSalary")}
          hint={
            isGovt
              ? undefined
              : "অফিসের গাড়ি থাকলে: ১৫০০cc পর্যন্ত মাসে ৳১৫,০০০, ২০০০cc পর্যন্ত ৳২০,০০০, ২৫০০cc পর্যন্ত ৳৩০,০০০, এর বেশি ৳৫০,০০০ যোগ করুন।"
          }
        />
        <AmountField
          label="বেতনের বাইরে অন্য আয়"
          value={income.otherIncome}
          onChange={(otherIncome) => setIncome({ otherIncome })}
          suffix="/ বছর"
          hint="বাড়িভাড়া, ব্যাংক সুদ, টিউশন ইত্যাদি। সঞ্চয়পত্রের মুনাফার মতো চূড়ান্ত করদায়ের আয় এখানে দেবেন না।"
        />
      </div>

      <dl className="grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 text-center">
        <div className="px-2 py-3">
          <dt className="text-xs text-slate-500">মোট বেতন</dt>
          <dd className="num mt-0.5 font-semibold text-slate-900">{taka(result.grossSalary)}</dd>
        </div>
        <div className="px-2 py-3">
          <dt className="text-xs text-slate-500">{isGovt ? "করমুক্ত ভাতা" : `ছাড় (১/৩, সর্বোচ্চ ${lakh(rules.salaryExemption.cap)})`}</dt>
          <dd className="num mt-0.5 font-semibold text-emerald-600">− {taka(result.salaryExemption)}</dd>
        </div>
        <div className="px-2 py-3">
          <dt className="text-xs text-slate-500">মোট করযোগ্য আয়</dt>
          <dd className="num mt-0.5 font-semibold text-slate-900">{taka(result.totalIncome)}</dd>
        </div>
      </dl>
    </Card>
  );
}
