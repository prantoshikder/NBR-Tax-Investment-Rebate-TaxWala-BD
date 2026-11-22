# NBR Tax & Investment Rebate Simulator (Bangladesh) - A to Z Project Blueprint

বাংলাদেশের সাধারণ চাকরিজীবীদের জন্য একটি আধুনিক, ইন্টার‍্যাক্টিভ **Income Tax & Investment Rebate Simulator** তৈরি করার পূর্ণাঙ্গ ডকুমেন্টেশন। এটি কেবল ট্যাক্স হিসাব করবে না, বরং কোথায় কত টাকা ইনভেস্ট (সঞ্চয়পত্র, ডিপিএস, শেয়ার বাজার, প্রভিডেন্ট ফান্ড) করলে সর্বোচ্চ ট্যাক্স রিবেট পাওয়া যাবে, তার পার্সোনালাইজড প্ল্যান তৈরি করে দেবে।

---

## ১. প্রজেক্ট ওভারভিউ ও কোর ফিচারসমূহ
* **রিয়েল-টাইম ট্যাক্স ক্যালকুলেশন:** স্যালারি ও বোনাস ইনপুট দেওয়ার সাথে সাথে কোনো পেজ রিলোড ছাড়াই স্ল্যাব অনুযায়ী ট্যাক্স হিসাব।
* **ইনভেস্টমেন্ট রিবেট সিমুলেটর:** স্লাইডার (Slider) টেনে ডিপিএস, সঞ্চয়পত্র বা শেয়ার বাজারে বিনিয়োগ বাড়ালে বা কমালে ট্যাক্স কত কমছে তা লাইভ দেখা।
* **স্মার্ট ইনভেস্টমেন্ট অ্যাডভাইজার:** ইউজারের রিবেট কোটা কতটুকু ফাঁকা আছে তা বের করে কোন খাতে কত টাকা বিনিয়োগ করা উচিত তার অটোমেটিক সাজেশন।
* **ডেটা ভিজ্যুয়ালাইজেশন:** মোট আয়, করমুক্ত আয়, ট্যাক্স এবং রিবেটের অনুপাত পাই চার্ট (Pie Chart) ও বার চার্টে প্রদর্শন।
* **PDF রিপোর্ট এক্সপোর্ট:** ক্যালকুলেশন শেষে এক ক্লিকে সুন্দর ফরম্যাট করা ট্যাক্স ও ইনভেস্টমেন্ট প্ল্যান সামারি ডাউনলোড।
* **অটো-সেভ (LocalStorage):** লগইন ছাড়াই ইউজারের ইনপুট ব্রাউজারে সেভ থাকবে।

---

## ২. টেক-স্ট্যাক (Tech Stack)
* **ফ্রেমওয়ার্ক:** Next.js 14+ (App Router) + TypeScript (নির্ভুল ক্যালকুলেশন ও Google SEO-র জন্য সেরা)।
* **স্টাইলিং ও UI:** Tailwind CSS + Shadcn UI + Lucide Icons।
* **স্টেট ম্যানেজমেন্ট:** Zustand (রিয়েল-টাইম স্লাইডার ও ইনপুট সিঙ্কিংয়ের জন্য)।
* **চার্ট লাইব্রেরি:** Recharts (ট্যাক্স ও ইনভেস্টমেন্ট ব্রেকডাউন দেখানোর জন্য)।
* **পিডিএফ জেনারেটর:** `@react-pdf/renderer` (ব্রাউজারেই ক্লায়েন্ট-সাইড পিডিএফ তৈরির জন্য)।
* **হোস্টিং:** Vercel (ফ্রি ও সুপার ফাস্ট ডিপ্লয়মেন্ট)।

---

## ৩. প্রজেক্ট সেটআপ ও ফোল্ডার স্ট্রাকচার

