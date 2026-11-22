import { headers } from "next/headers";
import { getSupabaseAdmin, isSupabaseReadable } from "./supabase";
import { FALLBACK_PAGES, getFallbackPageById, getFallbackPageBySlug, getFallbackTranslations } from "./fallback";
import { getLanguages as _getLanguages, getEnabledLanguages as _getEnabledLanguages, shortCode } from "./languages";

export const getLanguages = _getLanguages;
export const getEnabledLanguages = _getEnabledLanguages;

export async function getPageBySlugLang(slug, langShort) {
  return getPageBySlug(slug, langShort);
}

// Server helpers. Return Supabase data when configured, else fallback demo data.
// Never throw when env vars are missing.

// Language of the current request, set by middleware (x-lang header).
// "en" when no prefix is present. Only call this in server components /
// route handlers (it reads request headers).
export function getRequestLang() {
  try {
    return headers().get("x-lang") || "en";
  } catch {
    return "en";
  }
}

function attachSections(page, sections, variables) {
  const pageSections = (sections || [])
    .filter((s) => s.page_id === page.id)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((s) => ({
      ...s,
      variables: (variables || [])
        .filter((v) => v.section_id === s.id)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    }));
  return { ...page, sections: pageSections };
}

export async function getPageWithContent(id) {
  const fallback = getFallbackPageById(id);
  const admin = getSupabaseAdmin();
  if (!admin) return fallback ? JSON.parse(JSON.stringify(fallback)) : null;
  try {
    const { data: page, error } = await admin.from("pages").select("*").eq("id", id).single();
    if (error || !page) return fallback ? JSON.parse(JSON.stringify(fallback)) : null;
    const { data: sections } = await admin.from("sections").select("*").eq("page_id", id).order("sort_order");
    const sectionIds = (sections || []).map((s) => s.id);
    let variables = [];
    if (sectionIds.length) {
      const res = await admin.from("variables").select("*").in("section_id", sectionIds).order("sort_order");
      variables = res.data || [];
    }
    return attachSections(page, sections || [], variables);
  } catch {
    return fallback ? JSON.parse(JSON.stringify(fallback)) : null;
  }
}

// Find a page by slug IN ONE LANGUAGE. A slug only matches its own
// language version — a Spanish URL never returns the English page
// (and vice versa). Returns null when that language has no such page.
export async function getPageBySlug(slug, langShort = "en") {
  const admin = getSupabaseAdmin();
  if (!admin) {
    const p = getFallbackPageBySlug(slug, langShort);
    return p ? JSON.parse(JSON.stringify(p)) : null;
  }
  try {
    const { data: pages, error } = await admin.from("pages").select("*").eq("slug", slug);
    if (error || !pages) return null;
    const page = pages.find((p) => shortCode(p.language_code) === langShort);
    if (!page) return null;
    return getPageWithContent(page.id);
  } catch {
    const p = getFallbackPageBySlug(slug, langShort);
    return p ? JSON.parse(JSON.stringify(p)) : null;
  }
}

// All published versions of one translation group (for hreflang links
// and the editor's Translations panel). Falls back to the single page
// when a group has only one version.
export async function getTranslations(pageOrGroupId) {
  // Accepts a page object ({ translation_group_id, id }), a group id,
  // or a single page id — all call sites use one of these forms.
  const groupId =
    typeof pageOrGroupId === "object"
      ? pageOrGroupId?.translation_group_id || pageOrGroupId?.id
      : pageOrGroupId;
  if (!groupId) return [];
  const admin = getSupabaseAdmin();
  if (!admin) return JSON.parse(JSON.stringify(getFallbackTranslations(groupId)));
  try {
    const { data, error } = await admin.from("pages").select("*").eq("translation_group_id", groupId).order("created_at");
    if (error) throw error;
    return data || [];
  } catch {
    return JSON.parse(JSON.stringify(getFallbackTranslations(groupId)));
  }
}

export async function getPublishedPages(langShort) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    let pages = FALLBACK_PAGES.filter((p) => p.status === "published");
    if (langShort) pages = pages.filter((p) => shortCode(p.language_code) === langShort);
    return pages.map((p) => ({ ...p, sections: undefined }));
  }
  try {
    const { data, error } = await admin.from("pages").select("*").eq("status", "published").order("created_at");
    if (error) throw error;
    let pages = data || [];
    if (langShort) pages = pages.filter((p) => shortCode(p.language_code) === langShort);
    return pages;
  } catch {
    let pages = FALLBACK_PAGES.filter((p) => p.status === "published");
    if (langShort) pages = pages.filter((p) => shortCode(p.language_code) === langShort);
    return pages;
  }
}

export async function getAllPages() {
  const admin = getSupabaseAdmin();
  if (!admin) return JSON.parse(JSON.stringify(FALLBACK_PAGES));
  try {
    const { data, error } = await admin.from("pages").select("*").order("created_at");
    if (error) throw error;
    return data || [];
  } catch {
    return JSON.parse(JSON.stringify(FALLBACK_PAGES));
  }
}

export async function getPublishedBlogs(langShort) {
  const pages = await getPublishedPages(langShort);
  return pages.filter((p) => p.type === "blog");
}

export async function getSubPages(parentId, langShort) {
  const all = await getAllPages();
  let subs = all.filter((p) => p.parent_id === parentId);
  if (langShort) subs = subs.filter((p) => shortCode(p.language_code) === langShort);
  return subs;
}

export function isConfigured() {
  return isSupabaseReadable();
}
