"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
function localPageUrl(p) { const sc = String(p.language_code || "en-GB").split("-")[0].toLowerCase(); const prefix = sc === "en" ? "" : `/${sc}`; return `${prefix}/blog/${p.slug}`; }

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [configured, setConfigured] = useState(true);
  const [langFilter, setLangFilter] = useState("All");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pages?type=blog");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load blogs");
      setBlogs(data.pages || []);
      setConfigured(data.configured !== false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const langOptions = [...new Set(blogs.map((b) => String(b.language_code || "en-GB").split("-")[0].toLowerCase()))];
  const filteredBlogs = langFilter === "All" ? blogs : blogs.filter((b) => String(b.language_code || "en-GB").split("-")[0].toLowerCase() === langFilter);

  async function changeStatus(blog, status) {
    const res = await fetch(`/api/admin/pages/${blog.id}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { alert(data.error || "Status update failed"); return; }
    load();
  }

  async function deleteBlog(b) {
    if (!window.confirm(`Delete blog "${b.title || b.slug}"?`)) return;
    const res = await fetch(`/api/admin/pages/${b.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { alert(data.error || "Delete failed"); return; }
    load();
  }

  function fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href="/admin/blogs/new" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">+ New Blog</Link>
      </div>
      {!configured && (
        <div className="rounded-md bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
          Demo data — connect Supabase to save changes
        </div>
      )}
      {error && <div className="rounded-md bg-red-100 px-4 py-3 text-sm text-red-900">{error}</div>}
      <div className="flex flex-wrap gap-2">
        <select value={langFilter} onChange={(e) => setLangFilter(e.target.value)} className="rounded-md border bg-white px-3 py-2 text-sm" title="Filter by language">
          <option value="All">All languages</option>
          {langOptions.map((c) => (
            <option key={c} value={c}>{c === "en" ? "English" : c.toUpperCase()}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="text-slate-500">{blogs.length === 0 ? "No blogs yet. Use + New Blog to create your first blog." : "No blogs in this language."}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr><th className="px-4 py-3">Image</th><th className="px-4 py-3">Blog Title</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3"></th></tr>
            </thead>
            <tbody className="divide-y">
              {filteredBlogs.map((b) => (
                <tr key={b.id}>
                  <td className="px-4 py-3">
                    {b.featured_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.featured_image} alt="" className="h-12 w-16 rounded object-cover" />
                    ) : (
                      <span className="flex h-12 w-16 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/admin/blogs/${b.id}`} className="hover:underline">{b.title || b.slug}</Link>
                    <span className="block text-xs text-slate-400">{localPageUrl(b)} · {b.language_code || "en-GB"}</span>
                  </td>
                  <td className="px-4 py-3">{fmtDate(b.publish_date || b.created_at)}</td>
                  <td className="px-4 py-3">
                    <select value={b.status} onChange={(e) => changeStatus(b, e.target.value)} className="rounded-md border px-2 py-1 text-sm">
                      <option value="published">Published</option>
                      <option value="unpublished">Unpublished</option>
                      <option value="draft">Draft</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/blogs/${b.id}`} className="mr-3 text-blue-600 hover:underline">Edit</Link>
                    <button onClick={() => deleteBlog(b)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
