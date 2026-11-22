import { notFound, redirect } from "next/navigation";

// Cluster subpages have ONE canonical home under their hub. A bare
// /hmrc-scam-calls/ or /020/ must not render the same page twice.
const NESTED_PARENT = {
  "hmrc-scam-calls": "scam-calls",
  "bank-scam-calls": "scam-calls",
  "020": "area-code",
  "07-mobile-numbers": "area-code",
};
import { getPageBySlug, getSubPages, getTranslations, getRequestLang, isConfigured } from "@/lib/data";
import { pageMetadata, isLanguageEnabled } from "@/lib/languages";
import PublicPage, { DemoBanner } from "@/components/PublicPage";
import { SiteChrome } from "@/components/SiteChrome";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

// One route serves every language: middleware rewrites /es/<slug> to
// /<slug> with x-lang=es, so params.slug is always the page's OWN slug
// in the request language (translated slugs included).
async function load(params) {
  const lang = getRequestLang();
  if (lang !== "en" && !(await isLanguageEnabled(lang))) return null;
  const page = await getPageBySlug(params.slug, lang);
  if (!page || page.status !== "published" || page.type === "blog") return null;
  return { page, lang };
}

export async function generateMetadata({ params }) {
  const found = await load(params);
  if (!found) return { title: "Not found" };
  const translations = await getTranslations(found.page.translation_group_id || found.page.id);
  return pageMetadata(found.page, translations, BASE);
}

export default async function SlugPage({ params }) {
  const nested = NESTED_PARENT[params.slug];
  if (nested) redirect(`/${nested}/${params.slug}/`);
  const found = await load(params);
  if (!found) notFound();
  const { page, lang } = found;
  const subPages = page.type === "hub" || page.type === "pillar" ? await getSubPages(page.id, lang) : [];
  return (
    <SiteChrome>
      <PublicPage
        page={page}
        subPages={subPages}
        demoBanner={<DemoBanner configured={isConfigured()} />}
        homeHref={lang === "en" ? "/" : `/${lang}`}
      />
    </SiteChrome>
  );
}
