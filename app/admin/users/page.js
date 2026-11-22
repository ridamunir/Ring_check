import Link from "next/link";
import { getSessionUser, listAdminUsers } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/supabase";
import UserActions from "@/components/UserActions";

export const dynamic = "force-dynamic";

function fmtDate(v) {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export default async function UsersPage() {
  const { user } = await getSessionUser();

  if (!user) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">
          Your session has expired or you are not logged in.{" "}
          <Link href="/admin/login" className="underline">Log in</Link>
        </div>
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="rounded-md bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
          Supabase is not connected. Connect Supabase first to manage users (see DEPLOY.md).
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">
          Only an Admin can view users. Your role: {user.role}. To change your
          password, open{" "}
          <Link href={`/admin/users/${user.id}`} className="underline">your profile</Link>.
        </div>
        {user.id !== "bootstrap" && (
          <Link
            href={`/admin/users/${user.id}`}
            className="inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            My Account →
          </Link>
        )}
      </div>
    );
  }

  let users = null;
  let loadError = "";
  try {
    users = await listAdminUsers();
  } catch (err) {
    loadError = err.message;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Users</h1>
        <Link href="/admin/users/new" className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          + Add New User
        </Link>
      </div>
      {user.bootstrap && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">
          Bootstrap mode — create the first admin, then remove ADMIN_PASSWORD from Vercel (see DEPLOY.md).
        </div>
      )}
      {loadError && (
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">
          Failed to load users: {loadError}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Last login</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(users || []).map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium">
                  {u.name || "—"}
                  {u.id === user.id && (
                    <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">you</span>
                  )}
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.role === "admin"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {u.role === "admin" ? "Admin" : "Editor"}
                  </span>
                </td>
                <td className="px-4 py-3">{fmtDate(u.created_at)}</td>
                <td className="px-4 py-3">{fmtDate(u.last_sign_in_at)}</td>
                <td className="px-4 py-3">
                  <UserActions user={u} isSelf={u.id === user.id} />
                </td>
              </tr>
            ))}
            {!(users || []).length && !loadError && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-500">
                  No users yet. Click &ldquo;Add New User&rdquo; to create the first user.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-slate-500">
        Admin: can do everything (manage users and delete foundational pages). Editor: can edit
        content, but cannot manage users or delete foundational pages.
      </p>
    </div>
  );
}