### টার্মিনালে প্রজেক্ট ইনিশিয়ালাইজেশন কমান্ড:
```bash
npx create-next-app@latest nbr-tax-simulator --typescript --tailwind --eslint
cd nbr-tax-simulator
npm install lucide-react recharts zustand @react-pdf/renderer
npx shadcn@latest init
npx shadcn@latest add slider card input label button tabs badge
```

### ফোল্ডার স্ট্রাকচার:
```text
nbr-tax-simulator/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # SEO মেটাডাটা ও ফন্ট কনফিগারেশন
│   │   ├── page.tsx                 # মেইন সিমুলেটর ড্যাশবোর্ড পেজ
│   │   └── globals.css              # গ্লোবাল স্টাইল
│   ├── components/
│   │   ├── IncomeInputForm.tsx      # মাসিক/বার্ষিক বেতন ও ভাতার ইনপুট ফর্ম
│   │   ├── InvestmentSimulator.tsx  # স্লাইডারসহ ইনভেস্টমেন্ট রিবেট কন্ট্রোলার
│   │   ├── TaxSummaryCard.tsx       # গ্রস ট্যাক্স, রিবেট ও নিট ট্যাক্স কার্ড
│   │   ├── InvestmentAdvice.tsx     # পার্সোনালাইজড ইনভেস্টমেন্ট সাজেশন বক্স
│   │   ├── TaxBreakdownChart.tsx    # Recharts পাই ও বার চার্ট
│   │   └── TaxReportPDF.tsx         # ডাউনলোডযোগ্য PDF টেমপ্লেট
│   ├── store/
│   │   └── useTaxStore.ts           # Zustand স্টেট ও LocalStorage পার্সিস্টেন্স
│   ├── types/
│   │   └── tax.types.ts             # TypeScript ইন্টারফেসসমূহ
│   └── utils/
│       ├── taxRules.ts              # NBR ট্যাক্স স্ল্যাব ও রিবেট কনফিগারেশন
│       ├── taxCalculator.ts         # কোর ট্যাক্স ও রিবেট ক্যালকুলেশন ইঞ্জিন
│       └── investmentAdvisor.ts     # ইনভেস্টমেন্ট অপ্টিমাইজেশন অ্যালগরিদম
├── package.json
└── tsconfig.json
```

---

## ৪. সম্পূর্ণ সোর্স কোড (Core Implementation)

### ৪.১. টাইপ ডেফিনিশন (`src/types/tax.types.ts`)
```typescript
export type TaxpayerCategory = 'general' | 'female_senior' | 'disabled' | 'freedom_fighter';

export interface InvestmentData {
  dps: number;           // সর্বোচ্চ ১,২০,০০০ টাকা রিবেটযোগ্য
  sanchaypatra: number;  // সর্বোচ্চ ৫,০০,০০০ টাকা রিবেটযোগ্য
  shareMarket: number;   // শেয়ার বাজার / মিউচুয়াল ফান্ড
  providentFund: number; // RPF (কর্মী + নিয়োগকর্তার অংশ)
  lifeInsurance: number; // জীবন বীমা প্রিমিয়াম
}

export interface IncomeData {
  category: TaxpayerCategory;
  basicSalaryAnnual: number;
  houseRentAnnual: number;
  medicalAnnual: number;
  conveyanceAnnual: number;
  festivalBonusAnnual: number;
  otherTaxableIncome: number;
}

export interface TaxCalculationResult {
  grossIncome: number;
  exemptedIncome: number;
  taxableIncome: number;
  grossTax: number;
  slabBreakdown: { slabName: string; taxableAmount: number; taxAmount: number }[];
  totalInvestment: number;
  eligibleInvestment: number;
  maxAllowableRebate: number;
  actualRebate: number;
  netTaxPayable: number;
  minimumTax: number;
}
```

---

### ৪.২. NBR রুল-ইঞ্জিন (`src/utils/taxRules.ts`)
প্রতি বছর বাজেটে নিয়ম বদলালে শুধুমাত্র এই ফাইলটি আপডেট করলেই পুরো অ্যাপ আপডেট হয়ে যাবে।

