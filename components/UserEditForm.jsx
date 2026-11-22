"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Edit form + Change Password form for one user.
// Props: user (target), isAdmin (caller is Admin), isSelf (caller edits own profile).
// Editors editing themselves see name + password only — email/role fields hidden.
export default function UserEditForm({ user, isAdmin, isSelf }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(user.role || "editor");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [loading, setLoading] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  async function saveProfile(e) {
    e.preventDefault();
    setError("");
    setSaved("");
    setLoading(true);
    try {
      const body = { name };
      if (isAdmin) {
        body.email = email;
        body.role = role;
      }
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSaved("Saved — the profile has been updated.");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwError("");
    setPwSaved("");
    setPwLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword, confirm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Password change failed");
      setPwSaved("Password changed.");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setPwError(err.message);
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit User</h1>
        <p className="mt-1 text-sm text-slate-500">
          {user.email} · Role: {user.role}
          {isSelf ? " · (this is your own profile)" : ""}
        </p>
      </div>
      {error && <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">{error}</div>}
      {saved && <div className="rounded-md bg-green-100 px-4 py-3 text-sm font-medium text-green-900">{saved}</div>}
      <form onSubmit={saveProfile} className="max-w-md space-y-4 rounded-lg border bg-white p-5">
        <h2 className="font-semibold">Profile</h2>
        <label className="block text-sm font-medium">
          Name
          <input required className="mt-1 w-full rounded-md border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        {isAdmin ? (
          <>
            <label className="block text-sm font-medium">
              Email
              <input type="email" required className="mt-1 w-full rounded-md border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="block text-sm font-medium">
              Role
              <select className="mt-1 w-full rounded-md border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </>
        ) : (
          <p className="text-sm text-slate-500">Only an Admin can change the email and role.</p>
        )}
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {loading ? "Saving..." : "Save"}
          </button>
          <Link href="/admin/users" className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100">Back to Users</Link>
        </div>
      </form>

      <form onSubmit={changePassword} className="max-w-md space-y-4 rounded-lg border bg-white p-5">
        <h2 className="font-semibold">Change Password</h2>
        {pwError && <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">{pwError}</div>}
        {pwSaved && <div className="rounded-md bg-green-100 px-4 py-3 text-sm font-medium text-green-900">{pwSaved}</div>}
        <label className="block text-sm font-medium">
          New password (at least 8 characters)
          <input type="password" required minLength={8} className="mt-1 w-full rounded-md border px-3 py-2" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </label>
        <label className="block text-sm font-medium">
          Confirm new password
          <input type="password" required minLength={8} className="mt-1 w-full rounded-md border px-3 py-2" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <button type="submit" disabled={pwLoading} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
          {pwLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
