import { notFound } from "next/navigation";
import PageEditor from "@/components/PageEditor";
import { getAllPages, getPageWithContent, isConfigured } from "@/lib/data";
import { getLanguages } from "@/lib/languages";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export default async function EditBlog({ params }) {
  const page = await getPageWithContent(params.id);
  if (!page || page.type !== "blog") notFound();
  const parents = await getAllPages();
  const languages = await getLanguages();
  // Ensure a Blog Content section exists so the main-content TinyMCE is visible.
  if (!page.sections?.some((s) => s.title === "Blog Content")) {
    page.sections = [...(page.sections || []), { id: `tmp-blog-${page.id}`, title: "Blog Content", sort_order: (page.sections || []).length, variables: [{ id: `tmp-blog-v-${page.id}`, name: "blog_content", value_html: "", sort_order: 0 }] }];
  }
  return <PageEditor initialPage={page} isNew={false} parents={parents} configured={isConfigured()} languages={languages} allPages={parents} />;
}
