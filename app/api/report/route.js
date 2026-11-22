
import { NextResponse } from "next/server";
import { normalizeUkNumber } from "@/lib/numbers";
import { submitReport } from "@/lib/tool-data";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const n = normalizeUkNumber(body.number || "");
    if (!n) return NextResponse.json({ error: "That does not look like a UK number." }, { status: 400 });
    const text = String(body.body || "").trim();
    if (text.length < 10) return NextResponse.json({ error: "Please write a little more about what the caller said." }, { status: 400 });
    if (/https?:\/\//i.test(text)) return NextResponse.json({ error: "Links are not allowed in reports." }, { status: 400 });
    const allowed = ["scam", "spam", "telemarketing", "robocall", "other"];
    const category = allowed.includes(body.category) ? body.category : "scam";
    await submitReport({ number: n, body: text, category, askedOtp: body.askedOtp, askedBank: body.askedBank, usedThreat: body.usedThreat });
    return NextResponse.json({ status: "pending", message: "Thanks — your report is waiting for moderation." });
  } catch (e) {
    return NextResponse.json({ error: "Your report could not be saved. Please try again." }, { status: 500 });
  }
}
