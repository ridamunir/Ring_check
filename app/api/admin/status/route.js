import { NextResponse } from "next/server";
import { isDefaultPassword } from "@/lib/auth";
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

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const configured = isSupabaseConfigured();
  let dbOk = false;
  let dbError = null;
  if (configured) {
    try {
      const admin = getSupabaseAdmin();
      const { error } = await admin.from("pages").select("id", { count: "exact", head: true });
      dbOk = !error;
      dbError = error?.message || null;
    } catch (err) {
      dbError = err.message;
    }
  }
  return NextResponse.json({ configured, dbOk, dbError, defaultPassword: isDefaultPassword() });
}
