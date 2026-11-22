import { createClient } from "@supabase/supabase-js";

// Clients are created lazily / guarded so the build and the public site
// never crash when env vars are missing (demo fallback mode).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(url && anonKey && serviceKey);
}

export function isSupabaseReadable() {
  return Boolean(url && anonKey);
}

let _anon = null;
let _admin = null;

export function getSupabase() {
  if (!isSupabaseReadable()) return null;
  if (!_anon) _anon = createClient(url, anonKey);
  return _anon;
}

export function getSupabaseAdmin() {
  if (!isSupabaseConfigured()) return null;
  if (!_admin) _admin = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _admin;
}

// Backwards-compatible named exports (may be null when not configured).
export const supabase = getSupabase();
export const supabaseAdmin = getSupabaseAdmin();
