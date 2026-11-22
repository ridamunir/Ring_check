import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getPageWithContent, getEnabledLanguages } from "@/lib/data";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const { user } = await getSessionUser({ persistRefresh: true });
  return Boolean(user);
}

function short(code) {
  return String(code || "en-GB").split("-")[0].toLowerCase();
}

// POST /api/admin/pages/[id]/duplicate { language_code }
// "Duplicate / Translate from English": creates a new draft page in the
// requested language, linked to the source by translation_group_id.
// Structure only — sections and variable NAMES are copied; every value
// is left EMPTY so Nomi translates the content by hand. English text is
// never copied over as the other language's content. No auto-translation.
export async function POST(req, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured — connect Supabase to save changes (see DEPLOY.md)." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const targetShort = short(body.language_code);
  if (!targetShort || targetShort === "en") {
    return NextResponse.json({ error: "Pick a non-English language to translate into." }, { status: 400 });
  }
  const enabled = await getEnabledLanguages();
  const target = enabled.find((l) => l.code === targetShort);
  if (!target) {
    return NextResponse.json({ error: `Language "${targetShort}" is not enabled. Enable it in Settings → Languages first.` }, { status: 400 });
  }

  const source = await getPageWithContent(params.id);
  if (!source) return NextResponse.json({ error: "Source page not found" }, { status: 404 });
  const groupId = source.translation_group_id || source.id;

  const admin = getSupabaseAdmin();
  const { data: groupPages } = await admin.from("pages").select("id, language_code").eq("translation_group_id", groupId);
  if ((groupPages || []).some((r) => short(r.language_code) === targetShort)) {
    return NextResponse.json({ error: `A ${target.name} version of this page already exists — open it from the translations list instead.` }, { status: 409 });
  }

  // If the source is a sub-page, point the copy at the parent's version
  // in the same language (when it exists); otherwise keep the parent.
  let newParentId = source.parent_id || null;
  if (newParentId) {
    const { data: parent } = await admin.from("pages").select("id, translation_group_id").eq("id", newParentId).single();
    if (parent) {
      const { data: parentTrans } = await admin.from("pages").select("id, language_code").eq("translation_group_id", parent.translation_group_id || parent.id);
      const match = (parentTrans || []).find((r) => short(r.language_code) === targetShort);
      if (match) newParentId = match.id;
    }
  }

  const { data: page, error } = await admin
    .from("pages")
    .insert({
      slug: "",
      type: source.type || "tool",
      parent_id: newParentId,
      title: "",
      language_code: target.full_code,
      translation_group_id: groupId,
      meta_title: "",
      meta_description: "",
      canonical_url: "",
      featured_image: source.featured_image || "",
      status: "draft",
      publish_date: null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  for (let si = 0; si < (source.sections || []).length; si++) {
    const sec = source.sections[si];
    const { data: section, error: secErr } = await admin
      .from("sections")
      .insert({ page_id: page.id, title: sec.title || "Section", sort_order: si })
      .select()
      .single();
    if (secErr) return NextResponse.json({ error: secErr.message }, { status: 500 });
    for (let vi = 0; vi < (sec.variables || []).length; vi++) {
      const v = sec.variables[vi];
      if (!v.name) continue;
      const { error: varErr } = await admin.from("variables").insert({
        section_id: section.id,
        name: v.name,
        value_html: "", // empty on purpose — translate by hand
        sort_order: vi,
      });
      if (varErr) return NextResponse.json({ error: varErr.message }, { status: 500 });
    }
  }

  return NextResponse.json({ page });
}