```typescript
import { TaxpayerCategory } from '@/types/tax.types';

export interface TaxSlab {
  label: string;
  limit: number;
  rate: number;
}

// করদাতার ক্যাটাগরি অনুযায়ী করমুক্ত আয়ের সীমা
export const EXEMPTION_THRESHOLDS: Record<TaxpayerCategory, number> = {
  general: 350000,         // সাধারণ পুরুষ করদাতা
  female_senior: 400000,   // নারী ও ৬৫+ বয়সী করদাতা
  disabled: 475000,        // প্রতিবন্ধী করদাতা
  freedom_fighter: 500000, // গেজেটভুক্ত যুদ্ধাহত মুক্তিযোদ্ধা
};

// প্রগ্রেসিভ ট্যাক্স স্ল্যাব (প্রথম স্ল্যাবের পরের ধাপসমূহ)
export const PROGRESSIVE_SLABS: TaxSlab[] = [
  { label: 'পরবর্তী ১,০০,০০০ টাকার ওপর (৫%)', limit: 100000, rate: 0.05 },
  { label: 'পরবর্তী ৪,০০,০০০ টাকার ওপর (১০%)', limit: 400000, rate: 0.10 },
  { label: 'পরবর্তী ৫,০০,০০০ টাকার ওপর (১৫%)', limit: 500000, rate: 0.15 },
  { label: 'পরবর্তী ২০,০০,০০০ টাকার ওপর (২০%)', limit: 2000000, rate: 0.20 },
  { label: 'অবশিষ্ট আয়ের ওপর (২৫%)', limit: Infinity, rate: 0.25 },
];

// ইনভেস্টমেন্ট রিবেট রুলস (আয়কর আইন ২০২৩ অনুযায়ী)
export const REBATE_RULES = {
  taxableIncomePercentage: 0.03, // মোট করযোগ্য আয়ের ৩%
  eligibleInvestmentPercentage: 0.15, // অনুমোদিত বিনিয়োগের ১৫%
  maxRebateCap: 1000000, // সর্বোচ্চ ১০ লক্ষ টাকা রিবেট
  dpsMaxLimit: 120000, // ডিপিএস-এ সর্বোচ্চ ১.২০ লক্ষ টাকা রিবেটযোগ্য
  sanchaypatraMaxLimit: 500000, // সঞ্চয়পত্রে সর্বোচ্চ ৫ লক্ষ টাকা রিবেটযোগ্য
  minimumTaxDhakaCtg: 5000, // ঢাকা ও চট্টগ্রাম সিটি কর্পোরেশন এলাকায় ন্যূনতম কর
};
```

---

