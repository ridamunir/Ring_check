
import Link from "next/link";
import { getSessionUser } from "@/lib/session";
import { getPendingReports, getToolStats } from "@/lib/tool-data";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const { user } = await getSessionUser();
  if (!user) return <p>Please log in.</p>;
  const pending = await getPendingReports();
  const stats = await getToolStats();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports — Moderation</h1>
      <p className="text-sm text-slate-600">
        Numbers: {stats.numbers} · Approved reports: {stats.reports} · Votes: {stats.votes > 0 ? stats.votes : "none yet"} · Searches: {stats.searches > 0 ? stats.searches : "none yet"}
      </p>
      <p className="text-sm text-slate-600">New reports wait here until you approve or reject them. Nothing goes live before approval.</p>
      {pending.length === 0 && <p className="rounded-lg border bg-white p-5 text-slate-600">No reports waiting for moderation.</p>}
      <ul className="space-y-4">
        {pending.map((r) => (
          <li key={r.id} className="rounded-lg border bg-white p-5">
            <p className="font-bold"><Link href={`/number/${r.number}/`} className="text-blue-600 hover:underline">{r.number}</Link> <span className="ml-2 text-sm font-normal text-slate-500">{r.category} · {String(r.created_at || "").slice(0, 10)}</span></p>
            <p className="mt-2">{r.body}</p>
            <p className="mt-1 text-sm text-slate-500">OTP asked: {r.asked_otp ? "yes" : "no"} · Bank details: {r.asked_bank_details ? "yes" : "no"} · Threat: {r.used_threat ? "yes" : "no"}</p>
            <div className="mt-3 flex gap-2">
              <form action={`/api/admin/reports/${r.id}/approve/`} method="post"><button className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white">Approve</button></form>
              <form action={`/api/admin/reports/${r.id}/reject/`} method="post"><button className="rounded-md border px-4 py-2 text-sm font-medium">Reject</button></form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
