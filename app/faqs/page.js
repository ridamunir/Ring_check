
import { SiteChrome } from "@/components/SiteChrome";
import FaqAccordion from "@/components/FaqAccordion";
import { FAQS } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata = { title: "FAQs — MyRingCheck", description: "Frequently asked questions about checking unknown numbers, spam scores, reports, 7726 and 159." };

export default function FaqsPage() {
  return (
    <SiteChrome>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1>FAQs</h1>
        <p className="mt-3 text-slate-700">Answers to the questions people ask most about unknown numbers, scam calls, reports and the spam score.</p>
        <div className="mt-6"><FaqAccordion items={FAQS} /></div>
      </main>
    </SiteChrome>
  );
}