### ৪.৩. কোর ট্যাক্স ও রিবেট ক্যালকুলেশন ইঞ্জিন (`src/utils/taxCalculator.ts`)
```typescript
import { IncomeData, InvestmentData, TaxCalculationResult } from '@/types/tax.types';
import { EXEMPTION_THRESHOLDS, PROGRESSIVE_SLABS, REBATE_RULES } from './taxRules';

export function calculateNBRTax(
  income: IncomeData,
  investments: InvestmentData,
  isDhakaOrCtg: boolean = true
): TaxCalculationResult {
  // ১. মোট বার্ষিক আয় (Gross Income)
  const grossIncome =
    income.basicSalaryAnnual +
    income.houseRentAnnual +
    income.medicalAnnual +
    income.conveyanceAnnual +
    income.festivalBonusAnnual +
    income.otherTaxableIncome;

  // ২. চাকরিজীবীদের সাধারণ করমুক্ত ভাতা (মোট আয়ের ১/৩ অংশ অথবা সর্বোচ্চ ৪,৫০,০০০ টাকা)
  const exemptedIncome = Math.min(grossIncome / 3, 450000);
  const taxableIncome = Math.max(0, grossIncome - exemptedIncome);

  // ৩. স্ল্যাব অনুযায়ী গ্রস ট্যাক্স নির্ণয়
  const zeroSlabLimit = EXEMPTION_THRESHOLDS[income.category];
  let remainingIncome = Math.max(0, taxableIncome - zeroSlabLimit);
  let grossTax = 0;

  const slabBreakdown: { slabName: string; taxableAmount: number; taxAmount: number }[] = [
    {
      slabName: `প্রথম ৳${zeroSlabLimit.toLocaleString()} পর্যন্ত (০%)`,
      taxableAmount: Math.min(taxableIncome, zeroSlabLimit),
      taxAmount: 0,
    },
  ];

  for (const slab of PROGRESSIVE_SLABS) {
    if (remainingIncome <= 0) break;
    const taxableInThisSlab = Math.min(remainingIncome, slab.limit);
    const taxForThisSlab = taxableInThisSlab * slab.rate;

    grossTax += taxForThisSlab;
    slabBreakdown.push({
      slabName: slab.label,
      taxableAmount: taxableInThisSlab,
      taxAmount: taxForThisSlab,
    });

    remainingIncome -= taxableInThisSlab;
  }

  // ৪. অনুমোদিত বিনিয়োগ (Eligible Investment) হিসাব
  const eligibleDPS = Math.min(investments.dps, REBATE_RULES.dpsMaxLimit);
  const eligibleSanchaypatra = Math.min(investments.sanchaypatra, REBATE_RULES.sanchaypatraMaxLimit);

  const totalInvestment =
    investments.dps +
    investments.sanchaypatra +
    investments.shareMarket +
    investments.providentFund +
    investments.lifeInsurance;

  const eligibleInvestment =
    eligibleDPS +
    eligibleSanchaypatra +
    investments.shareMarket +
    investments.providentFund +
    investments.lifeInsurance;

  // ৫. ট্যাক্স রিবেট ক্যালকুলেশন (আয়কর আইন ২০২৩: নিচের ৩টির মধ্যে যেটি সবচেয়ে কম)
  // ক) করযোগ্য আয়ের ৩%
  // খ) অনুমোদিত বিনিয়োগের ১৫%
  // গ) ১০,০০,০০০ টাকা
  const threePercentOfTaxable = taxableIncome * REBATE_RULES.taxableIncomePercentage;
  const fifteenPercentOfInvestment = eligibleInvestment * REBATE_RULES.eligibleInvestmentPercentage;

  const maxAllowableRebate = Math.min(threePercentOfTaxable, REBATE_RULES.maxRebateCap);
  const actualRebate =
    grossTax > 0
      ? Math.min(threePercentOfTaxable, fifteenPercentOfInvestment, REBATE_RULES.maxRebateCap)
      : 0;

  // ৬. নিট প্রদেয় কর (Net Tax Payable)
  const minimumTax = taxableIncome > zeroSlabLimit ? (isDhakaOrCtg ? REBATE_RULES.minimumTaxDhakaCtg : 4000) : 0;
  const taxAfterRebate = Math.max(0, grossTax - actualRebate);
  const netTaxPayable = taxableIncome > zeroSlabLimit ? Math.max(taxAfterRebate, minimumTax) : 0;

  return {
    grossIncome,
    exemptedIncome,
    taxableIncome,
    grossTax,
    slabBreakdown,
    totalInvestment,
    eligibleInvestment,
    maxAllowableRebate,
    actualRebate,
    netTaxPayable,
    minimumTax,
  };
}
```

---

### ৪.৪. স্মার্ট ইনভেস্টমেন্ট অ্যাডভাইজার (`src/utils/investmentAdvisor.ts`)
সর্বোচ্চ রিবেট পেতে ইউজারের আরও কত টাকা কোথায় বিনিয়োগ করা উচিত তা এই ফাংশন বের করবে।

