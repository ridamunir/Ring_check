import { NextResponse } from "next/server";
import {
  applyRefreshedCookies,
  getAdminUserById,
  getSessionUser,
} from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// POST /api/admin/users/[id]/password
// Admin can change any user's password; a user can change their OWN
// password; an Editor cannot change anyone else's.
export async function POST(req, { params }) {
  const session = await getSessionUser();
  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });
  }
  const isSelf = session.user.id === params.id;
  const isAdmin = session.user.role === "admin";
  if (!isAdmin && !isSelf) {
    return NextResponse.json(
      { error: "Only an Admin, or the user themselves, can change this password." },
      { status: 403 }
    );
  }
  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";
  const confirm = typeof body.confirm === "string" ? body.confirm : "";
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }
  if (confirm && password !== confirm) {
    return NextResponse.json(
      { error: "Password and confirm password do not match." },
      { status: 400 }
    );
  }
  const target = await getAdminUserById(params.id);
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  const admin = getSupabaseAdmin();
  const { error } = await admin.auth.admin.updateUserById(params.id, {
    password,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const res = NextResponse.json({ ok: true });
  return applyRefreshedCookies(res, session.refreshed);
}
