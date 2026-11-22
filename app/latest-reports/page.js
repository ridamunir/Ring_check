
import Link from "next/link";
import { getLatestReports } from "@/lib/tool-data";
import { formatNumber } from "@/lib/numbers";
import { SiteChrome } from "@/components/SiteChrome";

export const dynamic = "force-dynamic";
export const metadata = { title: "Latest Reports — MyRingCheck", description: "The latest scam and nuisance call reports from the MyRingCheck community." };

export default async function LatestPage() {
  const latest = await getLatestReports(30);
  return (
    <SiteChrome>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1>Latest Reports</h1>
        <p className="mt-3 text-slate-700">The newest approved reports, most recent first. Each report is written by a real person who got the call.</p>
        <ul className="mt-6 space-y-3">
          {latest.map((r, i) => (
            <li key={r.id || i} className="rounded-lg border bg-white p-4">
              <Link href={`/number/${r.number}/`} className="font-bold text-[#0B1F3A] hover:underline">{formatNumber(r.number)}</Link>
              <span className="ml-2 text-sm text-slate-500">{r.category} · {String(r.created_at || r.date || "").slice(0, 10)}</span>
              <p className="mt-1 text-slate-700">{r.body}</p>
            </li>
          ))}
        </ul>
        {latest.length === 0 && <p className="mt-4 text-slate-600">No reports yet.</p>}
        <h2 className="mb-3 mt-10 text-2xl font-bold">About these reports</h2>
        <h3 className="mb-2 text-lg font-bold">Checked before they go live</h3>
        <p className="text-slate-700">Every report is checked by moderation before it appears here. Reports with links or personal details are not published.</p>
        <h3 className="mb-2 mt-4 text-lg font-bold">Written by real people</h3>
        <p className="text-slate-700">Each report is written by someone who got the call, in their own words. That is why reports are more useful than a score on its own.</p>
      </main>
    </SiteChrome>
  );
}
