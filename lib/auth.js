// Auth: Supabase Auth email + password is the login (see DEPLOY.md).
// Sessions are Supabase JWTs stored in httpOnly cookies (sb-access-token /
// sb-refresh-token, 7 days). A bootstrap fallback exists ONLY until the
// first real admin user is created — see bootstrapAllowed() below.
//
// This file is EDGE-SAFE: it is imported by middleware.js, so it must NOT
// import "next/headers" or any Node-only module. Supabase user validation
// is done with plain fetch() against the Auth REST endpoint — the same
// endpoint supabase-js `auth.getUser()` calls. Cookie *reading* is done by
// the caller (middleware passes req.cookies, routes pass next/headers
// cookies()); both expose `.get(name)?.value`, so helpers here accept a
// generic cookie jar. Cookie *writing* lives in the route handlers
// (lib/session.js) — never here.

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SB_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

// --- Cookie names -------------------------------------------------------
export const SESSION_COOKIE = "admin_session"; // bootstrap hash token (compat name, kept)
export const SB_ACCESS_COOKIE = "sb-access-token";
export const SB_REFRESH_COOKIE = "sb-refresh-token";
export const BOOTSTRAP_COOKIE = "admin_bootstrap"; // "1" while in bootstrap mode
export const BOOTSTRAP_EMAIL_COOKIE = "admin_bootstrap_email";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "";
}

