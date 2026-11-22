import { NextResponse } from "next/server";
import {
  applyRefreshedCookies,
  getSessionUser,
  listAdminUsers,
} from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function GET() {
  const session = await getSessionUser();
  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Only an Admin can view users." },
      { status: 403 }
    );
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured — connect Supabase to manage users (see DEPLOY.md)." },
      { status: 503 }
    );
  }
  try {
    const users = await listAdminUsers();
    const res = NextResponse.json({ users: users || [] });
    return applyRefreshedCookies(res, session.refreshed);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getSessionUser();
  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Only an Admin can create a new user." },
      { status: 403 }
    );
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured — connect Supabase to manage users (see DEPLOY.md)." },
      { status: 503 }
    );
  }
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role = body.role === "editor" ? "editor" : body.role === "admin" ? "admin" : null;
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (!password || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }
  if (!role) return NextResponse.json({ error: "Role must be Admin or Editor." }, { status: 400 });

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name },
  });
  if (error || !data?.user) {
    return NextResponse.json(
      { error: error?.message || "Could not create the user." },
      { status: 400 }
    );
  }
  const { error: profileError } = await admin
    .from("admin_users")
    .upsert({ id: data.user.id, name, role }, { onConflict: "id" });
  if (profileError) {
    return NextResponse.json(
      {
        error: `The auth user was created but the profile could not be saved: ${profileError.message}. Run supabase/schema.sql (admin_users table) first, then try again.`,
      },
      { status: 500 }
    );
  }
  const res = NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      name,
      role,
      created_at: data.user.created_at,
      last_sign_in_at: null,
    },
  });
  return applyRefreshedCookies(res, session.refreshed);
}
