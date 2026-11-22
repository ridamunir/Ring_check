import Link from "next/link";
import { getAdminUserById, getSessionUser } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/supabase";
import UserEditForm from "@/components/UserEditForm";

export const dynamic = "force-dynamic";

export default async function EditUserPage({ params }) {
  const { user: caller } = await getSessionUser();

  if (!caller) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit User</h1>
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
        <h1 className="text-2xl font-bold">Edit User</h1>
        <div className="rounded-md bg-amber-100 px-4 py-3 text-sm font-medium text-amber-900">
          Supabase is not connected. Connect Supabase first to manage users.
        </div>
      </div>
    );
  }

  const isSelf = caller.id === params.id;
  if (caller.role !== "admin" && !isSelf) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit User</h1>
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">
          Only an Admin can edit other users. An Editor can only edit their own profile.
        </div>
      </div>
    );
  }

  const target = await getAdminUserById(params.id);
  if (!target) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit User</h1>
        <div className="rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-900">
          User not found.
        </div>
        <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">← Back to Users</Link>
      </div>
    );
  }

  return (
    <UserEditForm
      user={target}
      isAdmin={caller.role === "admin"}
      isSelf={isSelf}
    />
  );
}