export function isDefaultPassword() {
  // True when no ADMIN_PASSWORD is set at all. In the new model this is
  // NOT a security hole by itself (password-only login no longer exists);
  // it only means the bootstrap fallback is unavailable. The dashboard
  // uses it together with isBootstrapMode() for its warning banner.
  return !process.env.ADMIN_PASSWORD;
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// --- Bootstrap (ADMIN_PASSWORD) helpers ---------------------------------
// Bootstrap is a one-time ladder: it works ONLY while the admin_users
// table is completely empty AND ADMIN_PASSWORD is set. As soon as the
// first real admin exists, bootstrap stops working — even if
// ADMIN_PASSWORD is still set in Vercel. Remove ADMIN_PASSWORD after
// creating the first admin (see DEPLOY.md).

export async function verifyAdminPassword(password) {
  const adminPassword = getAdminPassword();
  if (!adminPassword || typeof password !== "string") return false;
  return constantTimeEqual(password, adminPassword);
}

export async function makeSessionToken(password) {
  return sha256Hex(password);
}

export async function verifyBootstrapToken(token) {
  const adminPassword = getAdminPassword();
  if (!adminPassword || !token) return false;
  const expected = await sha256Hex(adminPassword);
  return constantTimeEqual(token, expected);
}

// Is the bootstrap ladder currently open? Fail CLOSED: if Supabase is
// not configured, ADMIN_PASSWORD is unset, or the admin_users check
// errors (e.g. table does not exist yet), bootstrap is NOT allowed.
export async function bootstrapAllowed() {
  if (!getAdminPassword()) return false;
  if (!SB_URL || !SB_SERVICE) return false;
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/admin_users?select=id&limit=1`,
      {
        headers: {
          apikey: SB_SERVICE,
          Authorization: `Bearer ${SB_SERVICE}`,
        },
      }
    );
    if (!res.ok) return false; // table missing / RLS / network -> fail closed
    const rows = await res.json().catch(() => null);
    if (!Array.isArray(rows)) return false;
    return rows.length === 0;
  } catch {
    return false;
  }
}

// --- Supabase Auth token validation (via Auth REST API) ------------------

export function isSupabaseAuthConfigured() {
  return Boolean(SB_URL && SB_ANON);
}

// Validate a Supabase access token. Returns { id, email } or null.
export async function getCurrentUser(accessToken) {
  if (!accessToken || !isSupabaseAuthConfigured()) return null;
  try {
    const res = await fetch(`${SB_URL}/auth/v1/user`, {
      headers: { apikey: SB_ANON, Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    const user = await res.json().catch(() => null);
    if (!user?.id) return null;
    return { id: user.id, email: user.email || "" };
  } catch {
    return null;
  }
}

// Read name/role from the public.admin_users profile table (service key,
// PostgREST). Returns { name, role } or null when no profile row exists.
export async function getUserProfile(userId) {
  if (!userId || !SB_URL || !SB_SERVICE) return null;
  try {
    const res = await fetch(
      `${SB_URL}/rest/v1/admin_users?select=name,role&id=eq.${encodeURIComponent(userId)}`,
      {
        headers: {
          apikey: SB_SERVICE,
          Authorization: `Bearer ${SB_SERVICE}`,
        },
      }
    );
    if (!res.ok) return null;
    const rows = await res.json().catch(() => null);
    if (!Array.isArray(rows) || !rows.length) return null;
    return { name: rows[0].name || "", role: rows[0].role || "editor" };
  } catch {
    return null;
  }
}

// Role for a user id. Default is 'admin' when no profile row exists yet
// (first user / legacy user created before profiles existed).
export async function getCurrentUserRole(userId) {
  const profile = await getUserProfile(userId);
  return profile?.role || "admin";
}

// --- Combined session ----------------------------------------------------
// `jar` is any cookie store with `.get(name)?.value` (middleware's
// req.cookies and next/headers cookies() both qualify).

export function pickToken(jar) {
  if (!jar) return null;
  return (
    jar.get(SB_ACCESS_COOKIE)?.value ||
    jar.get(SESSION_COOKIE)?.value ||
    null
  );
}

// Presence-only check for middleware (Edge). It does NOT validate the
// token — the real validity check happens in each server route / server
// component via getCurrentUser()/verifySessionToken(). Middleware cannot
// reliably call supabase.auth.getUser on Edge, so presence here + real
// validation in the route is the correct split.
export function hasSessionCookie(jar) {
  if (!jar) return false;
  return Boolean(
    jar.get(SB_ACCESS_COOKIE)?.value || jar.get(SESSION_COOKIE)?.value
  );
}

// Full session check, kept under the old export name so existing routes
// keep working: returns true if the token is a valid Supabase access
// token OR a valid bootstrap token.
export async function verifySessionToken(token) {
  if (!token) return false;
  if (await verifyBootstrapToken(token)) return true;
  const user = await getCurrentUser(token);
  return Boolean(user);
}

// Is this request in bootstrap mode? (admin_bootstrap=1 + valid hash.)
export async function isBootstrapSession(jar) {
  if (!jar) return false;
  if (jar.get(BOOTSTRAP_COOKIE)?.value !== "1") return false;
  return verifyBootstrapToken(jar.get(SESSION_COOKIE)?.value);
}

// Resolve the logged-in user from cookies.
// Returns { id, email, name, role, bootstrap } or null.
// `tokens` may be { accessToken, bootstrapToken, bootstrapEmail } —
// callers that already read cookies pass the values; server components
// and routes build them from their cookie jar.
export async function getSessionUserFromTokens(tokens = {}) {
  const { accessToken, bootstrapToken, bootstrapEmail } = tokens;
  if (accessToken) {
    const user = await getCurrentUser(accessToken);
    if (user) {
      const profile = await getUserProfile(user.id);
      return {
        id: user.id,
        email: user.email,
        name: profile?.name || user.email || "",
        role: profile?.role || "admin",
        bootstrap: false,
      };
    }
    // Access token invalid/expired — do NOT fall through to bootstrap.
    return null;
  }
  if (bootstrapToken && (await verifyBootstrapToken(bootstrapToken))) {
    return {
      id: "bootstrap",
      email: bootstrapEmail || "",
      name: "Bootstrap Admin",
      role: "admin",
      bootstrap: true,
    };
  }
  return null;
}

// Convenience wrapper for callers holding a cookie jar.
export async function getSessionUser(jar) {
  if (!jar) return null;
  return getSessionUserFromTokens({
    accessToken: jar.get(SB_ACCESS_COOKIE)?.value,
    bootstrapToken: jar.get(SESSION_COOKIE)?.value,
    bootstrapEmail: jar.get(BOOTSTRAP_EMAIL_COOKIE)?.value,
  });
}
