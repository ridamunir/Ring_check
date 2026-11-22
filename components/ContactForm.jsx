
"use client";
import { useState } from "react";
export default function ContactForm() {
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  async function onSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    const res = await fetch("/api/contact/", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: f.get("name"), email: f.get("email"), topic: f.get("topic"), number: f.get("number"), body: f.get("body") }) });
    if (!res.ok) { setErr("Your message could not be sent. Please try again."); return; }
    setDone(true);
  }
  if (done) return <p className="rounded-md bg-green-50 px-4 py-3 font-medium text-green-800" role="status">Thanks — your message has been sent. We will reply as soon as we can.</p>;
  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-white p-5">
      <div><label className="mb-1 block font-semibold" htmlFor="c-name">Your name</label><input id="c-name" name="name" className="w-full rounded-md border px-3 py-2" /></div>
      <div><label className="mb-1 block font-semibold" htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" required className="w-full rounded-md border px-3 py-2" /></div>
      <div><label className="mb-1 block font-semibold" htmlFor="c-topic">Topic</label>
        <select id="c-topic" name="topic" className="w-full rounded-md border px-3 py-2">
          <option value="General question">General question</option>
          <option value="Number removal">Number removal</option>
          <option value="Report correction">Report correction</option>
          <option value="Business / API">Business / API</option>
        </select></div>
      <div><label className="mb-1 block font-semibold" htmlFor="c-number">Number (if your message is about one)</label><input id="c-number" name="number" className="w-full rounded-md border px-3 py-2" /></div>
      <div><label className="mb-1 block font-semibold" htmlFor="c-body">Message</label><textarea id="c-body" name="body" rows={5} required className="w-full rounded-md border px-3 py-2" /></div>
      {err && <p className="text-sm font-medium text-red-700" role="alert">{err}</p>}
      <button type="submit" className="rounded-md bg-[#0B1F3A] px-6 py-3 font-bold text-white">Send message</button>
    </form>
  );
}
