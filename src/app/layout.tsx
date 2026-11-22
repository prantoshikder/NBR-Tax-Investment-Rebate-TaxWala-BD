import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";

const bangla = Hind_Siliguri({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "আয়কর ক্যালকুলেটর ২০২৬-২৭ | করহিসাব — Bangladesh Income Tax & Rebate Calculator",
  description:
    "বাংলাদেশের চাকরিজীবীদের জন্য NBR আয়কর নির্দেশিকা ২০২৬-২৭ অনুযায়ী আয়কর ও বিনিয়োগ রেয়াত ক্যালকুলেটর। ডিপিএস, সঞ্চয়পত্র, শেয়ারে কত বিনিয়োগে কত কর বাঁচবে — সাথে সাথে দেখুন।",
  keywords: [
    "Bangladesh income tax calculator",
    "আয়কর ক্যালকুলেটর",
    "tax rebate calculator Bangladesh",
    "NBR tax 2026-27",
    "সঞ্চয়পত্র কর রেয়াত",
  ],
  openGraph: {
    title: "করহিসাব — আয়কর ও বিনিয়োগ রেয়াত ক্যালকুলেটর",
    description: "NBR-এর সর্বশেষ নিয়মে আয়কর হিসাব ও কর বাঁচানোর বিনিয়োগ প্ল্যান।",
    locale: "bn_BD",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${bangla.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 font-sans text-slate-900">{children}</body>
    </html>
  );
}
