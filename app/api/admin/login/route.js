import { NextResponse } from "next/server";
import {
  bootstrapAllowed,
  makeSessionToken,
  verifyAdminPassword,
} from "@/lib/auth";
import { setBootstrapCookies, setLoginCookies } from "@/lib/session";
import { getSupabase, isSupabaseReadable } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Public (no auth) — lets the login page show "Supabase not connected".
export async function GET() {
  return NextResponse.json({ configured: isSupabaseReadable() });
}

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are both required." },
      { status: 400 }
    );
  }

  if (!isSupabaseReadable()) {
    return NextResponse.json(
      { error: "Supabase not configured — connect Supabase (see DEPLOY.md)." },
      { status: 503 }
    );
  }

  // 1) Normal login: Supabase Auth email + password.
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (!error && data?.session) {
      const res = NextResponse.json({ ok: true });
      return setLoginCookies(res, data.session);
    }
  }

  // 2) Bootstrap fallback ONLY: ADMIN_PASSWORD set AND no admin_users row
  // exists at all. Any email + ADMIN_PASSWORD logs in as a temporary
  // bootstrap admin so the first real user can be created in Users.
  if (await verifyAdminPassword(password)) {
    if (await bootstrapAllowed()) {
      const token = await makeSessionToken(password);
      const res = NextResponse.json({ ok: true, bootstrap: true });
      return setBootstrapCookies(res, email, token);
    }
  }

  return NextResponse.json(
    { error: "Wrong email or password" },
    { status: 401 }
  );
}
