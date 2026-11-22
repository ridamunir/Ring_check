import Link from "next/link";
import { pageUrl } from "@/lib/languages";

// Shared public rendering for a content page in any language.
export default function PublicPage({ page, subPages = [], demoBanner, homeHref, homeLabel = "← Home" }) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {demoBanner}
      {page.sections?.length ? (
        page.sections.map((section) => (
          <section key={section.id} className="mb-8">
            {section.variables.map((v) => (
              <div key={v.id} className="content-html" dangerouslySetInnerHTML={{ __html: v.value_html || "" }} />
            ))}
          </section>
        ))
      ) : (
        <div className="content-html">
          <h1>{page.title || page.slug}</h1>
          <p>Content coming soon.</p>
        </div>
      )}
      {subPages.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-xl font-bold">In this guide</h2>
          <ul className="space-y-1">
            {subPages.filter((p) => p.status === "published").map((sp) => (
              <li key={sp.id}>
                <Link href={pageUrl(sp)} className="text-blue-600 hover:underline">{sp.title || sp.slug}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="mt-10"><Link href={homeHref} className="text-blue-600 hover:underline">{homeLabel}</Link></p>
    </main>
  );
}

export function DemoBanner({ configured }) {
  if (configured) return null;
  return (
    <div className="mb-6 rounded-md bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
      Demo data — connect Supabase to save changes
    </div>
  );
}
