
import Link from "next/link";
import { notFound } from "next/navigation";
import { normalizeUkNumber, formatNumber, numberOrigin, numberType, areaCodeSlug, scoreBand, voteCountLabel, NEWLY_ADDED_LABEL, NO_VOTES_YET_LABEL } from "@/lib/numbers";
import { getNumberData, getTopNumbers, isIndexable } from "@/lib/tool-data";
import { SiteChrome } from "@/components/SiteChrome";
import SearchBox from "@/components/SearchBox";
import FaqAccordion from "@/components/FaqAccordion";
import VoteButtons from "@/components/VoteButtons";
import ReportForm from "@/components/ReportForm";

export const dynamic = "force-dynamic";
const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export async function generateMetadata({ params }) {
  const n = normalizeUkNumber(decodeURIComponent(params.number || ""));
  if (!n) return { title: "Not found — MyRingCheck", robots: { index: false } };
  const rec = await getNumberData(n);
  const title = rec && rec.reports.length
    ? `${formatNumber(n)} — Who Called Me? Spam Score ${rec.score} & Reports | MyRingCheck`
    : `${formatNumber(n)} — Who Called Me? Spam Score & Reports | MyRingCheck`;
  return {
    title,
    description: rec && rec.reports.length
      ? `${formatNumber(n)} has ${rec.reports.length} report(s) (${rec.top_category}). Check the spam score and what other people reported.`
      : `${formatNumber(n)} has no reports yet. Check what is known about this UK number.`,
    alternates: { canonical: `${BASE}/number/${n}/` },
    robots: rec && isIndexable(rec) ? { index: true } : { index: false },
  };
}

