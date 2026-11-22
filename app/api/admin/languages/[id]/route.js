import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const { user } = await getSessionUser({ persistRefresh: true });
  return Boolean(user);
}

// Enable / disable a language. The default language cannot be disabled.
export async function PUT(req, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured — connect Supabase to save changes (see DEPLOY.md)." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const admin = getSupabaseAdmin();
  const { data: existing } = await admin.from("languages").select("*").eq("id", params.id).single();
  if (!existing) return NextResponse.json({ error: "Language not found" }, { status: 404 });
  if (existing.is_default && body.enabled === false) {
    return NextResponse.json({ error: "The default language cannot be disabled." }, { status: 403 });
  }
  const { data, error } = await admin
    .from("languages")
    .update({ enabled: body.enabled !== undefined ? Boolean(body.enabled) : existing.enabled })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ language: data });
}

// Delete a custom language. Predefined and default languages cannot be deleted.
export async function DELETE(req, { params }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured — connect Supabase to delete." }, { status: 503 });
  }
  const admin = getSupabaseAdmin();
  const { data: existing } = await admin.from("languages").select("*").eq("id", params.id).single();
  if (!existing) return NextResponse.json({ error: "Language not found" }, { status: 404 });
  if (!existing.is_custom || existing.is_default) {
    return NextResponse.json({ error: "Only custom languages can be deleted. Predefined languages can be disabled instead." }, { status: 403 });
  }
  const { error } = await admin.from("languages").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
