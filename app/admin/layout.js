import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNav />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
