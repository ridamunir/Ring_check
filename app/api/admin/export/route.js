import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getAllPages } from "@/lib/data";
import { getPageWithContent } from "@/lib/data";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  // Validates the Supabase access token (or bootstrap session) and, if
  // the access token expired, renews it from the refresh token and
  // persists the new tokens — so the panel keeps working past the
  // 1-hour Supabase JWT expiry without forcing a re-login.
  const { user } = await getSessionUser({ persistRefresh: true });
  return Boolean(user);
}

function csvEscape(v) {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

function sqlEscape(v) {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
}

export async function GET(req) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "csv";

  const pages = await getAllPages();
  const full = [];
  for (const p of pages) {
    const withContent = await getPageWithContent(p.id);
    full.push(withContent || p);
  }

  if (format === "sql") {
    const lines = ["-- Admin Panel export", "-- Pages, sections and variables (INSERT statements)"];
    for (const p of full) {
      lines.push(
        `INSERT INTO pages (id, slug, type, parent_id, title, language_code, meta_title, meta_description, canonical_url, featured_image, status, publish_date) VALUES (${sqlEscape(p.id)}, ${sqlEscape(p.slug)}, ${sqlEscape(p.type)}, ${p.parent_id ? sqlEscape(p.parent_id) : "NULL"}, ${sqlEscape(p.title)}, ${sqlEscape(p.language_code)}, ${sqlEscape(p.meta_title)}, ${sqlEscape(p.meta_description)}, ${sqlEscape(p.canonical_url)}, ${sqlEscape(p.featured_image)}, ${sqlEscape(p.status)}, ${p.publish_date ? sqlEscape(p.publish_date) : "NULL"});`
      );
      for (const s of p.sections || []) {
        lines.push(`INSERT INTO sections (id, page_id, title, sort_order) VALUES (${sqlEscape(s.id)}, ${sqlEscape(p.id)}, ${sqlEscape(s.title)}, ${s.sort_order || 0});`);
        for (const v of s.variables || []) {
          lines.push(`INSERT INTO variables (id, section_id, name, value_html, sort_order) VALUES (${sqlEscape(v.id)}, ${sqlEscape(s.id)}, ${sqlEscape(v.name)}, ${sqlEscape(v.value_html)}, ${v.sort_order || 0});`);
        }
      }
    }
    return new NextResponse(lines.join("\n"), {
      headers: { "Content-Type": "text/plain", "Content-Disposition": 'attachment; filename="admin-panel-export.sql"' },
    });
  }

  // CSV (default)
  const rows = [["page_id", "page_slug", "page_type", "page_title", "page_status", "section_title", "variable_name", "variable_value_html"]];
  for (const p of full) {
    if (!p.sections?.length) {
      rows.push([p.id, p.slug, p.type, p.title, p.status, "", "", ""]);
    } else {
      for (const s of p.sections) {
        if (!s.variables?.length) rows.push([p.id, p.slug, p.type, p.title, p.status, s.title, "", ""]);
        for (const v of s.variables || []) {
          rows.push([p.id, p.slug, p.type, p.title, p.status, s.title, v.name, v.value_html]);
        }
      }
    }
  }
  const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
  return new NextResponse(csv, {
    headers: { "Content-Type": "text/csv", "Content-Disposition": 'attachment; filename="admin-panel-export.csv"' },
  });
}
