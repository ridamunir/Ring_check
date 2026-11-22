
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const { user } = await getSessionUser({ persistRefresh: true });
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const admin = getSupabaseAdmin();
  if (!admin) return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  const action = req.nextUrl.pathname.endsWith("/approve") ? "approved" : "rejected";
  const { error } = await admin.from("reports").update({ status: action }).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.redirect(new URL("/admin/reports", req.url));
}
