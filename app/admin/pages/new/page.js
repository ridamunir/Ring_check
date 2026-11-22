import PageEditor from "@/components/PageEditor";
import { getAllPages, isConfigured } from "@/lib/data";
import { getLanguages } from "@/lib/languages";

export const dynamic = "force-dynamic";

export default async function NewPage({ searchParams }) {
  const parents = await getAllPages();
  const languages = await getLanguages();
  const preset = searchParams?.type === "subpage" || searchParams?.type === "blog" || searchParams?.type === "hub" || searchParams?.type === "pillar" || searchParams?.type === "foundational" || searchParams?.type === "tool"
    ? searchParams.type
    : "tool";
  // PageEditor starts from an empty page; preset type/parent via initialPage:
  const initialPage = {
    slug: "",
    type: preset,
    parent_id: searchParams?.parent || "",
    title: "",
    language_code: "en-GB",
    translation_group_id: "",
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    featured_image: "",
    status: "draft",
    publish_date: "",
    sections: [{ id: "tmp-new-1", title: preset === "blog" ? "Blog Content" : "Hero Section", sort_order: 0, variables: [{ id: "tmp-new-v1", name: preset === "blog" ? "blog_content" : "hero_heading", value_html: "", sort_order: 0 }] }],
  };
  return <PageEditor initialPage={initialPage} isNew parents={parents} configured={isConfigured()} languages={languages} allPages={parents} />;
}
