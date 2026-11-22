
import Link from "next/link";

const NAV = [
  { label: "Homepage", href: "/" },
  { label: "Reverse Phone Lookup UK", href: "/reverse-phone-lookup/" },
  { label: "Scam Calls", href: "/scam-calls/", children: [
    { label: "HMRC Scam Calls", href: "/scam-calls/hmrc-scam-calls/" },
    { label: "Bank Scam Calls", href: "/scam-calls/bank-scam-calls/" },
    { label: "How to Report a Scam Call in the UK", href: "/report-scam-call-uk/" },
  ]},
  { label: "Area Codes", href: "/area-codes/", children: [
    { label: "London — 020", href: "/area-code/020/" },
    { label: "Mobile Numbers — 07 Range", href: "/area-code/07-mobile-numbers/" },
  ]},
  { label: "Top Reported Numbers", href: "/top-reported-numbers/" },
  { label: "Latest Reports", href: "/latest-reports/" },
];

const FOOTER = [
  { title: "Explore", links: [
    ["Homepage", "/"], ["Reverse Phone Lookup UK", "/reverse-phone-lookup/"], ["Scam Calls", "/scam-calls/"],
    ["Area Codes", "/area-codes/"], ["Top Reported Numbers", "/top-reported-numbers/"],
    ["Latest Reports", "/latest-reports/"], ["Report a Number", "/report-a-number/"],
  ]},
  { title: "Company & Trust", links: [
    ["About Us", "/about-us/"], ["Contact Us", "/contact-us/"], ["How It Works", "/how-it-works/"],
    ["How We Calculate Spam Score", "/spam-score/"], ["FAQs", "/faqs/"],
  ]},
  { title: "Popular", links: [
    ["London — 020", "/area-code/020/"], ["Mobile Numbers — 07 Range", "/area-code/07-mobile-numbers/"],
    ["HMRC Scam Calls", "/scam-calls/hmrc-scam-calls/"], ["Bank Scam Calls", "/scam-calls/bank-scam-calls/"],
    ["How to Report a Scam Call in the UK", "/report-scam-call-uk/"],
  ]},
  { title: "Legal", links: [
    ["Privacy Policy", "/privacy-policy/"], ["Terms & Conditions", "/terms-and-conditions/"],
    ["Disclaimer", "/disclaimer/"], ["Cookie Policy", "/cookie-policy/"],
  ]},
];

export function SiteHeader() {
  return (
    <header className="bg-[#0B1F3A] text-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.webp" alt="MyRingCheck" className="h-9 w-9 rounded-full bg-white object-cover" />
          <span>MyRingCheck</span>
        </Link>
        <nav className="flex flex-1 flex-wrap items-center gap-1 text-sm" aria-label="Main navigation">
          {NAV.map((item) =>
            item.children ? (
              <details key={item.href} className="relative">
                <summary className="cursor-pointer rounded-md px-3 py-1.5 hover:bg-white/10 list-none">
                  <Link href={item.href}>{item.label}</Link>
                </summary>
                <div className="absolute left-0 z-20 mt-1 w-64 rounded-md bg-white py-2 text-slate-900 shadow-lg">
                  {item.children.map((c) => (
                    <Link key={c.href} href={c.href} className="block px-4 py-2 hover:bg-slate-100">{c.label}</Link>
                  ))}
                </div>
              </details>
            ) : (
              <Link key={item.href} href={item.href} className="rounded-md px-3 py-1.5 hover:bg-white/10">{item.label}</Link>
            )
          )}
        </nav>
        <Link href="/report-a-number/" className="rounded-md bg-[#00BFA6] px-4 py-2 text-sm font-bold text-[#0B1F3A]">Report a Number</Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 bg-[#0B1F3A] text-white">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:grid-cols-4">
        {FOOTER.map((col) => (
          <div key={col.title}>
            <p className="mb-3 font-bold text-white">{col.title}</p>
            <ul className="space-y-2 text-sm text-slate-300">
              {col.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-white hover:underline">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-400">© MyRingCheck — Check unknown UK numbers for free.</div>
    </footer>
  );
}

export function SiteChrome({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
