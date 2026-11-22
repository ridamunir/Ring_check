// Server-only session helpers (Node runtime). Uses next/headers cookies()
// and the Supabase JS clients — do NOT import this file from middleware.js
// (middleware imports lib/auth.js only, which is Edge-safe).
import { cookies } from "next/headers";
import {
  BOOTSTRAP_COOKIE,
  BOOTSTRAP_EMAIL_COOKIE,
  COOKIE_MAX_AGE,
  SB_ACCESS_COOKIE,
  SB_REFRESH_COOKIE,
  SESSION_COOKIE,
  getSessionUserFromTokens,
  getUserProfile,
} from "@/lib/auth";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

// Resolve the logged-in user from the request cookies.
// Returns { user, refreshed } — `refreshed` is null, or
// { accessToken, refreshToken } when the expired access token was renewed
// with the refresh token.
// - Route handlers: pass { persistRefresh: true } — the renewed tokens
//   are written back to the browser via next/headers cookies().set(),
//   which is allowed in Route Handlers, so sessions survive the 1-hour
//   Supabase JWT expiry without forcing a re-login.
// - Server Components: use the default (no persist) — components cannot
//   set cookies; they just use `user` for that render, and the next
//   request refreshes again from the still-valid refresh token.
export async function getSessionUser(options = {}) {
  const persistRefresh = options.persistRefresh === true;
  const jar = cookies();
  const accessToken = jar.get(SB_ACCESS_COOKIE)?.value;
  const refreshToken = jar.get(SB_REFRESH_COOKIE)?.value;

  let user = await getSessionUserFromTokens({
    accessToken,
    bootstrapToken: jar.get(SESSION_COOKIE)?.value,
    bootstrapEmail: jar.get(BOOTSTRAP_EMAIL_COOKIE)?.value,
  });
  if (user) return { user, refreshed: null };

  // Access token expired/invalid but we have a refresh token — try once.
  if (accessToken && refreshToken) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: refreshToken,
        });
        if (!error && data?.session?.access_token && data?.user) {
          const profile = await getUserProfile(data.user.id);
          const refreshed = {
            accessToken: data.session.access_token,
            refreshToken: data.session.refresh_token,
          };
          if (persistRefresh) {
            jar.set(SB_ACCESS_COOKIE, refreshed.accessToken, COOKIE_OPTS);
            if (refreshed.refreshToken) {
              jar.set(SB_REFRESH_COOKIE, refreshed.refreshToken, COOKIE_OPTS);
            }
          }
          return {
            user: {
              id: data.user.id,
              email: data.user.email || "",
              name: profile?.name || data.user.email || "",
              role: profile?.role || "admin",
              bootstrap: false,
            },
            refreshed,
          };
        }
      } catch {
        // fall through -> unauthenticated
      }
    }
  }
  return { user: null, refreshed: null };
}

// Set the new tokens from a refresh onto a NextResponse.
export function applyRefreshedCookies(res, refreshed) {
  if (!refreshed) return res;
  res.cookies.set(SB_ACCESS_COOKIE, refreshed.accessToken, COOKIE_OPTS);
  if (refreshed.refreshToken) {
    res.cookies.set(SB_REFRESH_COOKIE, refreshed.refreshToken, COOKIE_OPTS);
  }
  return res;
}

// Set Supabase session cookies after a successful login.
export function setLoginCookies(res, session) {
  res.cookies.set(SB_ACCESS_COOKIE, session.access_token, COOKIE_OPTS);
  if (session.refresh_token) {
    res.cookies.set(SB_REFRESH_COOKIE, session.refresh_token, COOKIE_OPTS);
  }
  clearBootstrapCookies(res);
  return res;
}

// Set bootstrap-mode cookies after a bootstrap login.
export function setBootstrapCookies(res, email, token) {
  res.cookies.set(SESSION_COOKIE, token, COOKIE_OPTS);
  res.cookies.set(BOOTSTRAP_COOKIE, "1", COOKIE_OPTS);
  if (email) res.cookies.set(BOOTSTRAP_EMAIL_COOKIE, email, COOKIE_OPTS);
  res.cookies.set(SB_ACCESS_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  res.cookies.set(SB_REFRESH_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  return res;
}

export function clearBootstrapCookies(res) {
  res.cookies.set(SESSION_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  res.cookies.set(BOOTSTRAP_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  res.cookies.set(BOOTSTRAP_EMAIL_COOKIE, "", { ...COOKIE_OPTS, maxAge: 0 });
  return res;
}

export function clearAllAuthCookies(res) {
  for (const name of [
    SB_ACCESS_COOKIE,
    SB_REFRESH_COOKIE,
    SESSION_COOKIE,
    BOOTSTRAP_COOKIE,
    BOOTSTRAP_EMAIL_COOKIE,
  ]) {
    res.cookies.set(name, "", { ...COOKIE_OPTS, maxAge: 0 });
  }
  return res;
}

// Admin users list: auth users (email, created, last sign-in) merged with
// public.admin_users profiles (name, role). Service-role only.
export async function listAdminUsers() {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data: authData, error } = await admin.auth.admin.listUsers();
  if (error) throw new Error(error.message);
  const { data: profiles } = await admin
    .from("admin_users")
    .select("id, name, role, created_at");
  const byId = new Map((profiles || []).map((p) => [p.id, p]));
  return (authData?.users || []).map((u) => {
    const p = byId.get(u.id);
    return {
      id: u.id,
      email: u.email || "",
      name: p?.name || u.user_metadata?.name || "",
      role: p?.role || "admin",
      created_at: u.created_at || p?.created_at || null,
      last_sign_in_at: u.last_sign_in_at || null,
      hasProfile: Boolean(p),
    };
  });
}

// One admin user (auth + profile) by id, or null.
export async function getAdminUserById(id) {
  const admin = getSupabaseAdmin();
  if (!admin) return null;
  const { data, error } = await admin.auth.admin.getUserById(id);
  if (error || !data?.user) return null;
  const profile = await getUserProfile(id);
  const u = data.user;
  return {
    id: u.id,
    email: u.email || "",
    name: profile?.name || u.user_metadata?.name || "",
    role: profile?.role || "admin",
    created_at: u.created_at || null,
    last_sign_in_at: u.last_sign_in_at || null,
  };
}

// Count users with role 'admin' (profile rows; auth users without a
// profile row default to admin — see getCurrentUserRole — so count those
// too when the profile table has no row for them).
export async function countAdmins() {
  const users = await listAdminUsers();
  if (!users) return null;
  return users.filter((u) => u.role === "admin").length;
}
