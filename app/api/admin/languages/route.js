import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { FALLBACK_LANGUAGES_DATA } from "@/lib/fallback";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const { user } = await getSessionUser({ persistRefresh: true });
  return Boolean(user);
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ languages: FALLBACK_LANGUAGES_DATA, configured: false });
  }
  const admin = getSupabaseAdmin();
  const { data, error } = await admin.from("languages").select("*").order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ languages: data || [], configured: true });
}

// Add a custom language (name + codes typed by the admin).
export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured — connect Supabase to save changes (see DEPLOY.md)." }, { status: 503 });
  }
  const body = await req.json().catch(() => ({}));
  const code = String(body.code || "").trim().toLowerCase();
  const name = String(body.name || "").trim();
  if (!/^[a-z]{2,3}(-[a-z]{2})?$/.test(code) || !name) {
    return NextResponse.json({ error: "Enter a language name and a valid code (e.g. es, pt-BR)." }, { status: 400 });
  }
  const short = code.split("-")[0];
  const full = body.full_code || (code.includes("-") ? code : `${short}-${short.toUpperCase()}`);
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("languages")
    .insert({
      code: short,
      full_code: full,
      name,
      og_locale: body.og_locale || full.replace("-", "_"),
      is_default: false,
      enabled: true,
      is_custom: true,
      sort_order: 99,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ language: data });
}
