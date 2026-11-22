import PageEditor from "@/components/PageEditor";
import { getAllPages, isConfigured } from "@/lib/data";
import { getLanguages } from "@/lib/languages";

export const dynamic = "force-dynamic";

export default async function NewBlog() {
  const parents = await getAllPages();
  const languages = await getLanguages();
  const initialPage = {
    slug: "",
    type: "blog",
    parent_id: "",
    title: "",
    language_code: "en-GB",
    translation_group_id: "",
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    featured_image: "",
    status: "draft",
    publish_date: "",
    sections: [{ id: "tmp-blog-1", title: "Blog Content", sort_order: 0, variables: [{ id: "tmp-blog-v1", name: "blog_content", value_html: "", sort_order: 0 }] }],
  };
  return <PageEditor initialPage={initialPage} isNew parents={parents} configured={isConfigured()} languages={languages} allPages={parents} />;
}
