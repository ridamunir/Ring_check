
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const text = String(body.body || "").trim();
    if (text.length < 5) return NextResponse.json({ error: "Please write your message." }, { status: 400 });
    const admin = getSupabaseAdmin();
    if (admin) {
      const { error } = await admin.from("messages").insert({
        name: body.name || null, email: body.email || null,
        topic: body.topic || "General question", number: body.number || null, body: text,
      });
      if (error) throw new Error(error.message);
    }
    return NextResponse.json({ status: "sent" });
  } catch (e) {
    return NextResponse.json({ error: "Your message could not be sent. Please try again." }, { status: 500 });
  }
}
