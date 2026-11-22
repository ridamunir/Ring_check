import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { FALLBACK_PAGES } from "@/lib/fallback";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  // Validates the Supabase access token (or bootstrap session) and, if
  // the access token expired, renews it from the refresh token and
  // persists the new tokens — so the panel keeps working past the
  // 1-hour Supabase JWT expiry without forcing a re-login.
  const { user } = await getSessionUser({ persistRefresh: true });
  return Boolean(user);
}

function cleanId(id) {
  if (!id || String(id).startsWith("tmp-")) return undefined;
  return id;
}

export async function GET(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const configured = isSupabaseConfigured();
  if (!configured) {
    const pages = type ? FALLBACK_PAGES.filter((p) => p.type === type) : FALLBACK_PAGES;
    return NextResponse.json({ pages, configured: false });
  }
  const admin = getSupabaseAdmin();
  let query = admin.from("pages").select("*").order("created_at");
  if (type) query = query.eq("type", type);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pages: data || [], configured: true });
}

export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured — connect Supabase to save changes (see DEPLOY.md)." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  if (body.slug === undefined || body.slug === null) body.slug = "";
  // A slug must be unique per language: the same slug may exist in
  // English and in Spanish (different URLs), but never twice in one
  // language — the public routes could not tell them apart.
  {
    const short = String(body.language_code || "en-GB").split("-")[0].toLowerCase();
    const { data: clash } = await admin.from("pages").select("id, language_code").eq("slug", body.slug || "");
    if ((clash || []).some((r) => String(r.language_code || "en-GB").split("-")[0].toLowerCase() === short)) {
      return NextResponse.json({ error: `A page with slug "${body.slug || "(homepage)"}" already exists in this language. Use a different slug.` }, { status: 409 });
    }
  }
  const admin = getSupabaseAdmin();
  const { data: page, error } = await admin
    .from("pages")
    .insert({
      slug: body.slug,
      type: body.type || "tool",
      parent_id: body.parent_id || null,
      title: body.title || "",
      language_code: body.language_code || "en-GB",
      translation_group_id: body.translation_group_id || null,
      meta_title: body.meta_title || "",
      meta_description: body.meta_description || "",
      canonical_url: body.canonical_url || "",
      featured_image: body.featured_image || "",
      status: body.status || "draft",
      publish_date: body.publish_date || null,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // A page with no translation group starts its own group (its own id).
  if (!page.translation_group_id) {
    const { data: grouped } = await admin
      .from("pages")
      .update({ translation_group_id: page.id })
      .eq("id", page.id)
      .select()
      .single();
    if (grouped) Object.assign(page, grouped);
  }

  // Insert sections + variables in order.
  for (let si = 0; si < (body.sections || []).length; si++) {
    const sec = body.sections[si];
    const { data: section, error: secErr } = await admin
      .from("sections")
      .insert({ page_id: page.id, title: sec.title || "Section", sort_order: si })
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
