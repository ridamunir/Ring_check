
import { redirect } from "next/navigation";
import { normalizeUkNumber } from "@/lib/numbers";
import { recordSearch } from "@/lib/tool-data";
import { SiteChrome } from "@/components/SiteChrome";
import SearchBox from "@/components/SearchBox";

export const dynamic = "force-dynamic";
export const metadata = { title: "Search — MyRingCheck", robots: { index: false } };

export default async function SearchPage({ searchParams }) {
  const raw = searchParams?.number || "";
  if (!raw) {
    return (
      <SiteChrome>
        <main className="mx-auto max-w-3xl px-4 py-10">
          <h1>Search a number</h1>
          <SearchBox error="Please enter a number first." />
        </main>
      </SiteChrome>
    );
  }
  const n = normalizeUkNumber(raw);
  if (!n) {
    return (
      <SiteChrome>
        <main className="mx-auto max-w-3xl px-4 py-10">
          <h1>That number doesn&apos;t look right</h1>
          <p className="mt-3 text-slate-700">“{raw}” is not a valid UK number. Enter a full UK number, for example 020 7946 0958 or 07700 900123.</p>
          <SearchBox error="That does not look like a UK number. Check the digits and try again." />
        </main>
      </SiteChrome>
    );
  }
  await recordSearch(n);
  redirect(`/number/${n}/`);
}
