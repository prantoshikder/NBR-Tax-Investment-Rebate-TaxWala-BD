import { AdviceCard } from "@/components/AdviceCard";
import { AppHeader, Container, Footer, MobileTaxBar, StoreHydrator } from "@/components/AppShell";
import { BreakdownCard } from "@/components/BreakdownCard";
import { FilingCard } from "@/components/FilingCard";
import { IncomeCard } from "@/components/IncomeCard";
import { InvestmentCard } from "@/components/InvestmentCard";
import { PrintReport } from "@/components/PrintReport";
import { ProfileCard } from "@/components/ProfileCard";
import { SummaryCard } from "@/components/SummaryCard";

export default function Home() {
  return (
    <>
      <StoreHydrator />
      <AppHeader />
      <main className="print:hidden">
        <Container>
          <div className="mb-6 max-w-2xl lg:mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              আপনার আয়কর কত, আর কীভাবে কমাবেন?
            </h1>
            <p className="mt-2 text-slate-600">
              বেতন লিখুন, বিনিয়োগের স্লাইডার টানুন — NBR-এর সর্বশেষ নিয়মে সাথে সাথে হিসাব। কোনো লগইন নেই, তথ্য শুধু
              আপনার ব্রাউজারেই থাকে।
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <ProfileCard />
              <IncomeCard />
              <InvestmentCard />
              <BreakdownCard />
            </div>
            <aside className="lg:col-span-5">
              <div className="space-y-6 lg:sticky lg:top-24">
                <SummaryCard />
                <AdviceCard />
                <FilingCard />
              </div>
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileTaxBar />
      <PrintReport />
    </>
  );
}
