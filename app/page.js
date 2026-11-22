
import Link from "next/link";
import { getPageBySlug, getPublishedPages, getRequestLang, isConfigured } from "@/lib/data";
import { pageUrl } from "@/lib/languages";
import { SiteChrome } from "@/components/SiteChrome";
import SearchBox from "@/components/SearchBox";
import FaqAccordion from "@/components/FaqAccordion";
import { DemoBanner } from "@/components/PublicPage";
import { getTopNumbers, getLatestReports, getToolStats } from "@/lib/tool-data";
import { formatNumber, scoreBand } from "@/lib/numbers";
import { FAQS } from "@/lib/site";

export const dynamic = "force-dynamic";
const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

function varByName(page, name, fallback) {
  if (!page || !page.sections) return fallback;
  for (const s of page.sections) for (const v of s.variables || []) if (v.name === name) return v.value_html || fallback;
  return fallback;
}

export async function generateMetadata() {
  const lang = getRequestLang();
  const page = await getPageBySlug("", lang);
  return {
    title: (page && page.meta_title) || "Who Called Me? Check Unknown Numbers — MyRingCheck",
    description: (page && page.meta_description) || "Check any unknown UK number for free. See spam reports, a 0-100 spam score and what other people reported — no sign-up needed.",
    alternates: { canonical: BASE + "/" },
  };
}

export default async function HomePage() {
  const lang = getRequestLang();
  const page = await getPageBySlug("", lang);
  const top = await getTopNumbers(10);
  const latest = await getLatestReports(5);
  const blogs = (await getPublishedPages(lang)).filter((p) => p.type === "blog").slice(0, 3);
  const stats = await getToolStats();
  const heroHeading = varByName(page, "hero_heading", "<h1>Who called me?</h1>");
  const heroSub = varByName(page, "hero_subtext", "<p>Enter any unknown UK number and see, in seconds, whether other people reported it as a scam.</p>");
  const sections = (page && page.sections) || [];
  const contentSections = sections.filter((s) => s.title !== "Hero Section");

  return (
    <SiteChrome>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <DemoBanner configured={isConfigured()} />
        <div className="content-html" dangerouslySetInnerHTML={{ __html: heroHeading }} />
        <div className="content-html" dangerouslySetInnerHTML={{ __html: heroSub }} />
        <SearchBox
          label={stripTags(varByName(page, "search_label", "Search an unknown number"))}
          placeholder={stripTags(varByName(page, "search_placeholder", "e.g. 020 7946 0958"))}
          buttonText={stripTags(varByName(page, "search_button_text", "Check this number"))}
          hint={stripTags(varByName(page, "search_hint", "Free. No sign-up needed."))}
        />
        <p className="mt-6 rounded-md bg-slate-100 px-4 py-3 text-sm text-slate-700">
          Based on community reports. {stats.reports > 0 ? `${stats.reports} reports on ${stats.numbers} numbers.` : ""} {stats.votes > 0 ? `${stats.votes} votes cast.` : "No votes yet — be the first to vote on a number page."} We never publish a number owner's name or address.
        </p>

        {contentSections.map((section) => (
          <section key={section.id} className="mb-8 mt-10">
            {section.variables.map((v) => (
              <div key={v.id} className="content-html" dangerouslySetInnerHTML={{ __html: v.value_html || "" }} />
            ))}
          </section>
        ))}

        <h2 className="mb-3 mt-10 text-2xl font-bold">Top reported numbers</h2>
        <ul className="divide-y rounded-lg border bg-white">
          {top.map((t) => (
            <li key={t.number} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <Link href={`/number/${t.number}/`} className="font-bold text-[#0B1F3A] hover:underline">{formatNumber(t.number)}</Link>
              <span className="text-sm text-slate-600">{t.reports.length} {t.reports.length === 1 ? "report" : "reports"} · {t.top_category} · Score {t.score} ({scoreBand(t.score).label})</span>
            </li>
          ))}
        </ul>
        <p className="mt-2"><Link href="/top-reported-numbers/" className="text-[#0B1F3A] underline">See all top reported numbers →</Link></p>

        <h2 className="mb-3 mt-10 text-2xl font-bold">Latest reports</h2>
        <ul className="space-y-3">
          {latest.map((r, i) => (
            <li key={r.id || i} className="rounded-lg border bg-white p-4">
              <Link href={`/number/${r.number}/`} className="font-bold text-[#0B1F3A] hover:underline">{formatNumber(r.number)}</Link>
              <span className="ml-2 text-sm text-slate-500">{r.category}</span>
              <p className="mt-1 text-slate-700">{r.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-2"><Link href="/latest-reports/" className="text-[#0B1F3A] underline">See all latest reports →</Link></p>

        <h2 className="mb-3 mt-10 text-2xl font-bold">Popular right now</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["London — 020", "/area-code/020/", "The most searched area code in the UK."],
            ["Mobile Numbers — 07 Range", "/area-code/07-mobile-numbers/", "Most scam calls come from 07 numbers."],
            ["HMRC Scam Calls", "/scam-calls/hmrc-scam-calls/", "The most reported scam in the UK."],
            ["Bank Scam Calls", "/scam-calls/bank-scam-calls/", "The safe-account trick, explained."],
            ["How to Report a Scam Call", "/report-scam-call-uk/", "7726, 159 and Action Fraud."],
            ["Reverse Phone Lookup UK", "/reverse-phone-lookup/", "What you can — and cannot — find out."],
          ].map(([title, href, text]) => (
            <article key={href} className="rounded-lg border bg-white p-4">
              <h3 className="font-bold"><Link href={href} className="text-[#0B1F3A] hover:underline">{title}</Link></h3>
              <p className="mt-1 text-sm text-slate-600">{text}</p>
            </article>
          ))}
        </div>

        <h2 className="mb-3 mt-10 text-2xl font-bold">From the blog</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {blogs.map((b) => (
            <article key={b.id} className="rounded-lg border bg-white p-4">
              {b.featured_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.featured_image} alt="" className="mb-3 h-32 w-full rounded-md object-cover" />
              )}
              <h3 className="font-bold"><Link href={pageUrl(b)} className="text-[#0B1F3A] hover:underline">{b.title}</Link></h3>
              <p className="mt-1 text-sm text-slate-600">{b.meta_description}</p>
            </article>
          ))}
        </div>

        <h2 className="mb-4 mt-10 text-2xl font-bold">FAQs</h2>
        <FaqAccordion items={FAQS.slice(0, 6)} />
        <p className="mt-3"><Link href="/faqs/" className="text-[#0B1F3A] underline">See all FAQs →</Link></p>

        <h2 className="mb-3 mt-10 text-2xl font-bold">Our promise</h2>
        <p className="text-slate-700">Zero reports always means “Unknown — No reports yet”, never a false “Safe”. We show the evidence, not just a score. And we never publish a number owner's name or address.</p>
      </main>
    </SiteChrome>
  );
}

function stripTags(html) {
  return String(html || "").replace(/<[^>]+>/g, "").trim();
}
