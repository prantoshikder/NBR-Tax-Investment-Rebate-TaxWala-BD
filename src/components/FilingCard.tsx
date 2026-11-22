"use client";

import { CalendarClock } from "lucide-react";
import { useTaxModel } from "@/hooks/useTaxModel";
import { useToday } from "@/hooks/useToday";
import { taka } from "@/lib/format";
import { filingOutcome } from "@/lib/tax/filing";

const MONTHS = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
const short = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

export function FilingCard() {
  const { result, rules } = useTaxModel();
  const today = useToday();
  const outcome = today ? filingOutcome(result.netTax, new Date(`${today}T12:00:00`), rules) : null;

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-sky-50 text-sky-700">
          <CalendarClock className="size-4" />
        </span>
        <h2 className="font-semibold text-slate-900">কখন রিটার্ন দিলে কত?</h2>
      </div>

      <ol className="mt-4 space-y-1.5">
        {rules.filingWindows.map((w) => {
          const current = outcome?.window === w;
          const past = today !== null && today > w.to;
          const o = filingOutcome(result.netTax, new Date(`${w.from}T12:00:00`), rules);
          const text =
            w.kind === "incentive"
              ? `${(w.rate * 100).toFixed(0)}% ছাড় (সর্বোচ্চ ${taka(w.amount)})`
              : w.kind === "extra"
                ? `+${(w.rate * 100).toFixed(0)}% বা ${taka(w.amount)}`
                : "কোনো ছাড়/জরিমানা নেই";
          return (
            <li
              key={w.from}
              className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs ${
                current ? "bg-sky-50 ring-1 ring-sky-200" : past ? "opacity-45" : ""
              }`}
            >
              <span className="text-slate-500">
                <span className="num">
                  {short(w.from)} – {short(w.to)}
                </span>
                <span className="block text-[11px] text-slate-400">{text}</span>
              </span>
              <span className="text-right">
                {current && <span className="mb-0.5 block text-[10px] font-semibold text-sky-700">এখন</span>}
                {past && <span className="mb-0.5 block text-[10px] text-slate-500">সময় শেষ</span>}
                <span className={`num font-semibold ${o.adjustment < 0 ? "text-emerald-600" : o.adjustment > 0 ? "text-orange-600" : "text-slate-800"}`}>
                  {taka(o.total)}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
      {outcome?.afterLastWindow && (
        <p className="mt-3 text-xs text-orange-700">
          স্বাভাবিক সময় পেরিয়ে গেছে — স্বপ্রণোদিত বিলম্বিত রিটার্নে ১০% বা ৳৫,০০০ (যেটি বেশি) অতিরিক্ত কর।
        </p>
      )}
      <p className="mt-3 text-[11px] text-slate-400">ছুটির দিনে শেষ তারিখ পড়লে পরের কর্মদিবসে দাখিল করা যায়।</p>
    </section>
  );
}
