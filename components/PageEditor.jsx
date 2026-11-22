"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TinyEditor = dynamic(() => import("./TinyEditor"), { ssr: false });
// Local copies of the language URL helpers (lib/languages.js is
// server-only, so client components cannot import it).
function shortCode(lc) { return String(lc || "en-GB").split("-")[0].toLowerCase(); }
function localPageUrl(page) {
  const sc = shortCode(page.language_code);
  const prefix = sc === "en" ? "" : `/${sc}`;
  if (page.type === "blog") return page.slug ? `${prefix}/blog/${page.slug}` : `${prefix}/blog`;
  if (!page.slug) return prefix || "/";
  return `${prefix}/${page.slug}`;
}

function uid() {
  return `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const TYPE_OPTIONS = ["tool", "foundational", "hub", "pillar", "subpage", "blog"];
const STATUS_OPTIONS = ["published", "draft", "unpublished"];

export default function PageEditor({ initialPage, isNew, parents = [], subPages = [], configured = true, languages = [], allPages = [] }) {
  const router = useRouter();
  const emptyPage = {
    slug: "",
    type: "tool",
    parent_id: "",
    title: "",
    language_code: "en-GB",
    translation_group_id: "",
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    featured_image: "",
    status: "draft",
    publish_date: "",
    sections: [{ id: uid(), title: "Hero Section", sort_order: 0, variables: [{ id: uid(), name: "hero_heading", value_html: "", sort_order: 0 }] }],
  };
  const [page, setPage] = useState(() => {
    if (initialPage) {
      const p = { ...initialPage, parent_id: initialPage.parent_id || "", translation_group_id: initialPage.translation_group_id || "" };
      if (!p.sections || p.sections.length === 0) p.sections = emptyPage.sections;
      return p;
    }
    return emptyPage;
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadNote, setUploadNote] = useState("");
  const [duplicating, setDuplicating] = useState(false);

  const isHomepage = page.slug === "" && !isNew && page.type === "foundational" && initialPage?.slug === "";
  const isBlog = page.type === "blog";

  function setField(key, value) {
    setPage((p) => ({ ...p, [key]: value }));
  }

  function updateSection(idx, patch) {
    setPage((p) => {
      const sections = [...p.sections];
      sections[idx] = { ...sections[idx], ...patch };
      return { ...p, sections };
    });
  }

  function addSection() {
    const title = window.prompt("Section name (e.g. Hero Section, FAQ Section):", "New Section");
    if (!title) return;
    setPage((p) => ({
      ...p,
      sections: [...p.sections, { id: uid(), title, sort_order: p.sections.length, variables: [{ id: uid(), name: "", value_html: "", sort_order: 0 }] }],
    }));
  }

  function deleteSection(idx) {
    const sec = page.sections[idx];
    if (!window.confirm(`Are you sure you want to delete this? Section "${sec.title}" and all its variables will be deleted.`)) return;
    setPage((p) => ({ ...p, sections: p.sections.filter((_, i) => i !== idx) }));
  }

  function addVariable(sectionIdx) {
    setPage((p) => {
      const sections = [...p.sections];
      const vars = [...sections[sectionIdx].variables, { id: uid(), name: "", value_html: "", sort_order: sections[sectionIdx].variables.length }];
      sections[sectionIdx] = { ...sections[sectionIdx], variables: vars };
      return { ...p, sections };
    });
  }

  function deleteVariable(sectionIdx, varIdx) {
    const v = page.sections[sectionIdx].variables[varIdx];
    if (!window.confirm(`Delete variable "${v.name || "(unnamed)"}"?`)) return;
    setPage((p) => {
      const sections = [...p.sections];
      sections[sectionIdx] = { ...sections[sectionIdx], variables: sections[sectionIdx].variables.filter((_, i) => i !== varIdx) };
      return { ...p, sections };
    });
  }

  function updateVariable(sectionIdx, varIdx, patch) {
    setPage((p) => {
      const sections = [...p.sections];
      const vars = [...sections[sectionIdx].variables];
      vars[varIdx] = { ...vars[varIdx], ...patch };
      sections[sectionIdx] = { ...sections[sectionIdx], variables: vars };
      return { ...p, sections };
    });
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadNote("Uploading...");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setField("featured_image", data.url);
      setUploadNote("Uploaded ✓ — URL field updated.");
    } catch (err) {
      setUploadNote(`Upload failed (${err.message}). Check the "images" storage bucket. You can also paste an image link in the URL field and save — saving is not blocked.`);
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const payload = {
        ...page,
        parent_id: page.parent_id || null,
        translation_group_id: page.translation_group_id || null,
        sections: page.sections.map((s, si) => ({
          ...s,
          sort_order: si,
          variables: s.variables.map((v, vi) => ({ ...v, sort_order: vi })),
        })),
      };
      const url = isNew ? "/api/admin/pages" : `/api/admin/pages/${page.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Save failed (${res.status})`);
      setMessage("Saved ✓ — the content is live. No redeploy is needed.");
      if (isNew && data.page?.id) {
        router.push(`/admin/pages/${data.page.id}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const enabledLangs = (languages.length ? languages.filter((l) => l.enabled) : [{ code: "en", full_code: page.language_code || "en-GB", name: "English", is_default: true }]);
  // "Duplicate / Translate from English": creates a draft copy in the
  // chosen language with the same sections/variable names and empty
  // values, then opens it for translation.
  async function duplicateToLanguage(lang) {
    if (!page.id || duplicating) return;
    setDuplicating(true);
    setError("");
    setMessage("");
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language_code: lang.full_code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not create translation");
      router.push(isBlog ? `/admin/blogs/${data.page.id}` : `/admin/pages/${data.page.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setDuplicating(false);
    }
  }

  const liveUrl = localPageUrl(page);
  const defaultCode = "en";
  const translationSources = allPages.filter((p) => p.id !== page.id && shortCode(p.language_code) === defaultCode);
  const groupId = page.translation_group_id || page.id;
  const groupMembers = groupId
    ? allPages.filter((p) => (p.translation_group_id || p.id) === groupId && p.id !== page.id)
    : [];

  return (
    <div className="space-y-6">
      {!configured && (
        <div className="rounded-md bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
          Demo data — connect Supabase to save changes. Saving will show an error until Supabase is configured.
        </div>
      )}
      {message && <div className="rounded-md bg-green-100 px-4 py-3 text-sm font-medium text-green-900">{message}</div>}
      {error && <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">{error}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{isNew ? (isBlog ? "New Blog" : "New Page") : `Edit: ${page.title || page.slug || "Page"}`}</h1>
        <div className="flex gap-2">
          <button onClick={save} disabled={saving} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save"}
          </button>
          {!isNew && page.slug !== undefined && (
            <Link href={liveUrl} target="_blank" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100">
              View Live Page →
            </Link>
          )}
        </div>
      </div>

      {/* Top fields */}
      <div className="rounded-lg border bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">Page Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium">
            Title
            <input className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.title || ""} onChange={(e) => setField("title", e.target.value)} placeholder="Page title" />
          </label>
          <label className="block text-sm font-medium">
            URL / Slug {isHomepage && <span className="text-xs font-normal text-slate-500">(Homepage — locked)</span>}
            <input
              className="mt-1 w-full rounded-md border px-3 py-2 font-normal disabled:bg-slate-100"
              value={page.slug || ""}
              disabled={isHomepage}
              onChange={(e) => setField("slug", e.target.value.trim().replace(/\s+/g, "-").toLowerCase())}
              placeholder={isBlog ? "how-to-check-an-unknown-number" : "about-us (empty = homepage /)"}
            />
          </label>
          <label className="block text-sm font-medium">
            Language
            <select className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.language_code || "en-GB"} onChange={(e) => setField("language_code", e.target.value)}>
              {enabledLangs.map((l) => (
                <option key={l.id || l.code} value={l.full_code}>{l.name} ({l.full_code}){l.is_default ? " — default, no URL prefix" : ` — /${l.code} prefix`}</option>
              ))}
              {!enabledLangs.some((l) => l.full_code === page.language_code) && page.language_code && (
                <option value={page.language_code}>{page.language_code} (not enabled)</option>
              )}
            </select>
            <span className="mt-1 block text-xs font-normal text-slate-500">Enabled languages are managed in Settings → Languages. The slug below is this language&apos;s own slug — translate it (e.g. Spanish: quien-me-llamo).</span>
          </label>
          <label className="block text-sm font-medium">
            Translation Of (link language versions)
            <select className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.translation_group_id || ""} onChange={(e) => setField("translation_group_id", e.target.value)}>
              <option value="">— This is an original page (starts its own group) —</option>
              {translationSources.map((p) => (
                <option key={p.id} value={p.translation_group_id || p.id}>{p.title || p.slug || "Homepage"} ({p.type})</option>
              ))}
            </select>
            <span className="mt-1 block text-xs font-normal text-slate-500">Linking versions together is what generates the hreflang tags automatically — you never write them by hand.</span>
          </label>
          <label className="block text-sm font-medium">
            Type
            <select className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.type} onChange={(e) => setField("type", e.target.value)}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Meta Title
            <input className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.meta_title || ""} onChange={(e) => setField("meta_title", e.target.value)} placeholder="50–60 characters best" />
          </label>
          <label className="block text-sm font-medium">
            Meta Description
            <input className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.meta_description || ""} onChange={(e) => setField("meta_description", e.target.value)} placeholder="150–160 characters best" />
          </label>
          <label className="block text-sm font-medium">
            Canonical Link
            <input className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.canonical_url || ""} onChange={(e) => setField("canonical_url", e.target.value)} placeholder="Leave blank = automatic self-canonical" />
            <span className="mt-1 block text-xs font-normal text-slate-500">Leave blank and the canonical is this page&apos;s own URL in its own language ({liveUrl}) — never another language&apos;s URL.</span>
          </label>
          <label className="block text-sm font-medium">
            Status
            <select className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.status} onChange={(e) => setField("status", e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Parent Page (for sub-pages)
            <select className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.parent_id || ""} onChange={(e) => setField("parent_id", e.target.value)}>
              <option value="">— No parent —</option>
              {parents.filter((p) => p.id !== page.id).map((p) => (
                <option key={p.id} value={p.id}>{p.title || p.slug} ({p.type})</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Publish Date
            <input type="date" className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.publish_date ? page.publish_date.slice(0, 10) : ""} onChange={(e) => setField("publish_date", e.target.value ? new Date(e.target.value).toISOString() : "")} />
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium">
            Featured Image URL
            <input className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={page.featured_image || ""} onChange={(e) => setField("featured_image", e.target.value)} placeholder="https://... or /images/cover.jpg" />
          </label>
          <div className="mt-2 flex items-center gap-3">
            <label className="cursor-pointer rounded-md border px-3 py-1.5 text-sm hover:bg-slate-100">
              Upload image
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            {uploadNote && <span className="text-xs text-slate-500">{uploadNote}</span>}
          </div>
          <p className="mt-1 text-xs text-slate-500">Upload uses Supabase Storage bucket &quot;images&quot; if configured. If an upload fails, the URL field still works — saving is not blocked.</p>
          {page.featured_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={page.featured_image} alt="Featured" className="mt-3 max-h-40 rounded-md border" />
          )}
        </div>
      </div>

      {/* Live URL + hreflang preview */}
      <div className="rounded-lg border bg-white p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">Live URL &amp; Hreflang (automatic)</h2>
        <p className="text-sm">This page: <code className="rounded bg-slate-100 px-1">{liveUrl}</code> <span className="text-slate-500">— language: {page.language_code || "en-GB"}</span></p>
        {groupMembers.length > 0 ? (
          <ul className="mt-2 space-y-1 text-sm text-slate-600">
            {groupMembers.map((p) => (
              <li key={p.id}>hreflang=&quot;{shortCode(p.language_code)}&quot; → {localPageUrl(p)} <span className="text-slate-400">({p.title || p.slug})</span></li>
            ))}
            <li>hreflang=&quot;x-default&quot; → the default-language version above</li>
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">No linked translations yet. Create this page in another language and link it with &quot;Translation Of&quot; — the full hreflang set will appear on every version automatically.</p>
        )}
        {!isNew && enabledLangs.filter((l) => shortCode(l.full_code) !== shortCode(page.language_code) && !groupMembers.some((m) => shortCode(m.language_code) === l.code)).length > 0 && (
          <div className="mt-4 border-t pt-3">
            <p className="mb-2 text-sm font-medium">Create translation (structure copied, content left empty to translate):</p>
            <div className="flex flex-wrap gap-2">
              {enabledLangs.filter((l) => shortCode(l.full_code) !== shortCode(page.language_code) && !groupMembers.some((m) => shortCode(m.language_code) === l.code)).map((l) => (
                <button key={l.id || l.code} onClick={() => duplicateToLanguage(l)} disabled={duplicating} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-50">
                  {duplicating ? "Creating..." : `+ ${l.name} version`}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sub-pages (hub / pillar parents) */}
      {(page.type === "hub" || page.type === "pillar") && !isNew && (
        <div className="rounded-lg border bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sub-pages</h2>
            <Link href={`/admin/pages/new?type=subpage&parent=${page.id}`} className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
              + Add Sub-page
            </Link>
          </div>
          {subPages.length === 0 ? (
            <p className="text-sm text-slate-500">No sub-pages yet. Use Add Sub-page to create the first sub-page.</p>
          ) : (
            <ul className="divide-y">
              {subPages.map((sp) => (
                <li key={sp.id} className="flex items-center justify-between py-2 text-sm">
                  <span>{sp.title || sp.slug} <span className="text-slate-400">/{sp.slug}</span></span>
                  <Link href={`/admin/pages/${sp.id}`} className="text-blue-600 hover:underline">Edit →</Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Sections + variables */}
      {page.sections.map((section, si) => (
        <div key={section.id} className="rounded-lg border bg-white p-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">Section</span>
            <input className="flex-1 rounded-md border px-3 py-2 text-sm font-medium" value={section.title} onChange={(e) => updateSection(si, { title: e.target.value })} />
            <button onClick={() => deleteSection(si)} className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50" title="Delete section">
              Delete Section
            </button>
          </div>
          {section.title === "Blog Content" && (
            <p className="mb-3 text-sm text-slate-500">The main blog content — write the blog post in this TinyMCE editor.</p>
          )}
          {section.variables.map((v, vi) => (
            <div key={v.id} className="mb-4 rounded-md border border-slate-200 p-3">
              <div className="mb-2 flex items-center gap-2">
                <label className="flex-1 text-sm font-medium">
                  Variable Name
                  <input className="mt-1 w-full rounded-md border px-3 py-1.5 font-normal" value={v.name} onChange={(e) => updateVariable(si, vi, { name: e.target.value.trim().replace(/\s+/g, "_").toLowerCase() })} placeholder="hero_heading" />
                </label>
                <button onClick={() => addVariable(si)} className="mt-5 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-lg font-bold text-white hover:bg-green-700" title="Add variable in this section">+</button>
                <button onClick={() => deleteVariable(si, vi)} className="mt-5 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white hover:bg-red-700" title="Delete this variable">−</button>
              </div>
              <TinyEditor value={v.value_html || ""} onChange={(content) => updateVariable(si, vi, { value_html: content })} />
            </div>
          ))}
          {section.variables.length === 0 && (
            <button onClick={() => addVariable(si)} className="rounded-md border px-3 py-1.5 text-sm hover:bg-slate-100">+ Add Variable</button>
          )}
        </div>
      ))}

      <button onClick={addSection} className="w-full rounded-lg border-2 border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
        + Add New Section
      </button>

      <div className="flex gap-2">
        <button onClick={save} disabled={saving} className="rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save"}
        </button>
        {!isNew && (
          <Link href={liveUrl} target="_blank" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100">
            View Live Page →
          </Link>
        )}
      </div>
    </div>
  );
}
