
import { NextResponse } from "next/server";
import { normalizeUkNumber } from "@/lib/numbers";
import { getNumberData } from "@/lib/tool-data";

export const dynamic = "force-dynamic";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const n = normalizeUkNumber(searchParams.get("number") || "");
  if (!n) return NextResponse.json({ error: "That does not look like a UK number." }, { status: 400 });
  const rec = await getNumberData(n);
  return NextResponse.json({ number: n, data: rec });
}
