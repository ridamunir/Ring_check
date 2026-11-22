"use client";

import { useRouter } from "next/navigation";

// Row actions on the Users list: Edit / Change Password links + Delete
// button with confirm dialog. Delete is Admin-only (API enforces it too).
export default function UserActions({ user, isSelf }) {
  const router = useRouter();

  async function deleteUser() {
    if (
      !window.confirm(
        `Are you sure you want to delete this? The account of user "${user.name || user.email}" will be permanently deleted.`
      )
    )
      return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Delete failed");
      return;
    }
    router.refresh();
  }

  return (
    <span className="flex gap-2">
      <a
        href={`/admin/users/${user.id}`}
        className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-slate-100"
      >
        Edit
      </a>
      <a
        href={`/admin/users/${user.id}`}
        className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-slate-100"
      >
        {isSelf ? "Change My Password" : "Change Password"}
      </a>
      {!isSelf && (
        <button
          onClick={deleteUser}
          className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
        >
          Delete
        </button>
      )}
    </span>
  );
}