```typescript
import { InvestmentData, TaxCalculationResult } from '@/types/tax.types';
import { REBATE_RULES } from './taxRules';

export interface InvestmentSuggestion {
  sector: string;
  recommendedAdditionalAmount: number;
  taxSaved: number;
  reason: string;
}

export function getPersonalizedInvestmentPlan(
  result: TaxCalculationResult,
  currentInvestments: InvestmentData
) {
  // সর্বোচ্চ রিবেট পেতে যে পরিমাণ অনুমোদিত বিনিয়োগ প্রয়োজন (Max Rebate / 0.15)
  const requiredInvestmentForMaxRebate = Math.ceil(
    result.maxAllowableRebate / REBATE_RULES.eligibleInvestmentPercentage
  );

  const investmentGap = Math.max(0, requiredInvestmentForMaxRebate - result.eligibleInvestment);

  if (result.grossTax === 0) {
    return {
      status: 'NO_TAX',
      headline: 'আপনার বার্ষিক আয় করমুক্ত সীমার নিচে। ট্যাক্স রিবেটের জন্য বিনিয়োগের প্রয়োজন নেই।',
      investmentGap: 0,
      potentialExtraTaxSave: 0,
      suggestions: [],
    };
  }

  if (investmentGap === 0) {
    return {
      status: 'OPTIMIZED',
      headline: 'অভিনন্দন! আপনি সর্বোচ্চ ট্যাক্স রিবেট কোটা পূরণ করেছেন।',
      investmentGap: 0,
      potentialExtraTaxSave: 0,
      suggestions: [],
    };
  }

  let remainingGap = investmentGap;
  const suggestions: InvestmentSuggestion[] = [];

  // ১. প্রথমে ডিপিএস (DPS) কোটা পূরণের পরামর্শ (সর্বোচ্চ ১,২০,০০০ টাকা)
  const dpsRoom = Math.max(0, REBATE_RULES.dpsMaxLimit - currentInvestments.dps);
  if (remainingGap > 0 && dpsRoom > 0) {
    const allocate = Math.min(remainingGap, dpsRoom);
    suggestions.push({
      sector: 'ব্যাংক ডিপিএস (DPS)',
      recommendedAdditionalAmount: allocate,
      taxSaved: Math.round(allocate * 0.15),
      reason: `মাসিক ৳${Math.ceil(allocate / 12).toLocaleString()} করে ডিপিএস করলে নিরাপদ সঞ্চয়ের পাশাপাশি ১৫% রিবেট পাবেন।`,
    });
    remainingGap -= allocate;
  }

  // ২. দ্বিতীয়ত সঞ্চয়পত্র (Sanchaypatra) কোটা (সর্বোচ্চ ৫,০০,০০০ টাকা)
  const sanchaypatraRoom = Math.max(0, REBATE_RULES.sanchaypatraMaxLimit - currentInvestments.sanchaypatra);
  if (remainingGap > 0 && sanchaypatraRoom > 0) {
    const allocate = Math.min(remainingGap, sanchaypatraRoom);
    suggestions.push({
      sector: 'সঞ্চয়পত্র (Sanchaypatra)',
      recommendedAdditionalAmount: allocate,
      taxSaved: Math.round(allocate * 0.15),
      reason: 'সরকারি গ্যারান্টিযুক্ত উচ্চ মুনাফা ও নিশ্চিত কর রেয়াতের জন্য সেরা মাধ্যম।',
    });
    remainingGap -= allocate;
  }

  // ৩. অবশিষ্ট গ্যাপ পূরণে শেয়ার বাজার বা মিউচুয়াল ফান্ড (কোনো আপার লিমিট নেই)
  if (remainingGap > 0) {
    suggestions.push({
      sector: 'শেয়ার বাজার / মিউচুয়াল ফান্ড',
      recommendedAdditionalAmount: remainingGap,
      taxSaved: Math.round(remainingGap * 0.15),
      reason: 'ডিপিএস ও সঞ্চয়পত্রের সীমা পূর্ণ হওয়ার পর অবশিষ্ট রিবেট কোটা পূরণে এটিই একমাত্র কার্যকর খাত।',
    });
  }

  const potentialExtraTaxSave = Math.round(investmentGap * 0.15);

  return {
    status: 'ACTION_NEEDED',
    headline: `সর্বোচ্চ রিবেট পেতে আপনার আরও ৳${investmentGap.toLocaleString()} বিনিয়োগ করার সুযোগ আছে।`,
    investmentGap,
    potentialExtraTaxSave,
    suggestions,
  };
}
```

