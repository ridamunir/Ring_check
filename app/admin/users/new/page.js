"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("editor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not create the user");
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Add New User</h1>
      {error && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">{error}</div>
      )}
      <form onSubmit={submit} className="max-w-md space-y-4 rounded-lg border bg-white p-5">
        <label className="block text-sm font-medium">
          Name
          <input required className="mt-1 w-full rounded-md border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input type="email" required placeholder="user@gmail.com" className="mt-1 w-full rounded-md border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Password (at least 8 characters)
          <input type="password" required minLength={8} className="mt-1 w-full rounded-md border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Role
          <select className="mt-1 w-full rounded-md border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="editor">Editor — can edit content, cannot manage users</option>
            <option value="admin">Admin — can do everything</option>
          </select>
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {loading ? "Creating..." : "Create User"}
          </button>
          <Link href="/admin/users" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
