
"use client";
import { useState } from "react";
import { NO_VOTES_YET_LABEL } from "@/lib/numbers";

// Vote counts are shown ONLY when at least one real vote exists.
// Before that, an honest label is shown instead of 0.
export default function VoteButtons({ number, safe, unsafe, unsafeFromReports }) {
  const [counts, setCounts] = useState({ safe, unsafe });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const total = counts.safe + counts.unsafe;

  async function vote(v) {
    if (busy) return;
    setBusy(true);
    setMsg("Saving your vote…");
    try {
      let key = null;
      try { key = localStorage.getItem("mrc-voter") || null; if (!key) { key = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("mrc-voter", key); } } catch {}
      const res = await fetch("/api/vote/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ number, vote: v, voterKey: key }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Vote failed");
      setCounts({ safe: data.safe, unsafe: data.unsafe });
      setMsg("Thanks — your vote has been counted.");
    } catch (e) {
      setMsg("Sorry — your vote could not be saved. Please try again.");
    } finally { setBusy(false); }
  }

  return (
    <div>
      <div className="flex gap-3">
        <button type="button" onClick={() => vote("safe")} disabled={busy} className="rounded-md border-2 border-[#00BFA6] px-5 py-2 font-bold text-[#0B1F3A] hover:bg-[#00BFA6]/10">
          Safe{counts.safe > 0 ? ` (${counts.safe})` : ""}
        </button>
        <button type="button" onClick={() => vote("unsafe")} disabled={busy} className="rounded-md border-2 border-[#FF9F1C] px-5 py-2 font-bold text-[#0B1F3A] hover:bg-[#FF9F1C]/10">
          Unsafe / Spam{counts.unsafe > 0 ? ` (${counts.unsafe})` : ""}
        </button>
      </div>
      {total > 0 ? (
        <p className="mt-2 text-sm text-slate-600">{total} {total === 1 ? "vote" : "votes"} ({counts.unsafe} unsafe{counts.safe > 0 ? `, ${counts.safe} safe` : ", no safe votes yet"})</p>
      ) : (
        <p className="mt-2 text-sm text-slate-600">{NO_VOTES_YET_LABEL}</p>
      )}
      {unsafeFromReports > 0 && <p className="mt-2 text-sm text-slate-600">Unsafe votes include {unsafeFromReports} {unsafeFromReports === 1 ? "report" : "reports"} — each approved report counts as one Unsafe signal. No vote numbers are invented.</p>}
      {msg && <p className="mt-2 text-sm font-medium" role="status">{msg}</p>}
    </div>
  );
}