---

### ৪.৫. Zustand গ্লোবাল স্টোর (`src/store/useTaxStore.ts`)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IncomeData, InvestmentData } from '@/types/tax.types';

interface TaxStoreState {
  income: IncomeData;
  investments: InvestmentData;
  isDhakaOrCtg: boolean;
  setIncome: (data: Partial<IncomeData>) => void;
  setInvestments: (data: Partial<InvestmentData>) => void;
  setIsDhakaOrCtg: (val: boolean) => void;
  resetAll: () => void;
}

const initialIncome: IncomeData = {
  category: 'general',
  basicSalaryAnnual: 600000,     // মাসিক ৫০,০০০ টাকা বেসিক
  houseRentAnnual: 300000,       // মাসিক ২৫,০০০ টাকা বাড়িভাড়া
  medicalAnnual: 60000,          // মাসিক ৫,০০০ টাকা চিকিৎসা
  conveyanceAnnual: 36000,       // মাসিক ৩,০০০ টাকা যাতায়াত
  festivalBonusAnnual: 100000,   // ২টি উৎসব বোনাস
  otherTaxableIncome: 0,
};

const initialInvestments: InvestmentData = {
  dps: 60000,
  sanchaypatra: 0,
  shareMarket: 0,
  providentFund: 0,
  lifeInsurance: 0,
};

export const useTaxStore = create<TaxStoreState>()(
  persist(
    (set) => ({
      income: initialIncome,
      investments: initialInvestments,
      isDhakaOrCtg: true,
      setIncome: (data) =>
        set((state) => ({ income: { ...state.income, ...data } })),
      setInvestments: (data) =>
        set((state) => ({ investments: { ...state.investments, ...data } })),
      setIsDhakaOrCtg: (val) => set({ isDhakaOrCtg: val }),
      resetAll: () =>
        set({ income: initialIncome, investments: initialInvestments, isDhakaOrCtg: true }),
    }),
    { name: 'nbr-tax-simulator-storage' }
  )
);
```

---

### ৪.৬. মেইন সিমুলেটর ড্যাশবোর্ড (`src/app/page.tsx`)
```tsx
'use client';

