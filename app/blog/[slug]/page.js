import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageBySlug, getTranslations, getRequestLang, isConfigured } from "@/lib/data";
import { SiteChrome } from "@/components/SiteChrome";
import { pageMetadata, isLanguageEnabled } from "@/lib/languages";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export async function generateMetadata({ params }) {
  const lang = getRequestLang();
  const page = await getPageBySlug(params.slug, lang);
  if (!page || page.type !== "blog" || page.status !== "published") return { title: "Not found" };
  const translations = await getTranslations(page.translation_group_id || page.id);
  return pageMetadata(page, translations, BASE);
}

export default async function BlogPostPage({ params }) {
  const lang = getRequestLang();
  if (lang !== "en" && !(await isLanguageEnabled(lang))) notFound();
  const page = await getPageBySlug(params.slug, lang);
  if (!page || page.type !== "blog" || page.status !== "published") notFound();
  return (
    <SiteChrome>
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1>{page.title}</h1>
      {!isConfigured() && (
        <div className="mb-6 rounded-md bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
          Demo data — connect Supabase to save changes
        </div>
      )}
      {page.featured_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={page.featured_image} alt={page.title || ""} className="mb-6 max-h-72 rounded-lg" />
      )}
      {page.publish_date && <p className="mb-2 text-sm text-slate-400">{new Date(page.publish_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>}
      {page.sections?.length ? (
        page.sections.map((section) => (
          <section key={section.id} className="mb-8">
            {section.variables.map((v) => (
              <div key={v.id} className="content-html" dangerouslySetInnerHTML={{ __html: v.value_html || "" }} />
            ))}
          </section>
        ))
      ) : (
        <div className="content-html"><h1>{page.title}</h1></div>
      )}
      <p className="mt-10"><Link href={lang === "en" ? "/blog" : `/${lang}/blog`} className="text-blue-600 hover:underline">← All blogs</Link></p>
    </main>
    </SiteChrome>
  );
}
