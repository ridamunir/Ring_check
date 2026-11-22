"use client";

import { useEffect, useState } from "react";

export default function LanguagesManager() {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState(true);
  const [form, setForm] = useState({ name: "", code: "", full_code: "" });
  const [adding, setAdding] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/languages");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load languages");
      setLanguages(data.languages || []);
      setConfigured(data.configured !== false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function toggle(lang) {
    const res = await fetch(`/api/admin/languages/${lang.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !lang.enabled }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { alert(data.error || "Update failed"); return; }
    load();
  }

  async function remove(lang) {
    if (!window.confirm(`Delete the custom language "${lang.name}"? Pages in this language are not deleted, but the language will no longer be selectable.`)) return;
    const res = await fetch(`/api/admin/languages/${lang.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { alert(data.error || "Delete failed"); return; }
    load();
  }

  async function addCustom(e) {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch("/api/admin/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add the language");
      setForm({ name: "", code: "", full_code: "" });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings — Languages</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enable the languages this site is published in. The default language (English) has no URL prefix —
          every other language appears under its code, e.g. <code>/es</code>, <code>/es/blog/...</code>.
          Only enabled languages appear in the page editor&apos;s Language dropdown.
        </p>
      </div>
      {!configured && (
        <div className="rounded-md bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
          Demo data — connect Supabase to save changes
        </div>
      )}
      {error && <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-900">{error}</div>}
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-3">Language</th><th className="px-4 py-3">URL Code</th><th className="px-4 py-3">Full Code (hreflang)</th><th className="px-4 py-3">OG Locale</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody className="divide-y">
              {languages.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 font-medium">
                    {l.name}
                    {l.is_default && <span className="ml-2 rounded bg-slate-900 px-2 py-0.5 text-xs text-white">Default</span>}
                    {l.is_custom && <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Custom</span>}
                  </td>
                  <td className="px-4 py-3"><code>{l.is_default ? "(none)" : `/${l.code}`}</code></td>
                  <td className="px-4 py-3">{l.full_code}</td>
                  <td className="px-4 py-3">{l.og_locale}</td>
                  <td className="px-4 py-3">{l.enabled ? <span className="font-medium text-green-600">Enabled</span> : <span className="text-slate-400">Disabled</span>}</td>
                  <td className="px-4 py-3 text-right">
                    {!l.is_default && (
                      <button onClick={() => toggle(l)} className="mr-3 text-blue-600 hover:underline">{l.enabled ? "Disable" : "Enable"}</button>
                    )}
                    {l.is_custom && <button onClick={() => remove(l)} className="text-red-600 hover:underline">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="rounded-lg border bg-white p-5">
        <h2 className="mb-1 font-semibold">Add a Custom Language</h2>
        <p className="mb-4 text-sm text-slate-500">Use this only when the language is not in the predefined list above. The short code becomes the URL prefix, so type it carefully — for example <code>es</code>, not <code>sp</code>.</p>
        <form onSubmit={addCustom} className="grid gap-3 md:grid-cols-4">
          <label className="block text-sm font-medium">
            Language Name
            <input className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Bengali" required />
          </label>
          <label className="block text-sm font-medium">
            Code (URL prefix)
            <input className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. bn" required />
          </label>
          <label className="block text-sm font-medium">
            Full Code (optional)
            <input className="mt-1 w-full rounded-md border px-3 py-2 font-normal" value={form.full_code} onChange={(e) => setForm({ ...form, full_code: e.target.value })} placeholder="e.g. bn-BD" />
          </label>
          <div className="flex items-end">
            <button disabled={adding} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{adding ? "Adding..." : "+ Add Language"}</button>
          </div>
        </form>
      </div>

      <div className="rounded-lg border bg-slate-50 p-5 text-sm text-slate-600">
        <p className="font-semibold text-slate-900">How translations work</p>
        <p className="mt-1">
          A language code does not translate anything by itself. For each page, create its version in the other
          language from the page editor: pick the language in the Language dropdown, write the translated slug
          (the slug is translated too, e.g. <code>/es/quien-me-llamo</code>), link it with
          &quot;Translation of&quot;, and write the content in that language. The panel then generates the full
          hreflang set and the self-canonical for every version automatically.
        </p>
      </div>
    </div>
  );
}
