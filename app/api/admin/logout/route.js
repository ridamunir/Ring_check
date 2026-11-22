import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SB_ACCESS_COOKIE } from "@/lib/auth";
import { clearAllAuthCookies } from "@/lib/session";
import { isSupabaseReadable } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST() {
  // Best-effort server-side sign-out of the Supabase session (direct
  // Auth REST call with this user's token — avoids the shared anon
  // client's in-memory session state).
  const accessToken = cookies().get(SB_ACCESS_COOKIE)?.value;
  if (accessToken && isSupabaseReadable()) {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      await fetch(`${url}/auth/v1/logout`, {
        method: "POST",
        headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
      });
    } catch {
      // Logout still succeeds locally even if Supabase is unreachable.
    }
  }
  const res = NextResponse.json({ ok: true });
  return clearAllAuthCookies(res);
}
