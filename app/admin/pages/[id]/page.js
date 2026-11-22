import { notFound } from "next/navigation";
import PageEditor from "@/components/PageEditor";
import { getAllPages, getPageWithContent, getSubPages, isConfigured } from "@/lib/data";
import { getLanguages } from "@/lib/languages";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export default async function EditPage({ params }) {
  const page = await getPageWithContent(params.id);
  if (!page) notFound();
  const parents = await getAllPages();
  const languages = await getLanguages();
  const subPages = page.type === "hub" || page.type === "pillar" ? await getSubPages(page.id) : [];
  return <PageEditor initialPage={page} isNew={false} parents={parents} subPages={subPages} configured={isConfigured()} languages={languages} allPages={parents} />;
}
