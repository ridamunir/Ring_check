import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedBlogs, getRequestLang, isConfigured } from "@/lib/data";
import { pageUrl, isLanguageEnabled } from "@/lib/languages";
import { DemoBanner } from "@/components/PublicPage";
import { SiteChrome } from "@/components/SiteChrome";

export const dynamic = "force-dynamic";

export const metadata = { title: "Blog — MyRingCheck", description: "Guides and tips about unknown numbers and scam calls." };

// Serves /blog (English) and, via middleware rewrite, /<lang>/blog.
export default async function BlogListPage() {
  const lang = getRequestLang();
  if (lang !== "en" && !(await isLanguageEnabled(lang))) notFound();
  const blogs = await getPublishedBlogs(lang);
  const homeHref = lang === "en" ? "/" : `/${lang}`;
  return (
    <SiteChrome>
    <main className="mx-auto max-w-3xl px-4 py-10">
      <DemoBanner configured={isConfigured()} />
      <h1 className="mb-6 text-3xl font-bold">Blog</h1>
      {blogs.length === 0 && <p className="text-slate-500">No blogs published yet.</p>}
      <ul className="space-y-6">
        {blogs.map((b) => (
          <li key={b.id} className="rounded-lg border bg-white p-5">
            {b.featured_image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={b.featured_image} alt={b.title || ""} className="mb-3 max-h-48 rounded-md" />
            )}
            <h2 className="text-xl font-bold"><Link href={pageUrl(b)} className="text-blue-600 hover:underline">{b.title || b.slug}</Link></h2>
            {b.meta_description && <p className="mt-1 text-slate-600">{b.meta_description}</p>}
            {b.publish_date && <p className="mt-2 text-sm text-slate-400">{new Date(b.publish_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>}
          </li>
        ))}
      </ul>
      <p className="mt-10"><Link href={homeHref} className="text-blue-600 hover:underline">← Home</Link></p>
    </main>
    </SiteChrome>
  );
}
