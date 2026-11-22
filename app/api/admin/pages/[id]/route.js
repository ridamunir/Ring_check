import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getFallbackPageById } from "@/lib/fallback";
import { getPageWithContent } from "@/lib/data";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  // Validates the Supabase access token (or bootstrap session) and, if
  // the access token expired, renews it from the refresh token and
  // persists the new tokens — so the panel keeps working past the
  // 1-hour Supabase JWT expiry without forcing a re-login.
  const { user } = await getSessionUser({ persistRefresh: true });
  return Boolean(user);
}

export async function GET(req, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const page = await getPageWithContent(params.id);
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 });
  return NextResponse.json({ page, configured: isSupabaseConfigured() });
}

export async function PUT(req, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured — connect Supabase to save changes (see DEPLOY.md)." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const admin = getSupabaseAdmin();

  // Homepage slug can never change.
  const { data: existing } = await admin.from("pages").select("slug, language_code, translation_group_id").eq("id", params.id).single();
  const slug = existing?.slug === "" ? "" : body.slug ?? existing?.slug ?? "";
  // Slug must stay unique per language (same rule as on create).
  {
    const langCode = body.language_code || existing?.language_code || "en-GB";
    const short = String(langCode).split("-")[0].toLowerCase();
    const { data: clash } = await admin.from("pages").select("id, language_code").eq("slug", slug);
    if ((clash || []).some((r) => r.id !== params.id && String(r.language_code || "en-GB").split("-")[0].toLowerCase() === short)) {
      return NextResponse.json({ error: `A page with slug "${slug || "(homepage)"}" already exists in this language. Use a different slug.` }, { status: 409 });
    }
  }

  const { data: page, error } = await admin
    .from("pages")
    .update({
      slug,
      type: body.type || "tool",
      parent_id: body.parent_id || null,
      title: body.title || "",
      language_code: body.language_code || "en-GB",
      translation_group_id: body.translation_group_id || existing?.translation_group_id || params.id,
      meta_title: body.meta_title || "",
      meta_description: body.meta_description || "",
      canonical_url: body.canonical_url || "",
      featured_image: body.featured_image || "",
      status: body.status || "draft",
      publish_date: body.publish_date || null,
    })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Delete-and-reinsert sections + variables in sort order.
  const { data: oldSections } = await admin.from("sections").select("id").eq("page_id", params.id);
  const oldIds = (oldSections || []).map((s) => s.id);
  if (oldIds.length) await admin.from("variables").delete().in("section_id", oldIds);
  await admin.from("sections").delete().eq("page_id", params.id);

  for (let si = 0; si < (body.sections || []).length; si++) {
    const sec = body.sections[si];
    const { data: section, error: secErr } = await admin
      .from("sections")
      .insert({ page_id: params.id, title: sec.title || "Section", sort_order: si })
      .select()
      .single();
    if (secErr) return NextResponse.json({ error: secErr.message }, { status: 500 });
    for (let vi = 0; vi < (sec.variables || []).length; vi++) {
      const v = sec.variables[vi];
      if (!v.name && !v.value_html) continue;
      const { error: varErr } = await admin.from("variables").insert({
        section_id: section.id,
        name: v.name || `variable_${vi + 1}`,
        value_html: v.value_html || "",
        sort_order: vi,
      });
      if (varErr) return NextResponse.json({ error: varErr.message }, { status: 500 });
    }
  }
  return NextResponse.json({ page });
}

export async function DELETE(req, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured — connect Supabase to delete." }, { status: 503 });
  }
  const admin = getSupabaseAdmin();
  const { data: existing } = await admin.from("pages").select("slug, type").eq("id", params.id).single();
  if (existing?.slug === "") {
    return NextResponse.json({ error: "The homepage cannot be deleted — it is delete-locked." }, { status: 403 });
  }
  // Editors cannot delete foundational pages — Admin only.
  if (existing?.type === "foundational") {
    const { user } = await getSessionUser();
    if (user && user.role === "editor") {
      return NextResponse.json({ error: "Editors cannot delete foundational pages — Admin only." }, { status: 403 });
    }
  }
  const { error } = await admin.from("pages").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
