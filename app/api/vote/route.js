
import { NextResponse } from "next/server";
import { normalizeUkNumber } from "@/lib/numbers";
import { castVote } from "@/lib/tool-data";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const n = normalizeUkNumber(body.number || "");
    if (!n) return NextResponse.json({ error: "That does not look like a UK number." }, { status: 400 });
    if (body.vote !== "safe" && body.vote !== "unsafe") return NextResponse.json({ error: "Invalid vote." }, { status: 400 });
    const counts = await castVote({ number: n, vote: body.vote, voterKey: body.voterKey || null });
    return NextResponse.json(counts);
  } catch (e) {
    return NextResponse.json({ error: "Your vote could not be saved. Please try again." }, { status: 500 });
  }
}
