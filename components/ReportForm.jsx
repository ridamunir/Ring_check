
"use client";
import { useState } from "react";

export default function ReportForm({ number }) {
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const f = new FormData(e.target);
    const body = String(f.get("body") || "").trim();
    if (body.length < 10) { setErr("Please write a little more about what the caller said (at least 10 characters)."); setBusy(false); return; }
    if (/https?:\/\//i.test(body)) { setErr("Links are not allowed in reports."); setBusy(false); return; }
    const res = await fetch("/api/report/", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ number: String(f.get("number") || number), body, category: f.get("category"),
        askedOtp: f.get("asked_otp") === "on", askedBank: f.get("asked_bank") === "on", usedThreat: f.get("used_threat") === "on" }) });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setErr(data.error || "Your report could not be saved. Please try again."); return; }
    setDone(true);
  }
  if (done) return <p className="rounded-md bg-green-50 px-4 py-3 font-medium text-green-800" role="status">Thanks — your report has been received and is waiting for moderation. It will appear on this page once approved.</p>;
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-5">
      <div>
        <label htmlFor="rf-number" className="mb-1 block font-semibold">Number</label>
        <input id="rf-number" name="number" defaultValue={number || ""} required className="w-full rounded-md border px-3 py-2" />
      </div>
      <div>
        <label htmlFor="rf-category" className="mb-1 block font-semibold">Category</label>
        <select id="rf-category" name="category" className="w-full rounded-md border px-3 py-2">
          <option value="scam">Scam</option><option value="spam">Spam</option>
          <option value="telemarketing">Telemarketing</option><option value="robocall">Robocall</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="rf-body" className="mb-1 block font-semibold">What did the caller say or ask for?</label>
        <textarea id="rf-body" name="body" rows={4} required className="w-full rounded-md border px-3 py-2" placeholder="Write what happened, in your own words. Do not include your name, address, or any personal details." />
      </div>
      <fieldset>
        <legend className="font-semibold">Did the caller…</legend>
        <label className="mr-4"><input type="checkbox" name="asked_otp" /> ask for a one-time code?</label>
        <label className="mr-4"><input type="checkbox" name="asked_bank" /> ask for bank details?</label>
        <label><input type="checkbox" name="used_threat" /> threaten you?</label>
      </fieldset>
      {err && <p className="text-sm font-medium text-red-700" role="alert">{err}</p>}
      <button type="submit" disabled={busy} className="rounded-md bg-[#0B1F3A] px-6 py-3 font-bold text-white">{busy ? "Submitting…" : "Submit report"}</button>
      <p className="text-sm text-slate-500">Reports are checked before they go live. Never include personal details in a report.</p>
    </form>
  );
}