export default async function NumberPage({ params }) {
  const raw = decodeURIComponent(params.number || "");
  const n = normalizeUkNumber(raw);
  if (!n) {
    return (
      <SiteChrome>
        <main className="mx-auto max-w-3xl px-4 py-10">
          <h1>That number doesn&apos;t look right</h1>
          <p className="mt-3 text-slate-700">“{raw}” is not a valid UK number. Enter a full UK number, for example 020 7946 0958 or 07700 900123.</p>
          <SearchBox error="That does not look like a UK number. Check the digits and try again." />
        </main>
      </SiteChrome>
    );
  }
  const rec = await getNumberData(n);
  const reports = rec ? rec.reports : [];
  const score = rec ? rec.score : null;
  const band = scoreBand(score);
  const voteLabel = rec ? voteCountLabel(rec.safeVotes, rec.unsafeVotes) : null;
  const top = await getTopNumbers(20);
  const neighbours = top.filter((t) => t.number !== n && t.number.slice(0, 4) === n.slice(0, 4)).slice(0, 5);
  const areaSlug = areaCodeSlug(n);
  const patternSignals = reports.filter((r) => r.asked_otp || r.asked_bank_details || r.used_threat);

  return (
    <SiteChrome>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-slate-500">Number report</p>
        <h1>{formatNumber(n)}</h1>
        <div className="mt-4 rounded-lg border bg-white p-5">
          {reports.length === 0 ? (
            <>
              <p className="text-xl font-bold">Unknown — No reports yet</p>
              <p className="mt-2 text-slate-700">Nobody has reported this number yet. That does not mean it is safe — it only means we have no evidence about it.</p>
              <p className="mt-2"><span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium">{NEWLY_ADDED_LABEL}</span></p>
            </>
          ) : (
            <>
              <p className="text-xl font-bold">{band.text}</p>
              <p className="mt-2"><span className="text-4xl font-bold text-[#0B1F3A]">{score}</span> <span className="text-slate-600">/ 100 spam score · {reports.length} {reports.length === 1 ? "report" : "reports"}</span></p>
              {voteLabel && <p className="mt-1 text-sm text-slate-600">{voteLabel}</p>}
            </>
          )}
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-2"><dt className="font-semibold">Number origin:</dt><dd>{numberOrigin(n)}</dd></div>
            <div className="flex gap-2"><dt className="font-semibold">Number type:</dt><dd>{numberType(n)}</dd></div>
            <div className="flex gap-2"><dt className="font-semibold">Caller location:</dt><dd>Unknown — caller ID can be spoofed</dd></div>
          </dl>
          <p className="mt-3 text-sm text-slate-600">This is where the number was allocated, not where the caller is — the caller may be anywhere, and the number may be spoofed.</p>
          <p className="mt-2 text-sm text-slate-600">Data on this page is based on community reports. We never publish the number owner's name or address.</p>
        </div>

        {patternSignals.length > 0 && (
          <section className="mt-8">
            <h2>Scam pattern signals in reports</h2>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {patternSignals.some((r) => r.asked_otp) && <li>Reporters say the caller asked for a one-time code.</li>}
              {patternSignals.some((r) => r.asked_bank_details) && <li>Reporters say the caller asked for bank details.</li>}
              {patternSignals.some((r) => r.used_threat) && <li>Reporters say the caller used threats.</li>}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h2>Did this number call you?</h2>
          <VoteButtons number={n} safe={rec ? rec.safeVotes : 0} unsafe={rec ? rec.unsafeVotes : 0} unsafeFromReports={rec ? rec.unsafeFromReports : 0} />
          {!voteLabel && <p className="mt-2 text-sm text-slate-600">{NO_VOTES_YET_LABEL}</p>}
        </section>

        <section className="mt-8">
          <h2>Reports for {formatNumber(n)} ({reports.length})</h2>
          {reports.length === 0 ? (
            <p className="mt-2 text-slate-700">No reports yet. <a href="#report" className="underline">Be the first to report it</a>.</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {reports.map((r, i) => (
                <li key={r.id || i} className="rounded-lg border bg-white p-4">
                  <p className="text-sm text-slate-500">{r.category} · {String(r.created_at || r.date || "").slice(0, 10)}</p>
                  <p className="mt-1">{r.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {neighbours.length > 0 && (
          <section className="mt-8">
            <h2>Neighbouring numbers with reports</h2>
            <ul className="mt-2 space-y-1">
              {neighbours.map((t) => (
                <li key={t.number}><Link href={`/number/${t.number}/`} className="font-medium text-[#0B1F3A] hover:underline">{formatNumber(t.number)}</Link> <span className="text-sm text-slate-600">· {t.reports.length} reports · Score {t.score}</span></li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-8">
          <h2>What to do next</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Block the number on your phone if it was unwanted.</li>
            <li>If it was a bank scam, hang up and call <strong>159</strong> yourself.</li>
            <li>Forward scam texts to <strong>7726</strong> — it is free.</li>
            <li>Never share a one-time code or bank details on an incoming call.</li>
          </ul>
          <p className="mt-3 text-sm">
            {areaSlug && <><Link href={`/area-code/${areaSlug}/`} className="underline">About this area code</Link> · </>}
            <Link href="/top-reported-numbers/" className="underline">Top reported numbers</Link> · <Link href="/scam-calls/" className="underline">Scam calls</Link>
          </p>
        </section>

        <section className="mt-8" id="report">
          <h2>Report this number</h2>
          <div className="mt-3"><ReportForm number={n} /></div>
        </section>

        <section className="mt-8">
          <h2>Common questions</h2>
          <div className="mt-3"><FaqAccordion items={[
            ["What does Unknown — No reports yet mean?", "It means nobody has reported this number yet. It does not mean the number is safe, and it does not mean it is a scam."],
            ["Can a scammer fake this number?", "Yes. Caller ID can be spoofed, so the number you see is not proof of who is calling or where they are."],
            ["Should I call this number back?", "Check the reports first. If it has scam reports, do not call back. If it has no reports and you are not expecting a call, there is usually no reason to call back."],
          ]} /></div>
        </section>
      </main>
    </SiteChrome>
  );
}
