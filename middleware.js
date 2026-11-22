import { NextResponse } from "next/server";
import { hasSessionCookie } from "./lib/auth";

// Language routing (multilingual, Hybrid method).
//
// English is the default and has NO prefix: /, /[slug], /blog/[slug].
// Any other language gets a 2-letter prefix: /es, /es/[slug],
// /es/blog/[slug]. The middleware REWRITES /{lang}/... to the same
// route without the prefix and sets x-lang (and x-html-lang) headers,
// so the existing English routes keep working unchanged and one route
// serves every language. /en/... redirects (301) to the same URL
// without the prefix. Unknown or disabled language prefixes are NOT
// turned into English content — the page components check the language
// against the enabled-languages list and return 404.
//
// NOTE (Edge limitation): middleware runs on the Edge runtime, where it
// cannot reliably call supabase.auth.getUser() to validate the token.
// So middleware only checks that a session cookie is PRESENT
// (sb-access-token for a Supabase login, or admin_session for a
// bootstrap login). The REAL validity check happens in every server
// route / server component via getCurrentUser() / verifySessionToken()
// in lib/auth.js — an expired or forged token gets a 401 there even
// though middleware let the request through.

const LANG_PREFIX = /^\/([a-z]{2})(\/|$)/;

// Full language code for <html lang>, from the URL prefix.
const FULL_CODE = {
  en: "en-GB",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-PT",
  it: "it-IT",
  nl: "nl-NL",
  no: "nb-NO",
};

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protect everything under /admin except the login page itself.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login" && pathname !== "/admin/login/") {
    if (!hasSessionCookie(req.cookies)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // API routes, static assets and files are never language-routed.
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/tinymce") ||
    pathname === "/favicon.ico" ||
    /\.[a-zA-Z0-9]+$/.test(pathname.split("/").pop())
  ) {
    return NextResponse.next();
  }

  const match = pathname.match(LANG_PREFIX);
  if (!match) return NextResponse.next();

  const code = match[1];
  // FIX (MyRingCheck): only real language codes are rewritten. Without this,
  // "/number/..." was read as language "nu" and "/search" as "se", breaking
  // the tool. Unknown 2-letter prefixes are ordinary routes — pass through.
  const KNOWN_LANGS = new Set(["en", "es", "fr", "de", "pt", "it", "nl", "no", "ur", "ar", "hi", "tr"]);
  if (!KNOWN_LANGS.has(code)) return NextResponse.next();
  const rest = pathname.slice(3); // "/es" -> "", "/es/blog/x" -> "/blog/x"
  const url = req.nextUrl.clone();

  // English has no prefix: /en/... redirects to the same URL without it.
  if (code === "en") {
    url.pathname = rest || "/";
    return NextResponse.redirect(url, 301);
  }

  // Any other 2-letter prefix is a language: rewrite to the same route
  // without the prefix and mark the request with x-lang, so the single
  // /[slug] and /blog/[slug] routes serve every language (the page
  // components read the language from the header and load that
  // language's own slug — translated slugs included). Unknown or
  // disabled prefixes are NOT turned into English content — the page
  // components check the language against the enabled-languages list
  // and return 404.
  const url2 = req.nextUrl.clone();
  url2.pathname = rest || "/";
  const headers = new Headers(req.headers);
  headers.set("x-html-lang", FULL_CODE[code] || `${code}-${code.toUpperCase()}`);
  headers.set("x-lang", code);
  return NextResponse.rewrite(url2, { request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|tinymce).*)"],
};
