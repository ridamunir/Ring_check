import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  // Validates the Supabase access token (or bootstrap session) and, if
  // the access token expired, renews it from the refresh token and
  // persists the new tokens — so the panel keeps working past the
  // 1-hour Supabase JWT expiry without forcing a re-login.
  const { user } = await getSessionUser({ persistRefresh: true });
  return Boolean(user);
}

// Featured-image upload to Supabase Storage bucket "images".
// If Storage is not configured, returns a clear 503 — the URL field in the
// editor still works and saving is never blocked.
export async function POST(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase Storage not configured. Create a public bucket named "images" in Supabase, or paste an image URL in the URL field instead.' }, { status: 503 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  const admin = getSupabaseAdmin();
  const ext = (file.name || "image").split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from("images").upload(path, buf, { contentType: file.type || "image/png", upsert: false });
  if (error) return NextResponse.json({ error: `Storage upload failed: ${error.message}. Check the "images" bucket exists and is public.` }, { status: 500 });
  const { data } = admin.storage.from("images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
