// Languages — multilingual support (Hybrid method, approved 15 Nov 2026).
// Settings > Languages in /admin: a predefined list to enable, plus a
// "Custom Language" option to add any language manually (name + code).
//
// URL prefix is always the SHORT code (es, fr, de...). English is the
// default and has NO URL prefix: homepage.com/, homepage.com/[slug].
// Other languages: homepage.com/es/, homepage.com/es/[slug],
// homepage.com/es/blog/[slug]. The FULL code (es-ES) is used for
// <html lang>, hreflang and og:locale.
//
// This file is SERVER-ONLY (it imports the Supabase admin client).

import { getSupabaseAdmin } from "./supabase";

export const PREDEFINED_LANGUAGES = [
  { id: "lang-en", code: "en", og_locale: "en_GB", name: "English", native_name: "English", full_code: "en-GB", is_default: true, is_custom: false, enabled: true, sort_order: 0 },
  { id: "lang-es", code: "es", og_locale: "es_ES", name: "Spanish", native_name: "Español", full_code: "es-ES", is_default: false, is_custom: false, enabled: true, sort_order: 1 },
  { id: "lang-fr", code: "fr", og_locale: "fr_FR", name: "French", native_name: "Français", full_code: "fr-FR", is_default: false, is_custom: false, enabled: false, sort_order: 2 },
  { id: "lang-de", code: "de", og_locale: "de_DE", name: "German", native_name: "Deutsch", full_code: "de-DE", is_default: false, is_custom: false, enabled: false, sort_order: 3 },
  { id: "lang-pt", code: "pt", og_locale: "pt_PT", name: "Portuguese", native_name: "Português", full_code: "pt-PT", is_default: false, is_custom: false, enabled: false, sort_order: 4 },
  { id: "lang-it", code: "it", og_locale: "it_IT", name: "Italian", native_name: "Italiano", full_code: "it-IT", is_default: false, is_custom: false, enabled: false, sort_order: 5 },
  { id: "lang-nl", code: "nl", og_locale: "nl_NL", name: "Dutch", native_name: "Nederlands", full_code: "nl-NL", is_default: false, is_custom: false, enabled: false, sort_order: 6 },
  { id: "lang-no", code: "no", og_locale: "nb_NO", name: "Norwegian", native_name: "Norsk", full_code: "nb-NO", is_default: false, is_custom: false, enabled: false, sort_order: 7 },
];

// Fallback list used when Supabase is not configured (demo mode).
// Mirrors the seed: English (default) + Spanish enabled, the rest
// present but disabled until an Admin enables them.
export const FALLBACK_LANGUAGES = PREDEFINED_LANGUAGES.map((l) => ({ ...l }));

export const DEFAULT_SHORT_CODE = "en";

export function shortCode(languageCode) {
  if (!languageCode) return "en";
  return String(languageCode).split("-")[0].toLowerCase();
}

export function fullCodeForShort(code) {
  const found = PREDEFINED_LANGUAGES.find((l) => l.code === code);
  if (found) return found.full_code;
  return `${code}-${code.toUpperCase()}`;
}

// og:locale uses an underscore: es-ES -> es_ES, en-GB -> en_GB.
export function ogLocale(fullCode) {
  return String(fullCode || "en-GB").replace("-", "_");
}

export function isValidShortCode(code) {
  return /^[a-z]{2}$/.test(String(code || ""));
}

export function isValidFullCode(code) {
  return /^[a-z]{2}-[A-Z]{2}$/.test(String(code || ""));
}

export async function getLanguages() {
  const admin = getSupabaseAdmin();
  if (!admin) return FALLBACK_LANGUAGES.map((l) => ({ ...l }));
  try {
    const { data, error } = await admin.from("languages").select("*").order("sort_order");
    if (error || !data || data.length === 0) return FALLBACK_LANGUAGES.map((l) => ({ ...l }));
    return data;
  } catch {
    return FALLBACK_LANGUAGES.map((l) => ({ ...l }));
  }
}

export async function getEnabledLanguages() {
  return (await getLanguages()).filter((l) => l.enabled);
}

export async function getLanguageByShort(code) {
  const langs = await getLanguages();
  return langs.find((l) => l.code === code) || null;
}

export async function isLanguageEnabled(code) {
  if (code === "en") return true;
  const lang = await getLanguageByShort(code);
  return Boolean(lang && lang.enabled);
}