import React, { useMemo } from 'react';
import { useTaxStore } from '@/store/useTaxStore';
import { calculateNBRTax } from '@/utils/taxCalculator';
import { getPersonalizedInvestmentPlan } from '@/utils/investmentAdvisor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TaxSimulatorPage() {
  const { income, investments, isDhakaOrCtg, setIncome, setInvestments, resetAll } = useTaxStore();

  const taxResult = useMemo(
    () => calculateNBRTax(income, investments, isDhakaOrCtg),
    [income, investments, isDhakaOrCtg]
  );

  const advicePlan = useMemo(
    () => getPersonalizedInvestmentPlan(taxResult, investments),
    [taxResult, investments]
  );

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* হেডার */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              NBR Tax & Investment Rebate Simulator
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              বাংলাদেশের চাকরিজীবীদের জন্য স্মার্ট আয়কর ক্যালকুলেটর ও ইনভেস্টমেন্ট প্ল্যানার
            </p>
          </div>
          <Button variant="outline" onClick={resetAll}>
            রিসেট করুন
          </Button>
        </header>

        {/* মেইন গ্রিড */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* বাম কলাম: ইনপুট ও স্লাইডার (৭ কলাম) */}
          <div className="lg:col-span-7 space-y-6">
            {/* ১. বার্ষিক আয়ের তথ্য */}
            <Card>
              <CardHeader>
                <CardTitle>১. বার্ষিক বেতন ও ভাতার বিবরণ (টাকায়)</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>বার্ষিক মূল বেতন (Basic Salary)</Label>
                  <Input
                    type="number"
                    value={income.basicSalaryAnnual}
                    onChange={(e) => setIncome({ basicSalaryAnnual: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>বার্ষিক বাড়িভাড়া ভাতা (House Rent)</Label>
                  <Input
                    type="number"
                    value={income.houseRentAnnual}
                    onChange={(e) => setIncome({ houseRentAnnual: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>বার্ষিক চিকিৎসা ভাতা (Medical)</Label>
                  <Input
                    type="number"
                    value={income.medicalAnnual}
                    onChange={(e) => setIncome({ medicalAnnual: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>উৎসব বোনাস ও অন্যান্য (Bonus)</Label>
                  <Input
                    type="number"
                    value={income.festivalBonusAnnual}
                    onChange={(e) => setIncome({ festivalBonusAnnual: Number(e.target.value) })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* ২. ইনভেস্টমেন্ট সিমুলেটর স্লাইডার */}
            <Card>
              <CardHeader>
                <CardTitle>২. ইনভেস্টমেন্ট সিমুলেটর (স্লাইডার টেনে রিবেট দেখুন)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* DPS */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>ব্যাংক ডিপিএস (সর্বোচ্চ ৳১,২০,০০০ রিবেটযোগ্য)</span>
                    <span className="text-emerald-600 font-bold">৳{investments.dps.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[investments.dps]}
                    max={200000}
                    step={5000}
                    onValueChange={([val]) => setInvestments({ dps: val })}
                  />
                </div>

                {/* সঞ্চয়পত্র */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>সঞ্চয়পত্র (সর্বোচ্চ ৳৫,০০,০০০ রিবেটযোগ্য)</span>
                    <span className="text-emerald-600 font-bold">৳{investments.sanchaypatra.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[investments.sanchaypatra]}
                    max={1000000}
                    step={10000}
                    onValueChange={([val]) => setInvestments({ sanchaypatra: val })}
                  />
                </div>

                {/* শেয়ার বাজার */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>শেয়ার বাজার / মিউচুয়াল ফান্ড</span>
                    <span className="text-emerald-600 font-bold">৳{investments.shareMarket.toLocaleString()}</span>
                  </div>
                  <Slider
                    value={[investments.shareMarket]}
                    max={1000000}
                    step={10000}
                    onValueChange={([val]) => setInvestments({ shareMarket: val })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ডান কলাম: সামারি ও স্মার্ট অ্যাডভাইস (৫ কলাম) */}
          <div className="lg:col-span-5 space-y-6">
            {/* ট্যাক্স সামারি কার্ড */}
            <Card className="bg-slate-900 text-white">
              <CardHeader>
                <CardTitle className="text-lg text-slate-200">আয়কর সারসংক্ষেপ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">মোট বার্ষিক আয়:</span>
                  <span>৳{taxResult.grossIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">করযোগ্য আয় (Taxable):</span>
                  <span>৳{taxResult.taxableIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">মোট আরোপিত কর (Gross Tax):</span>
                  <span>৳{taxResult.grossTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-emerald-400 font-medium">
                  <span>ইনভেস্টমেন্ট রিবেট ছাড়:</span>
                  <span>- ৳{taxResult.actualRebate.toLocaleString()}</span>
                </div>
                <hr className="border-slate-700" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base font-semibold">নিট প্রদেয় কর (Net Tax):</span>
                  <span className="text-2xl font-bold text-amber-400">
                    ৳{taxResult.netTaxPayable.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* পার্সোনালাইজড ইনভেস্টমেন্ট প্ল্যান */}
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-emerald-900 text-lg">
                    স্মার্ট ইনভেস্টমেন্ট প্ল্যান
                  </CardTitle>
                  {advicePlan.potentialExtraTaxSave > 0 && (
                    <Badge className="bg-emerald-600">
                      আরও ৳{advicePlan.potentialExtraTaxSave.toLocaleString()} সাশ্রয় সম্ভব
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-700 font-medium">{advicePlan.headline}</p>
                {advicePlan.suggestions.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-xs">
                    <div className="flex justify-between font-semibold text-sm text-slate-900">
                      <span>{item.sector}</span>
                      <span className="text-emerald-600">+ ৳{item.recommendedAdditionalAmount.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{item.reason}</p>
                    <p className="text-xs font-medium text-amber-700 mt-1">
                      সম্ভাব্য অতিরিক্ত ট্যাক্স ছাড়: ৳{item.taxSaved.toLocaleString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
```

---

## ৫. স্টেপ-বাই-স্টেপ ডেভেলপমেন্ট রোডম্যাপ (৭ দিনের প্ল্যান)

* **দিন ১ (প্রজেক্ট সেটআপ):** Next.js প্রজেক্ট ইনিশিয়ালাইজ করুন, Shadcn UI কম্পোনেন্ট ইন্সটল করুন এবং ফোল্ডার স্ট্রাকচার সাজান।
* **দিন ২ (কোর লজিক বিল্ডিং):** `taxRules.ts`, `taxCalculator.ts` এবং `investmentAdvisor.ts` ফাইলগুলো যুক্ত করে বিভিন্ন স্যালারি স্ল্যাব দিয়ে ক্যালকুলেশন যাচাই করুন।
* **দিন ৩ (স্টেট ম্যানেজমেন্ট ও UI):** Zustand স্টোর সেটআপ করুন এবং মেইন ড্যাশবোর্ডে ইনকাম ফর্ম ও স্লাইডারগুলো কানেক্ট করুন।
* **দিন ৪ (ডেটা ভিজ্যুয়ালাইজেশন):** Recharts ব্যবহার করে একটি পাই চার্ট তৈরি করুন যেখানে "নিট আয়", "ট্যাক্স" এবং "ট্যাক্স সেভিংস" আলাদা রঙে দেখাবে।
* **দিন ৫ (PDF এক্সপোর্ট ফিচার):** `@react-pdf/renderer` দিয়ে একটি A4 সাইজের ট্যাক্স সামারি রিপোর্ট টেমপ্লেট বানান যাতে ইউজার প্রিন্ট বা ডাউনলোড করতে পারেন।
* **দিন ৬ (SEO ও বাংলা/ইংরেজি টগল):** গুগল সার্চে র‍্যাঙ্ক করার জন্য `layout.tsx`-এ প্রপার টাইটেল ও মেটা ডেসক্রিপশন যোগ করুন (যেমন: *Bangladesh Income Tax Calculator 2026-27*)।
* **দিন ৭ (ডিপ্লয়মেন্ট ও লঞ্চ):** GitHub-এ কোড পুশ করে Vercel-এ লাইভ ডিপ্লয় করুন এবং LinkedIn ও ফেসবুকের কর্পোরেট গ্রুপগুলোতে শেয়ার করুন।

---

## ৬. প্রজেক্টটি থেকে আয়ের (Monetization) উপায়
১. **Affiliate & Lead Generation:** সিমুলেটরে ইউজারকে যখন ব্যাংক ডিপিএস বা মিউচুয়াল ফান্ডে ইনভেস্ট করার সাজেশন দেওয়া হবে, সেখানে পার্টনার ব্যাংক বা অ্যাসেট ম্যানেজমেন্ট কোম্পানির (যেমন: IDLC, LankaBangla, City Bank) অ্যাকাউন্ট ওপেনিং লিংক যুক্ত করে কমিশন আয় করা।
২. **Tax Return Filing Service (Freemium):** ক্যালকুলেটরটি সম্পূর্ণ ফ্রি রেখে নিচে একটি বাটন রাখুন—*"আমাদের এক্সপার্ট দিয়ে মাত্র ৫০০ টাকায় আপনার ই-রিটার্ন (e-Return) সাবমিট করুন"*। ট্যাক্স সিজনে (জুলাই-নভেম্বর) এখান থেকে প্রচুর ক্লায়েন্ট পাওয়া যায়।