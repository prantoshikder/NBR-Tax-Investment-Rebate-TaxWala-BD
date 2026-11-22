"use client";

import { useState } from "react";
import { useTaxModel } from "@/hooks/useTaxModel";
import { lakh, num, pct, taka } from "@/lib/format";
import { Card, CardHeader } from "./ui/primitives";

// Palette validated with the dataviz validator (light surface): teal / orange pass CVD + chroma checks.
const TAKE_HOME = "#0d9488";
const TAX = "#e0892b";

export function BreakdownCard() {
  const { result, income } = useTaxModel();
  const [hover, setHover] = useState<number | null>(null);

  const gross = result.grossSalary + income.otherIncome;
  const takeHome = Math.max(0, gross - result.netTax);
  const taxShare = gross > 0 ? result.netTax / gross : 0;

  const bands = result.slabs;
  const maxTax = Math.max(...result.slabs.map((s) => s.tax), 1);

  return (
    <Card>
      <CardHeader title="হিসাবের বিস্তারিত" subtitle="কোন স্ল্যাবে কত কর আসছে" />

      <div className="px-5 pt-5 sm:px-6">
        <p className="text-sm text-slate-600">
          আপনার প্রতি ১০০ টাকা আয়ের মধ্যে কর যায় <b className="num text-slate-900">৳{(taxShare * 100).toFixed(1)}</b>
        </p>
        <div className="mt-3 flex h-3 gap-[2px] overflow-hidden rounded" role="img" aria-label={`হাতে থাকে ${taka(takeHome)}, কর ${taka(result.netTax)}`}>
          <div className="h-full rounded-l" style={{ width: `${(1 - taxShare) * 100}%`, background: TAKE_HOME }} />
          {result.netTax > 0 && (
            <div className="h-full min-w-1 rounded-r" style={{ width: `${taxShare * 100}%`, background: TAX }} />
          )}
        </div>
        <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-sm" style={{ background: TAKE_HOME }} /> হাতে থাকে{" "}
            <b className="num text-slate-900">{taka(takeHome)}</b>
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2.5 rounded-sm" style={{ background: TAX }} /> কর <b className="num text-slate-900">{taka(result.netTax)}</b>
          </span>
          {result.rebate > 0 && (
            <span className="text-slate-500">
              রেয়াতে বাঁচল <b className="num text-slate-900">{taka(result.rebate)}</b>
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto px-2 pb-4 pt-5 sm:px-3">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500">
              <th className="px-3 py-2 font-medium">আয়ের ধাপ</th>
              <th className="px-3 py-2 font-medium">হার</th>
              <th className="px-3 py-2 text-right font-medium">এই ধাপে আয়</th>
              <th className="w-[34%] px-3 py-2 font-medium">কর</th>
            </tr>
          </thead>
          <tbody>
            {bands.map((s, i) => {
              const active = s.amountInBand > 0;
              const label =
                i === 0
                  ? `প্রথম ${lakh(s.to)}`
                  : Number.isFinite(s.to)
                    ? `পরবর্তী ${lakh(s.to - s.from)}`
                    : "অবশিষ্ট আয়";
              return (
                <tr
                  key={i}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  className={`border-t border-slate-100 transition ${hover === i ? "bg-slate-50" : ""} ${active ? "" : "text-slate-400"}`}
                >
                  <td className="px-3 py-2.5">{label}</td>
                  <td className="num px-3 py-2.5">{s.rate === 0 ? "০%" : pct(s.rate, 0)}</td>
                  <td className="num px-3 py-2.5 text-right">{num(s.amountInBand)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-r bg-slate-100">
                        <div
                          className="h-full rounded-r transition-[width] duration-500"
                          style={{ width: `${(s.tax / maxTax) * 100}%`, background: TAX }}
                        />
                      </div>
                      <span className={`num w-20 text-right ${active ? "font-medium text-slate-900" : ""}`}>{num(s.tax)}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="border-t-2 border-slate-200 font-semibold text-slate-900">
              <td className="px-3 py-2.5" colSpan={2}>
                মোট
              </td>
              <td className="num px-3 py-2.5 text-right">{num(result.totalIncome)}</td>
              <td className="num px-3 py-2.5 text-right">{taka(result.grossTax)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
