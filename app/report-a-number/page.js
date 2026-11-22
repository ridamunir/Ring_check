
import { SiteChrome } from "@/components/SiteChrome";
import ReportForm from "@/components/ReportForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Report a Number — MyRingCheck", description: "Report a scam or nuisance number. Your report is checked, then published to warn the next person." };

export default function ReportPage() {
  return (
    <SiteChrome>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1>Report a Number</h1>
        <p className="mt-3 text-slate-700">Tell us what happened. Your report is checked by our moderation before it goes live — no login needed.</p>
        <h2 className="mb-3 mt-8 text-xl font-bold">What makes a good report</h2>
        <p className="text-slate-700">Write what the caller said, in your own words. Say whether they asked for a code, bank details, or threatened you. Do not include your own name, address, or any personal details.</p>
        <div className="mt-6"><ReportForm number="" /></div>
      </main>
    </SiteChrome>
  );
}
