"use client";

import { ArrowRight, CheckCircle2, Landmark, PiggyBank, Sparkles, TrendingUp } from "lucide-react";
import { useTaxModel } from "@/hooks/useTaxModel";
import { taka } from "@/lib/format";
import type { Sector } from "@/lib/tax/advisor";
import { useTaxStore } from "@/store/useTaxStore";

const SECTOR: Record<Sector, { label: string; icon: typeof PiggyBank; why: (add: number) => string }> = {
  dps: {
    label: "ব্যাংক ডিপিএস",
    icon: PiggyBank,
    why: (add) => `মাসে ${taka(Math.ceil(add / 12))} করে — ঝুঁকিহীন, নিয়মিত সঞ্চয়`,
  },
  govtSecurities: {
    label: "সঞ্চয়পত্র",
    icon: Landmark,
    why: () => "সরকারি নিশ্চয়তা; মেয়াদ পূর্ণ হওয়া পর্যন্ত রাখতে হবে",
  },
  listedSecurities: {
    label: "শেয়ার / মিউচুয়াল ফান্ড",
    icon: TrendingUp,
    why: () => "সীমাহীন খাত, তবে বাজার ঝুঁকি আছে — মিউচুয়াল ফান্ড তুলনামূলক নিরাপদ",
  },
};

export function AdviceCard() {
  const { advice, investments } = useTaxModel();
  const setInvestments = useTaxStore((s) => s.setInvestments);

  if (advice.status !== "ACTION_NEEDED") {
    const msg = {
      NO_TAX: "আপনার কোনো কর আসছে না, তাই কর বাঁচাতে বিনিয়োগের প্রয়োজন নেই।",
      MINIMUM_TAX: "আপনি ন্যূনতম করের স্তরে আছেন — আরও বিনিয়োগ করলে কর আর কমবে না।",
      OPTIMIZED: "দারুণ! আপনি সম্ভাব্য সর্বোচ্চ রেয়াত পাচ্ছেন। এর বেশি বিনিয়োগে কর আর কমবে না।",
    }[advice.status];
    return (
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
        <div className="flex gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <p className="text-sm leading-relaxed text-emerald-900">{msg}</p>
        </div>
      </section>
    );
  }

  const applyAll = () => {
    const patch: Partial<Record<Sector, number>> = {};
    for (const s of advice.suggestions) patch[s.sector] = investments[s.sector] + s.additional;
    setInvestments(patch);
  };

  return (
    <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
            <Sparkles className="size-4" />
          </span>
          <h2 className="font-semibold text-slate-900">স্মার্ট বিনিয়োগ প্ল্যান</h2>
        </div>
        <span className="num rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white">
          আরও {taka(advice.totalSaving)} বাঁচান
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600">
        আরও <b className="num text-slate-900">{taka(advice.gap)}</b> বিনিয়োগ করলে আপনার কর কমবে{" "}
        <b className="num text-emerald-700">{taka(advice.totalSaving)}</b>।
      </p>

      <ol className="mt-4 space-y-2.5">
        {advice.suggestions.map((s) => {
          const meta = SECTOR[s.sector];
          const Icon = meta.icon;
          return (
            <li key={s.sector} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <Icon className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-slate-900">{meta.label}</span>
                  <span className="num text-sm font-semibold text-emerald-700">+ {taka(s.additional)}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{meta.why(s.additional)}</p>
                <p className="num mt-1 text-xs font-medium text-amber-700">কর কমবে {taka(s.taxSaved)}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <button
        type="button"
        onClick={applyAll}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        প্ল্যানটি সিমুলেটরে বসিয়ে দেখুন <ArrowRight className="size-4" />
      </button>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
        এটি শুধু কর-সাশ্রয়ের হিসাব, বিনিয়োগ পরামর্শ নয়। নিজের ঝুঁকি ও প্রয়োজন বুঝে সিদ্ধান্ত নিন।
      </p>
    </section>
  );
}