// Public URL of a page in its own language. `base` is the site origin
// ("" for a relative link). English has no prefix; every other language
// gets /{short-code} in front. The slug is per-language, so a translated
// slug (e.g. Spanish "como-comprobar-un-numero-desconocido") is used as-is.
// Cluster subpages live under their hub, NOT at the bare slug:
//   /scam-calls/hmrc-scam-calls/ (not /hmrc-scam-calls/)
//   /area-code/020/ (not /020/)
// The bare slugs must never appear in canonicals, hreflang or the
// sitemap, or Google sees the same page at two URLs.
const NESTED_PARENT = {
  "hmrc-scam-calls": "scam-calls",
  "bank-scam-calls": "scam-calls",
  "020": "area-code",
  "07-mobile-numbers": "area-code",
};

export function pageUrl(page, base = "") {
  const short = shortCode(page.language_code);
  const prefix = short === "en" ? "" : `/${short}`;
  if (page.type === "blog") return `${base}${prefix}/blog/${page.slug}`;
  if (!page.slug) return short === "en" ? `${base}/` : `${base}/${short}`;
  const nested = page.parent_slug || NESTED_PARENT[page.slug];
  if (nested) return `${base}${prefix}/${nested}/${page.slug}`;
  return `${base}${prefix}/${page.slug}`;
}

// Self-canonical: every language version canonicalises to ITSELF.
// A manual canonical_url in the admin overrides this (kept for rare
// special cases), otherwise the page's own language URL is used.
export function canonicalUrlFor(page, base = "") {
  if (page.canonical_url && String(page.canonical_url).trim()) {
    return String(page.canonical_url).trim();
  }
  return pageUrl(page, base);
}

// Full hreflang set for one page version, from all PUBLISHED translations
// in its translation group. Every version lists every version:
//   x-default -> English URL (the default language)
//   en        -> English URL
//   es        -> Spanish URL, fr -> French URL, ...
// If a group has no published English version, x-default points to the
// current page's URL instead.
export function hreflangEntries(page, translations, base = "") {
  const published = (translations || []).filter((t) => t.status === "published");
  const list = published.length ? published : [page];
  const byShort = new Map(list.map((t) => [shortCode(t.language_code), t]));
  const entries = [];
  const enPage = byShort.get("en");
  entries.push({ hreflang: "x-default", href: pageUrl(enPage || page, base) });
  // English first, then the rest in language sort order.
  const ordered = [...list].sort((a, b) => {
    const sa = shortCode(a.language_code);
    const sb = shortCode(b.language_code);
    if (sa === "en") return -1;
    if (sb === "en") return 1;
    return sa.localeCompare(sb);
  });
  for (const t of ordered) {
    entries.push({ hreflang: shortCode(t.language_code), href: pageUrl(t, base) });
  }
  return entries;
}

// Metadata object for a public page version (Next.js generateMetadata).
// Title/description come from THAT language version only.
export function pageMetadata(page, translations, base = "") {
  const langs = {};
  for (const e of hreflangEntries(page, translations, base)) {
    langs[e.hreflang] = e.href;
  }
  const full = page.language_code || fullCodeForShort(shortCode(page.language_code));
  return {
    title: page.meta_title || page.title || "",
    description: page.meta_description || "",
    alternates: { canonical: canonicalUrlFor(page, base), languages: langs },
    openGraph: {
      title: page.meta_title || page.title || "",
      description: page.meta_description || "",
      locale: ogLocale(full),
      url: canonicalUrlFor(page, base),
    },
  };
}

// --- API used by the public pages / sitemap / editor (sibling surface) ---

// Public path of a page in its own language (relative). English has no
// prefix; other languages get /{short-code} in front. `languages` is
// accepted for call-site compatibility and not needed here.
export function pagePath(page, languages) {
  return pageUrl(page, "");
}

// { canonical, languages } object for Next.js generateMetadata.
// languages map: x-default -> default-language URL, en -> English URL,
// es/fr/... -> that language's URL. Every version lists every version.
export function buildAlternates(page, translations, languages) {
  const base = siteBase();
  const langs = {};
  for (const e of hreflangEntries(page, translations, base)) {
    langs[e.hreflang] = e.href;
  }
  return { canonical: canonicalUrlFor(page, base), languages: langs };
}

// og:locale for a page version (e.g. "es_ES"), from the languages list
// when available, otherwise from the page's own language code.
export function ogLocaleFor(page, languages) {
  const short = shortCode(page.language_code);
  const row = (languages || []).find((l) => l.code === short);
  if (row?.og_locale) return row.og_locale;
  if (row?.full_code) return ogLocale(row.full_code);
  return ogLocale(page.language_code || fullCodeForShort(short));
}

// Short code of the default language (e.g. "en").
export function defaultShortCode(languages) {
  return (languages || []).find((l) => l.is_default)?.code || "en";
}

// Site origin without a trailing slash (NEXT_PUBLIC_SITE_URL or fallback).
export function siteBase() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");
}
