
import { getSessionUser } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const { user } = await getSessionUser();
  if (!user) return <p>Please log in.</p>;
  const admin = getSupabaseAdmin();
  let messages = [];
  if (admin) {
    const { data } = await admin.from("messages").select("*").order("created_at", { ascending: false }).limit(50);
    messages = data || [];
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>
      {messages.length === 0 && <p className="rounded-lg border bg-white p-5 text-slate-600">No messages yet.</p>}
      <ul className="space-y-4">
        {messages.map((m) => (
          <li key={m.id} className="rounded-lg border bg-white p-5">
            <p className="font-bold">{m.topic} <span className="ml-2 text-sm font-normal text-slate-500">{m.name} · {m.email} · {String(m.created_at || "").slice(0, 10)}</span></p>
            {m.number && <p className="text-sm text-slate-500">Number: {m.number}</p>}
            <p className="mt-2">{m.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
