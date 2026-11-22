
import { getPublishedPages, getTranslations } from "@/lib/data";
import { pageUrl, hreflangEntries } from "@/lib/languages";
import { getIndexableNumbers } from "@/lib/tool-data";

export const dynamic = "force-dynamic";

const STATIC_URLS = [
  "/", "/about-us/", "/contact-us/", "/faqs/", "/how-it-works/", "/spam-score/",
  "/report-a-number/", "/privacy-policy/", "/terms-and-conditions/", "/disclaimer/",
  "/cookie-policy/", "/top-reported-numbers/", "/latest-reports/", "/reverse-phone-lookup/",
  "/scam-calls/", "/scam-calls/hmrc-scam-calls/", "/scam-calls/bank-scam-calls/",
  "/area-codes/", "/area-code/020/", "/area-code/07-mobile-numbers/",
  "/report-scam-call-uk/", "/blog/",
];

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  const pages = await getPublishedPages();
  const entries = [];
  for (const p of pages) {
    const translations = await getTranslations(p.translation_group_id || p.id);
    const langs = {};
    for (const e of hreflangEntries(p, translations, base)) langs[e.hreflang] = e.href;
    // Canonical form uses a trailing slash (trailingSlash: true site-wide).
    let u = pageUrl(p, base);
    if (!u.endsWith("/")) u += "/";
    entries.push({ url: u, lastModified: p.updated_at || p.publish_date || new Date(), alternates: { languages: langs } });
  }
  for (const u of STATIC_URLS) {
    if (!entries.some((e) => e.url === base + u)) {
      entries.push({ url: base + u, lastModified: new Date() });
    }
  }
  // Only INDEXABLE number pages enter the sitemap: 1 approved report OR 5+ searches.
  const numbers = await getIndexableNumbers();
  for (const n of numbers) entries.push({ url: `${base}/number/${n.number}/`, lastModified: new Date() });
  return entries;
}
