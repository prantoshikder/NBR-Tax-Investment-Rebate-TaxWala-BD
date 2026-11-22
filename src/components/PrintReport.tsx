"use client";

import { useTaxModel } from "@/hooks/useTaxModel";
import { useToday } from "@/hooks/useToday";
import { lakh, num, pct, taka } from "@/lib/format";

const SECTOR_LABEL = { dps: "ব্যাংক ডিপিএস", govtSecurities: "সঞ্চয়পত্র", listedSecurities: "শেয়ার / মিউচুয়াল ফান্ড" };

/**
 * A4 summary that only appears when printing (Print → "Save as PDF").
 * Browser printing shapes Bangla text correctly, unlike most client-side PDF libraries.
 */
export function PrintReport() {
  const { income, investments, result, advice, rules } = useTaxModel();
  const date = useToday() ?? "";

  const rows: [string, number][] = [
    ["মূল বেতন", income.basicSalary],
    ["বাড়িভাড়া ভাতা", income.houseRent],
    ["চিকিৎসা ভাতা", income.medical],
    ["যাতায়াত ভাতা", income.conveyance],
    ["উৎসব বোনাস", income.festivalBonus],
    ["PF-এ নিয়োগকর্তার অংশ", income.employerPF],
    ["অন্যান্য ভাতা", income.otherSalary],
    ["বেতনের বাইরে আয়", income.otherIncome],
  ];
  const inv: [string, number][] = [
    ["ডিপিএস", investments.dps],
    ["সঞ্চয়পত্র / সরকারি সিকিউরিটিজ", investments.govtSecurities],
    ["শেয়ার / মিউচুয়াল ফান্ড", investments.listedSecurities],
    ["PF-এ নিজের চাঁদা", investments.employeePF],
    ["PF-এ নিয়োগকর্তার চাঁদা", income.employerPF],
    ["জীবন বীমা", investments.lifeInsurance],
    ["সর্বজনীন পেনশন", investments.universalPension],
    ["অন্যান্য", investments.others],
  ];

  return (
    <div className="hidden text-[12px] text-black print:block">
      <div className="flex items-end justify-between border-b-2 border-black pb-2">
        <div>
          <h1 className="text-xl font-bold">আয়কর ও বিনিয়োগ রেয়াত হিসাব</h1>
          <p>{rules.label}</p>
        </div>
        <p className="num">তারিখ: {date}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-6">
        <table className="w-full">
          <caption className="mb-1 text-left font-semibold">বার্ষিক আয়</caption>
          <tbody>
            {rows.filter(([, v]) => v > 0).map(([k, v]) => (
              <tr key={k} className="border-b border-gray-200">
                <td className="py-1">{k}</td>
                <td className="num py-1 text-right">{num(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="w-full">
          <caption className="mb-1 text-left font-semibold">বিনিয়োগ</caption>
          <tbody>
            {inv.filter(([, v]) => v > 0).map(([k, v]) => (
              <tr key={k} className="border-b border-gray-200">
                <td className="py-1">{k}</td>
                <td className="num py-1 text-right">{num(v)}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="py-1">অনুমোদিত বিনিয়োগ</td>
              <td className="num py-1 text-right">{num(result.eligibleInvestment)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className="mt-5 w-full">
        <caption className="mb-1 text-left font-semibold">কর নির্ণয়</caption>
        <tbody>
          {(
            [
              ["মোট বেতন", taka(result.grossSalary)],
              ["করমুক্ত অংশ", `− ${taka(result.salaryExemption)}`],
              ["মোট করযোগ্য আয়", taka(result.totalIncome)],
              ["করমুক্ত সীমা", taka(result.threshold)],
              ["স্ল্যাব অনুযায়ী কর", taka(result.grossTax)],
              [`বিনিয়োগ রেয়াত (${rules.rebate.incomeRate * 100}% আয় / ${rules.rebate.investmentRate * 100}% বিনিয়োগ / ${lakh(rules.rebate.cap)} — যেটি কম)`, `− ${taka(result.rebate)}`],
              ...(result.minimumTaxApplied ? [["ন্যূনতম কর প্রযোজ্য", taka(result.minimumTax)]] : []),
            ] as [string, string][]
          ).map(([k, v]) => (
            <tr key={k} className="border-b border-gray-200">
              <td className="py-1">{k}</td>
              <td className="num py-1 text-right">{v}</td>
            </tr>
          ))}
          <tr className="text-base font-bold">
            <td className="py-2">নিট প্রদেয় কর</td>
            <td className="num py-2 text-right">{taka(result.netTax)}</td>
          </tr>
          <tr>
            <td className="py-1 text-gray-600">কার্যকর করহার</td>
            <td className="num py-1 text-right text-gray-600">{pct(result.effectiveRate)}</td>
          </tr>
        </tbody>
      </table>

      {advice.status === "ACTION_NEEDED" && (
        <div className="mt-5 border border-gray-300 p-3">
          <p className="font-semibold">
            আরও {taka(advice.gap)} বিনিয়োগে কর কমবে {taka(advice.totalSaving)}
          </p>
          <ul className="mt-1 list-disc pl-5">
            {advice.suggestions.map((s) => (
              <li key={s.sector}>
                {SECTOR_LABEL[s.sector]}: +{taka(s.additional)} (কর কমবে {taka(s.taxSaved)})
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 text-[10px] text-gray-600">
        সূত্র: {rules.sources.map((s) => s.title).join(", ")}। এটি একটি আনুমানিক হিসাব, আইনি পরামর্শ নয়।
      </p>
    </div>
  );
}
