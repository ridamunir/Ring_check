"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/admin/login") return null;

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/pages", label: "Pages" },
    { href: "/admin/blogs", label: "Blogs" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/reports", label: "Reports" },
    { href: "/admin/messages", label: "Messages" },
    { href: "/admin/settings/languages", label: "Settings" },
  ];

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/admin" className="text-lg font-bold text-slate-900">
          Admin Panel
        </Link>
        <nav className="flex flex-1 gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href))
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">
          View Site →
        </Link>
        <button onClick={logout} className="rounded-md border px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100">
          Logout
        </button>
      </div>
    </header>
  );
}
