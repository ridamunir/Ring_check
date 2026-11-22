import { NextResponse } from "next/server";
import {
  applyRefreshedCookies,
  countAdmins,
  getAdminUserById,
  getSessionUser,
} from "@/lib/session";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GET one user — Admin only (or the user themself, for the edit page).
export async function GET(req, { params }) {
  const session = await getSessionUser();
  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const isSelf = session.user.id === params.id;
  if (session.user.role !== "admin" && !isSelf) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });
  }
  const user = await getAdminUserById(params.id);
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  const res = NextResponse.json({ user });
  return applyRefreshedCookies(res, session.refreshed);
}

// PATCH — Admin can change name/email/role of anyone. An Editor may edit
// ONLY their own name (not email, not role).
export async function PATCH(req, { params }) {
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
      { error: "You can only edit your own profile." },
      { status: 403 }
    );
  }
  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : undefined;
  const email = typeof body.email === "string" ? body.email.trim() : undefined;
  const role = body.role;

  if (!isAdmin) {
    // Editor, own profile: name only.
    if (email !== undefined || role !== undefined) {
      return NextResponse.json(
        { error: "An Editor cannot change their own email or role — Admin only." },
        { status: 403 }
      );
    }
    if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  } else {
    if (name !== undefined && !name) {
      return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
    }
    if (email !== undefined && !isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (role !== undefined && role !== "admin" && role !== "editor") {
      return NextResponse.json({ error: "Role must be Admin or Editor." }, { status: 400 });
    }
  }

  const admin = getSupabaseAdmin();
  const target = await getAdminUserById(params.id);
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });

  // Email change goes through Supabase Auth.
  if (isAdmin && email !== undefined && email !== target.email) {
    const { error } = await admin.auth.admin.updateUserById(params.id, { email });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
  // Name/role live in the admin_users profile table. When an Admin edits
  // a user who has no profile row yet, keep their current (default) role
  // instead of silently downgrading them to the 'editor' column default.
  const patch = {};
  if (name !== undefined) patch.name = name;
  if (isAdmin) patch.role = role !== undefined ? role : target.role;
  if (Object.keys(patch).length) {
    const { error } = await admin.from("admin_users").upsert(
      { id: params.id, ...patch },
      { onConflict: "id" }
    );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  // Keep auth user_metadata name in sync (nice for Supabase Dashboard).
  if (name !== undefined) {
    await admin.auth.admin.updateUserById(params.id, {
      user_metadata: { name },
    });
  }
  const updated = await getAdminUserById(params.id);
  const res = NextResponse.json({ user: updated });
  return applyRefreshedCookies(res, session.refreshed);
}

// DELETE — Admin only. Cannot delete yourself, cannot delete the last
// remaining Admin.
export async function DELETE(req, { params }) {
  const session = await getSessionUser();
  if (!session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Only an Admin can delete a user." },
      { status: 403 }
    );
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase not configured." }, { status: 503 });
  }
  if (session.user.id === params.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account." },
      { status: 400 }
    );
  }
  const target = await getAdminUserById(params.id);
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (target.role === "admin") {
    const adminCount = await countAdmins();
    if (adminCount !== null && adminCount <= 1) {
      return NextResponse.json(
        { error: "The last Admin cannot be deleted — make another user an Admin first." },
        { status: 400 }
      );
    }
  }
  const admin = getSupabaseAdmin();
  const { error } = await admin.auth.admin.deleteUser(params.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  // Profile row is also removed by the ON DELETE CASCADE, but delete
  // explicitly in case the profile was created without the FK.
  await admin.from("admin_users").delete().eq("id", params.id);
  const res = NextResponse.json({ ok: true });
  return applyRefreshedCookies(res, session.refreshed);
}
