"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
function localPageUrl(p) { const sc = String(p.language_code || "en-GB").split("-")[0].toLowerCase(); const prefix = sc === "en" ? "" : `/${sc}`; if (p.type === "blog") return `${prefix}/blog/${p.slug}`; return p.slug ? `${prefix}/${p.slug}` : prefix || "/"; }

const FILTERS = ["All", "tool", "foundational", "hub", "pillar", "subpage"];
const TYPE_LABELS = { tool: "Tool", foundational: "Foundational", hub: "Hub", pillar: "Pillar", subpage: "Sub-page" };

export default function PagesListPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [langFilter, setLangFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [configured, setConfigured] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load pages");
      setPages(data.pages || []);
      setConfigured(data.configured !== false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    return pages.filter((p) => {
      if (filter !== "All" && p.type !== filter) return false;
      if (langFilter !== "All" && String(p.language_code || "en-GB").split("-")[0].toLowerCase() !== langFilter) return false;
      if (search && !(p.title || "").toLowerCase().includes(search.toLowerCase()) && !(p.slug || "").toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [pages, filter, langFilter, search]);

  async function deletePage(p) {
    if (p.slug === "") { alert("The homepage cannot be deleted — it is delete-locked."); return; }
    if (!window.confirm(`Are you sure you want to delete this? Page "${p.title || p.slug}" and all its sections and variables will be deleted.`)) return;
    const res = await fetch(`/api/admin/pages/${p.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { alert(data.error || "Delete failed"); return; }
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Link href="/admin/pages/new" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">+ New Page</Link>
      </div>
      {!configured && (
        <div className="rounded-md bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
          Demo data — connect Supabase to save changes
        </div>
      )}
      {error && <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-900">{error}</div>}
      <div className="flex flex-wrap gap-2">
        <input className="min-w-56 flex-1 rounded-md border px-3 py-2 text-sm" placeholder="Search title / slug..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)} className="rounded-md border bg-white px-3 py-2 text-sm" title="Filter by language">
          <option value="All">All languages</option>
          {[...new Set(pages.map((p) => String(p.language_code || "en-GB").split("-")[0].toLowerCase()))].map((c) => (
            <option key={c} value={c}>{c === "en" ? "English" : c.toUpperCase()}</option>
          ))}
        </select>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-md px-3 py-2 text-sm font-medium ${filter === f ? "bg-slate-900 text-white" : "border bg-white hover:bg-slate-100"}`}>
            {TYPE_LABELS[f] || f}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-3">Title</th><th className="px-4 py-3">URL</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3 font-medium">{p.title || "(no title)"}</td>
                  <td className="px-4 py-3 text-slate-500">{localPageUrl(p)} <span className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-xs">{p.language_code || "en-GB"}</span></td>
                  <td className="px-4 py-3">{TYPE_LABELS[p.type] || p.type}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/pages/${p.id}`} className="mr-3 text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => deletePage(p)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">No pages found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
