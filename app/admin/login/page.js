"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    fetch("/api/admin/login")
      .then((r) => r.json())
      .then((d) => setConfigured(d.configured !== false))
      .catch(() => {});
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-lg border bg-white p-6 shadow-sm">
      <h1 className="mb-1 text-2xl font-bold">Admin Login</h1>
      <p className="mb-6 text-sm text-slate-500">
        Log in with your email (Gmail) and password.
      </p>
      {!configured && (
        <div className="mb-4 rounded-md bg-amber-100 px-3 py-2 text-sm font-medium text-amber-900">
          Supabase is not connected. Add the Supabase environment variables first (see DEPLOY.md). Login is not possible until then.
        </div>
      )}
      {error && <div className="mb-4 rounded-md bg-red-100 px-3 py-2 text-sm text-red-800">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            required
            autoFocus
            autoComplete="email"
            placeholder="you@gmail.com"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-md border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading} className="w-full rounded-md bg-slate-900 py-2 text-sm font-medium text-white disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-xs text-slate-400">
        Logging in for the first time? See &ldquo;How to create the first admin&rdquo; in DEPLOY.md.
      </p>
    </div>
  );
}
