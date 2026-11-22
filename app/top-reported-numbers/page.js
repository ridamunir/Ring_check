
import Link from "next/link";
import { getTopNumbers } from "@/lib/tool-data";
import { formatNumber, scoreBand } from "@/lib/numbers";
import { SiteChrome } from "@/components/SiteChrome";
import { getPageBySlug, getRequestLang } from "@/lib/data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Top Reported Numbers — MyRingCheck", description: "The most reported scam and nuisance numbers in the UK, updated from community reports." };

export default async function TopPage() {
  const lang = getRequestLang();
  const page = await getPageBySlug("top-reported-numbers", lang);
  const top = await getTopNumbers(50);
  return (
    <SiteChrome>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1>Top Reported Numbers</h1>
        <p className="mt-3 text-slate-700">The numbers with the most reports in the last 30 days, sorted by reports and spam score. The list updates automatically as new reports are approved.</p>
        <ol className="mt-6 divide-y rounded-lg border bg-white">
          {top.map((t, i) => (
            <li key={t.number} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <span><span className="mr-2 font-bold text-slate-400">{i + 1}.</span><Link href={`/number/${t.number}/`} className="font-bold text-[#0B1F3A] hover:underline">{formatNumber(t.number)}</Link></span>
              <span className="text-sm text-slate-600">{t.reports.length} {t.reports.length === 1 ? "report" : "reports"} · {t.top_category} · Score {t.score} ({scoreBand(t.score).label})</span>
            </li>
          ))}
        </ol>
        {top.length === 0 && <p className="mt-4 text-slate-600">No reported numbers yet.</p>}
        <h2 className="mb-3 mt-10 text-2xl font-bold">How this list is made</h2>
        <h3 className="mb-2 text-lg font-bold">Last 30 days, reports first</h3>
        <p className="text-slate-700">Numbers are ranked by approved reports in the last 30 days, then by spam score. A number leaves the list when its reports get old — unless new reports keep coming in.</p>
        <h3 className="mb-2 mt-4 text-lg font-bold">No votes are invented</h3>
        <p className="text-slate-700">Every number on this list has at least one real approved report. Unsafe vote counts on number pages include those reports — each approved report counts as one Unsafe signal.</p>
      </main>
    </SiteChrome>
  );
}
