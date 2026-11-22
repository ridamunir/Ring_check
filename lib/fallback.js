import { FALLBACK_LANGUAGES, shortCode } from "./languages";

export const FALLBACK_LANGUAGES_DATA = FALLBACK_LANGUAGES;

// In-memory demo data mirroring supabase/seed.sql (MyRingCheck, 25 launch pages + 5 blogs).
// Used by public pages AND admin lists when Supabase is NOT configured.
// Nothing here is saved — connect Supabase to save changes.

export const FALLBACK_PAGES = [
  {
    "id": "00000000-0000-0000-0000-000000000001",
    "slug": "",
    "type": "tool",
    "title": "Homepage (Who Called Me)",
    "language_code": "en-GB",
    "meta_title": "Who Called Me? Check Unknown Numbers \u2014 MyRingCheck",
    "meta_description": "Check any unknown UK number for free. See spam reports, a 0-100 spam score and what other people reported \u2014 no sign-up needed.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000001",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000001",
            "name": "hero_heading",
            "value_html": "<h1>Who called me?</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000002",
            "name": "hero_subtext",
            "value_html": "<p>Enter any unknown UK number and see, in seconds, whether other people reported it as a scam. Free. No sign-up needed.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000003",
            "name": "search_label",
            "value_html": "Search an unknown number",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000004",
            "name": "search_placeholder",
            "value_html": "e.g. 020 7946 0958",
            "sort_order": 3
          },
          {
            "id": "20000000-0000-0000-0000-000000000005",
            "name": "search_button_text",
            "value_html": "Check this number",
            "sort_order": 4
          },
          {
            "id": "20000000-0000-0000-0000-000000000006",
            "name": "search_hint",
            "value_html": "Free. No sign-up needed. We never publish a number owner's name or address.",
            "sort_order": 5
          },
          {
            "id": "20000000-0000-0000-0000-000000000007",
            "name": "search_error_empty",
            "value_html": "Please enter a number first.",
            "sort_order": 6
          },
          {
            "id": "20000000-0000-0000-0000-000000000008",
            "name": "search_error_invalid",
            "value_html": "That does not look like a UK number. Check the digits and try again.",
            "sort_order": 7
          },
          {
            "id": "20000000-0000-0000-0000-000000000009",
            "name": "result_unknown_heading",
            "value_html": "Unknown \u2014 No reports yet",
            "sort_order": 8
          },
          {
            "id": "20000000-0000-0000-0000-000000000010",
            "name": "result_unknown_text",
            "value_html": "Nobody has reported this number yet. That does not mean it is safe \u2014 it only means we have no evidence about it.",
            "sort_order": 9
          },
          {
            "id": "20000000-0000-0000-0000-000000000011",
            "name": "result_first_report_cta",
            "value_html": "Be the first to report it",
            "sort_order": 10
          },
          {
            "id": "20000000-0000-0000-0000-000000000012",
            "name": "result_score_label",
            "value_html": "Spam score",
            "sort_order": 11
          },
          {
            "id": "20000000-0000-0000-0000-000000000013",
            "name": "result_reports_label",
            "value_html": "Reports",
            "sort_order": 12
          },
          {
            "id": "20000000-0000-0000-0000-000000000014",
            "name": "result_origin_label",
            "value_html": "Number origin",
            "sort_order": 13
          },
          {
            "id": "20000000-0000-0000-0000-000000000015",
            "name": "result_origin_note",
            "value_html": "This is where the number was allocated, not where the caller is \u2014 the caller may be anywhere, and the number may be spoofed.",
            "sort_order": 14
          },
          {
            "id": "20000000-0000-0000-0000-000000000016",
            "name": "vote_safe_button",
            "value_html": "Safe",
            "sort_order": 15
          },
          {
            "id": "20000000-0000-0000-0000-000000000017",
            "name": "vote_unsafe_button",
            "value_html": "Unsafe / Spam",
            "sort_order": 16
          },
          {
            "id": "20000000-0000-0000-0000-000000000018",
            "name": "vote_thanks",
            "value_html": "Thanks \u2014 your vote has been counted.",
            "sort_order": 17
          },
          {
            "id": "20000000-0000-0000-0000-000000000019",
            "name": "report_heading",
            "value_html": "Report this number",
            "sort_order": 18
          },
          {
            "id": "20000000-0000-0000-0000-000000000020",
            "name": "report_submit_button",
            "value_html": "Submit report",
            "sort_order": 19
          },
          {
            "id": "20000000-0000-0000-0000-000000000021",
            "name": "report_thanks",
            "value_html": "Thanks \u2014 your report helps warn the next person.",
            "sort_order": 20
          },
          {
            "id": "20000000-0000-0000-0000-000000000022",
            "name": "trust_note",
            "value_html": "We never publish the number owner's name or address. We show the evidence, not just a score.",
            "sort_order": 21
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000002",
        "title": "How It Works",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000023",
            "name": "how_heading",
            "value_html": "<h2>How it works</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000024",
            "name": "how_step1",
            "value_html": "<h3>1. Search the number</h3><p>Type the full UK number, including the area code. Spaces, +44 and 0044 all work.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000025",
            "name": "how_step2",
            "value_html": "<h3>2. Read the evidence</h3><p>See reports from other people, the spam score, and what the caller asked for.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000026",
            "name": "how_step3",
            "value_html": "<h3>3. Decide what to do</h3><p>Block the number, call 159 if it was a bank scam, or forward scam texts to 7726.</p>",
            "sort_order": 3
          },
          {
            "id": "20000000-0000-0000-0000-000000000027",
            "name": "how_step4",
            "value_html": "<h3>4. Vote or report</h3><p>Your vote and report warn the next person who gets the same call.</p>",
            "sort_order": 4
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000003",
        "title": "Identify Section",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000028",
            "name": "identify_heading",
            "value_html": "<h2>Who called me? How to identify an unknown UK caller</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000029",
            "name": "identify_intro",
            "value_html": "<p>A missed call from a number you do not recognise is not, by itself, a scam. But in the UK it is very often a scam, a sales call, or a wrong number. The fastest check is the number itself: search it here before you call back.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000030",
            "name": "identify_h3_1",
            "value_html": "<h3>Start with where the number is allocated</h3><p>020 is London, 0161 is Manchester, 07 is a UK mobile. That tells you where the number was issued \u2014 not where the caller is sitting. A scammer anywhere in the world can show a London number.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000031",
            "name": "identify_h3_2",
            "value_html": "<h3>Then read what other people reported</h3><p>Reports are the real evidence. If ten people say the same number pretended to be HMRC, that is a pattern, not a guess.</p>",
            "sort_order": 3
          },
          {
            "id": "20000000-0000-0000-0000-000000000032",
            "name": "identify_h3_3",
            "value_html": "<h3>No reports yet? That is an answer too</h3><p>Unknown means unknown. It does not mean safe, and it does not mean a scam. Be careful, and be the first to report it if it turns out to be one.</p>",
            "sort_order": 4
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000004",
        "title": "What To Do",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000033",
            "name": "todo_heading",
            "value_html": "<h2>What to do when a scam or nuisance number calls you</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000034",
            "name": "todo_h3_1",
            "value_html": "<h3>Never share a code or bank details on an incoming call</h3><p>No real bank, and no real HMRC officer, will ever ask for your one-time code, your PIN, or your full password on a call they made to you.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000035",
            "name": "todo_h3_2",
            "value_html": "<h3>If it was a bank scam, call 159</h3><p>Hang up, then dial 159 yourself. It connects you to your own bank's fraud team. Never call back a number the caller gave you.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000036",
            "name": "todo_h3_3",
            "value_html": "<h3>Forward scam texts to 7726</h3><p>Forward the message to 7726 \u2014 it is free, and it helps mobile networks block the sender.</p>",
            "sort_order": 3
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000005",
        "title": "Spam Score",
        "sort_order": 4,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000037",
            "name": "score_heading",
            "value_html": "<h2>The spam score, honestly explained</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000038",
            "name": "score_text",
            "value_html": "<p>Every reported number gets a score from 0 to 100. The score comes only from reports and votes that you can see on the page \u2014 never from a secret list. A number with no reports has no score at all: it is Unknown, never Safe. Read the full method on the <a href=\"/spam-score/\">spam score methodology</a> page.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000002",
    "slug": "about-us",
    "type": "foundational",
    "title": "About Us",
    "language_code": "en-GB",
    "meta_title": "About Us \u2014 MyRingCheck",
    "meta_description": "About MyRingCheck \u2014 why we built a free unknown-number checker for the UK.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000006",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000039",
            "name": "hero_heading",
            "value_html": "<h1>About Us</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000040",
            "name": "hero_subtext",
            "value_html": "<p>MyRingCheck is a free community checker for unknown UK numbers. We built it because a missed call should take ten seconds to check \u2014 not a leap of faith.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000007",
        "title": "Mission",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000041",
            "name": "mission_heading",
            "value_html": "<h2>Why we built MyRingCheck</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000042",
            "name": "mission_text",
            "value_html": "<p>Every week, millions of people in the UK get calls from numbers they do not recognise. Some are genuine. Many are scams, sales calls, or robocalls. The big caller-ID apps are built for phones, not for a quick web search \u2014 and they often show a location that misleads more than it helps.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000043",
            "name": "mission_h3",
            "value_html": "<h3>Our mission</h3><p>Give every UK caller a fast, honest answer: what do other people say about this number, and what is the evidence?</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000008",
        "title": "How Data Works",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000044",
            "name": "data_heading",
            "value_html": "<h2>How our data works</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000045",
            "name": "data_h3_1",
            "value_html": "<h3>Reports come from people like you</h3><p>When someone gets a suspicious call, they report it here. Reports are checked before they are published.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000046",
            "name": "data_h3_2",
            "value_html": "<h3>Public alerts add the patterns</h3><p>We also follow public scam alerts from Action Fraud, Ofcom, HMRC and the banks \u2014 the patterns, never copied comments.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000047",
            "name": "data_h3_3",
            "value_html": "<h3>We never publish names or addresses</h3><p>A number is not a person. We show the number, its allocation, and the evidence. We never publish who owns a number.</p>",
            "sort_order": 3
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000003",
    "slug": "contact-us",
    "type": "foundational",
    "title": "Contact Us",
    "language_code": "en-GB",
    "meta_title": "Contact Us \u2014 MyRingCheck",
    "meta_description": "Contact MyRingCheck \u2014 ask a question, request a number removal, or correct a report.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000009",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000048",
            "name": "hero_heading",
            "value_html": "<h1>Contact Us</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000049",
            "name": "hero_subtext",
            "value_html": "<p>Use the form below. We read every message and reply as soon as we can.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000010",
        "title": "Removal",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000050",
            "name": "removal_heading",
            "value_html": "<h2>Number removal and corrections</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000051",
            "name": "removal_text",
            "value_html": "<p>If a number that belongs to you is wrongly reported, use the form and choose \"Number removal\" or \"Report correction\". Tell us the number and what is wrong, and we will review it. A wrong report is corrected \u2014 it is not left up to harm someone.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000052",
            "name": "removal_h3",
            "value_html": "<h3>What to include in your request</h3><p>The number, what is wrong with the report, and a way for us to contact you if we need more detail.</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000011",
        "title": "Business",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000053",
            "name": "business_heading",
            "value_html": "<h2>Business and API enquiries</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000054",
            "name": "business_text",
            "value_html": "<p>If you run a call-blocking app, a security product or a telecom service and want to talk about our data, choose \"Business / API\" in the form.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000055",
            "name": "business_h3",
            "value_html": "<h3>What we can talk about</h3><p>Data licensing, API access, and partnerships \u2014 not individual number lookups, which are free on the site.</p>",
            "sort_order": 2
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000004",
    "slug": "how-it-works",
    "type": "foundational",
    "title": "How It Works",
    "language_code": "en-GB",
    "meta_title": "How It Works \u2014 MyRingCheck",
    "meta_description": "How MyRingCheck works: search a number, read the reports, check the score, vote or report.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000012",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000056",
            "name": "hero_heading",
            "value_html": "<h1>How It Works</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000057",
            "name": "hero_subtext",
            "value_html": "<p>Four steps, about ten seconds. No account, no payment, no app to install.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000013",
        "title": "Steps",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000058",
            "name": "step1",
            "value_html": "<h2>Step 1 \u2014 Search the number</h2><h3>Type the full number</h3><p>Enter the number exactly as it appeared on your phone, including the area code. Spaces, +44 and 0044 all work.</p>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000059",
            "name": "step2",
            "value_html": "<h2>Step 2 \u2014 Check the origin and type</h2><h3>Allocation, not location</h3><p>We show where the number was allocated (for example, 020 is London) and whether it is a landline, mobile, freephone or VoIP range. The caller's real location is always shown as Unknown \u2014 caller ID can be spoofed.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000060",
            "name": "step3",
            "value_html": "<h2>Step 3 \u2014 Read the reports and the score</h2><h3>Evidence first, score second</h3><p>Reports tell you what the caller actually said or asked for. The 0\u2013100 spam score is only a summary of that evidence.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000061",
            "name": "step4",
            "value_html": "<h2>Step 4 \u2014 Vote or report</h2><h3>Warn the next person</h3><p>Mark the number Safe or Unsafe, or write a short report. Reports are checked before they go live.</p>",
            "sort_order": 3
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000005",
    "slug": "spam-score",
    "type": "foundational",
    "title": "How We Calculate Spam Score",
    "language_code": "en-GB",
    "meta_title": "How We Calculate the Spam Score \u2014 MyRingCheck",
    "meta_description": "How the MyRingCheck 0-100 spam score is calculated \u2014 reports, votes, recency and pattern signals, explained simply.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000014",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000062",
            "name": "hero_heading",
            "value_html": "<h1>How We Calculate Spam Score</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000063",
            "name": "hero_subtext",
            "value_html": "<p>Our score is a signal, not a verdict. It is built only from evidence you can see on the number page.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000015",
        "title": "Formula",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000064",
            "name": "formula_heading",
            "value_html": "<h2>The formula, in plain words</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000065",
            "name": "formula_text",
            "value_html": "<p>Each approved report adds to the score, with extra weight when the report is in the scam category. Unsafe votes add a little more; Safe votes pull the score down. Very old reports count less than recent ones, because scammers change numbers quickly.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000066",
            "name": "formula_h3",
            "value_html": "<h3>What goes into the score</h3><p>Report count, report category, Unsafe vote share, how recent the reports are, and pattern signals \u2014 did the caller ask for a one-time code, bank details, or use threats?</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000016",
        "title": "Bands",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000067",
            "name": "bands_heading",
            "value_html": "<h2>Score bands</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000068",
            "name": "bands_text",
            "value_html": "<p><strong>Unknown (no reports):</strong> no score at all \u2014 we know nothing about this number yet. <strong>Low (under 25):</strong> few negative signals. <strong>Medium (25\u201349):</strong> some negative reports. <strong>High (50\u201374):</strong> many reports or a clear scam pattern. <strong>Dangerous (75\u2013100):</strong> a strong, repeated scam pattern.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000069",
            "name": "bands_h3",
            "value_html": "<h3>Why evidence matters more than the score</h3><p>Two numbers can have the same score for different reasons. Always read the reports \u2014 they tell you what the caller actually did.</p>",
            "sort_order": 2
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000006",
    "slug": "report-a-number",
    "type": "tool",
    "title": "Report a Number",
    "language_code": "en-GB",
    "meta_title": "Report a Number \u2014 MyRingCheck",
    "meta_description": "Report a scam or nuisance number. Your report is checked, then published to warn the next person.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000017",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000070",
            "name": "hero_heading",
            "value_html": "<h1>Report a Number</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000071",
            "name": "hero_subtext",
            "value_html": "<p>Tell us what happened. Your report is checked by our moderation before it goes live \u2014 no login needed.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000018",
        "title": "Tips",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000072",
            "name": "tips_heading",
            "value_html": "<h2>What makes a good report</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000073",
            "name": "tips_text",
            "value_html": "<p>Write what the caller said, in your own words. Say whether they asked for a code, bank details, or threatened you. Do not include your own name, address, or any personal details.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000074",
            "name": "tips_h3",
            "value_html": "<h3>What happens next</h3><p>Your report waits for moderation. Once approved, it appears on the number page and the spam score updates.</p>",
            "sort_order": 2
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000007",
    "slug": "privacy-policy",
    "type": "foundational",
    "title": "Privacy Policy",
    "language_code": "en-GB",
    "meta_title": "Privacy Policy \u2014 MyRingCheck",
    "meta_description": "How MyRingCheck uses your data \u2014 what we collect, what we never publish, and your rights.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000019",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000075",
            "name": "hero_heading",
            "value_html": "<h1>Privacy Policy</h1>",
            "sort_order": 0
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000020",
        "title": "Data We Collect",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000076",
            "name": "collect_heading",
            "value_html": "<h2>What data we collect</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000077",
            "name": "collect_text",
            "value_html": "<p>We collect the numbers people search for and report, the text of reports, and votes. We do not ask for your name, email or address to search or report a number.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000078",
            "name": "collect_h3",
            "value_html": "<h3>What we never publish</h3><p>We never publish a number owner's name or address, and we never publish personal details from a report.</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000021",
        "title": "Cookies",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000079",
            "name": "cookies_heading",
            "value_html": "<h2>Cookies and analytics</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000080",
            "name": "cookies_text",
            "value_html": "<p>We use cookies to keep the site working and to understand, in aggregate, which pages people visit. See the Cookie Policy for the full list.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000022",
        "title": "Retention",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000081",
            "name": "retention_heading",
            "value_html": "<h2>How long we keep data</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000082",
            "name": "retention_text",
            "value_html": "<p>Reports stay on the site because they are the warning for the next person. If a report is wrong, ask for a correction through the Contact Us page and we will review it.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000023",
        "title": "Rights",
        "sort_order": 4,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000083",
            "name": "rights_heading",
            "value_html": "<h2>Your rights</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000084",
            "name": "rights_text",
            "value_html": "<p>If you believe a number that belongs to you is wrongly listed, contact us and we will review the reports and remove or correct them where they are wrong.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000008",
    "slug": "terms-and-conditions",
    "type": "foundational",
    "title": "Terms & Conditions",
    "language_code": "en-GB",
    "meta_title": "Terms & Conditions \u2014 MyRingCheck",
    "meta_description": "Rules for using MyRingCheck \u2014 reports, moderation, and what the score does and does not mean.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000024",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000085",
            "name": "hero_heading",
            "value_html": "<h1>Terms &amp; Conditions</h1>",
            "sort_order": 0
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000025",
        "title": "Use",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000086",
            "name": "use_heading",
            "value_html": "<h2>Using the site</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000087",
            "name": "use_text",
            "value_html": "<p>You may search numbers and read reports for free. You may not use the site to harass anyone, or to collect numbers for spam.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000026",
        "title": "Reports",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000088",
            "name": "reports_heading",
            "value_html": "<h2>Your reports</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000089",
            "name": "reports_text",
            "value_html": "<p>When you submit a report, you confirm it is true to the best of your knowledge. False reports may be removed, and repeat abuse may be blocked.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000090",
            "name": "reports_h3",
            "value_html": "<h3>Moderation</h3><p>We may edit or remove any report that is false, abusive, or contains personal details.</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000027",
        "title": "Score",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000091",
            "name": "score_heading",
            "value_html": "<h2>The score is a signal, not a guarantee</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000092",
            "name": "score_text",
            "value_html": "<p>The spam score is based on community reports. It is not proof that a number is safe or a scam. Always use your own judgement.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000028",
        "title": "Liability",
        "sort_order": 4,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000093",
            "name": "liability_heading",
            "value_html": "<h2>Liability</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000094",
            "name": "liability_text",
            "value_html": "<p>We provide the site as it is. We are not responsible for decisions you make based on a score or a report.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000029",
        "title": "Changes",
        "sort_order": 5,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000095",
            "name": "changes_heading",
            "value_html": "<h2>Changes to these terms</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000096",
            "name": "changes_text",
            "value_html": "<p>We may update these terms from time to time. The version on this page is the current one.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000009",
    "slug": "disclaimer",
    "type": "foundational",
    "title": "Disclaimer",
    "language_code": "en-GB",
    "meta_title": "Disclaimer \u2014 MyRingCheck",
    "meta_description": "Disclaimer \u2014 the spam score is a signal, not a guarantee, and caller location can be spoofed.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000030",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000097",
            "name": "hero_heading",
            "value_html": "<h1>Disclaimer</h1>",
            "sort_order": 0
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000031",
        "title": "Score",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000098",
            "name": "dscore_heading",
            "value_html": "<h2>The score is a signal, not a guarantee</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000099",
            "name": "dscore_text",
            "value_html": "<p>A low score does not prove a number is safe. A high score does not prove a crime was committed. The score summarises community reports only.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000100",
            "name": "dscore_h3",
            "value_html": "<h3>Read the reports, not just the number</h3><p>Two numbers can share a score for different reasons. The reports on the page explain why a number scored the way it did.</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000032",
        "title": "Location",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000101",
            "name": "loc_heading",
            "value_html": "<h2>Caller location is always unknown</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000102",
            "name": "loc_text",
            "value_html": "<p>We show where a number was allocated, not where the caller is. Caller ID can be spoofed, so a London number can be dialled from anywhere in the world.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000103",
            "name": "loc_h3",
            "value_html": "<h3>Why we do not show a city as the caller location</h3><p>Showing a city would look precise and be wrong most of the time. Unknown is the honest answer.</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000033",
        "title": "Advice",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000104",
            "name": "advice_heading",
            "value_html": "<h2>Not financial or legal advice</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000105",
            "name": "advice_text",
            "value_html": "<p>Nothing on this site is financial or legal advice. If you think you have been scammed, contact your bank and Action Fraud.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000034",
        "title": "Verify",
        "sort_order": 4,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000106",
            "name": "verify_heading",
            "value_html": "<h2>Always verify with the official body</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000107",
            "name": "verify_text",
            "value_html": "<p>If a caller claims to be from HMRC, your bank, or any official body, hang up and contact that organisation through its official number \u2014 never through a number the caller gave you.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000010",
    "slug": "cookie-policy",
    "type": "foundational",
    "title": "Cookie Policy",
    "language_code": "en-GB",
    "meta_title": "Cookie Policy \u2014 MyRingCheck",
    "meta_description": "How MyRingCheck uses cookies \u2014 necessary, analytics and advertising cookies, and how to turn them off.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000035",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000108",
            "name": "hero_heading",
            "value_html": "<h1>Cookie Policy</h1>",
            "sort_order": 0
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000036",
        "title": "What",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000109",
            "name": "what_heading",
            "value_html": "<h2>What cookies are</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000110",
            "name": "what_text",
            "value_html": "<p>Cookies are small files stored in your browser. They remember settings and help us understand how the site is used.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000037",
        "title": "Types",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000111",
            "name": "types_heading",
            "value_html": "<h2>Which cookies we use</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000112",
            "name": "types_h3_1",
            "value_html": "<h3>Necessary cookies</h3><p>These keep the site working, for example remembering your vote on a number.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000113",
            "name": "types_h3_2",
            "value_html": "<h3>Analytics cookies</h3><p>These tell us, in aggregate, which pages people visit. They do not identify you.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000114",
            "name": "types_h3_3",
            "value_html": "<h3>Advertising cookies</h3><p>If advertising is shown in future, the advertising provider may set its own cookies. We do not control those.</p>",
            "sort_order": 3
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000038",
        "title": "Control",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000115",
            "name": "control_heading",
            "value_html": "<h2>How to turn cookies off</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000116",
            "name": "control_text",
            "value_html": "<p>You can block or delete cookies in your browser settings. The site will still work, but some features may not remember your choices.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000011",
    "slug": "top-reported-numbers",
    "type": "foundational",
    "title": "Top Reported Numbers",
    "language_code": "en-GB",
    "meta_title": "Top Reported Numbers \u2014 MyRingCheck",
    "meta_description": "The most reported scam and nuisance numbers in the UK, updated daily from community reports.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000039",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000117",
            "name": "hero_heading",
            "value_html": "<h1>Top Reported Numbers</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000118",
            "name": "hero_subtext",
            "value_html": "<p>The numbers with the most reports in the last 30 days, sorted by reports and spam score. The list updates automatically as new reports are approved.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000012",
    "slug": "latest-reports",
    "type": "foundational",
    "title": "Latest Reports",
    "language_code": "en-GB",
    "meta_title": "Latest Reports \u2014 MyRingCheck",
    "meta_description": "The latest scam and nuisance call reports from the MyRingCheck community.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000040",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000119",
            "name": "hero_heading",
            "value_html": "<h1>Latest Reports</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000120",
            "name": "hero_subtext",
            "value_html": "<p>The newest approved reports, most recent first. Each report is written by a real person who got the call.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000013",
    "slug": "reverse-phone-lookup",
    "type": "foundational",
    "title": "Reverse Phone Lookup UK",
    "language_code": "en-GB",
    "meta_title": "Reverse Phone Lookup UK \u2014 MyRingCheck",
    "meta_description": "What reverse phone lookup means in the UK \u2014 what you can find out for free, and what you cannot.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000041",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000121",
            "name": "hero_heading",
            "value_html": "<h1>Reverse Phone Lookup UK</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000122",
            "name": "hero_subtext",
            "value_html": "<p>Reverse phone lookup means starting with a number and finding out what is known about it. In the UK, that is a lot less \u2014 and a lot more honest \u2014 than the paid sites promise.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000042",
        "title": "What You Get",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000123",
            "name": "get_heading",
            "value_html": "<h2>What you get in the UK</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000124",
            "name": "get_h3_1",
            "value_html": "<h3>Number origin and type</h3><p>Where the number was allocated, and whether it is a landline, mobile, freephone or VoIP range.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000125",
            "name": "get_h3_2",
            "value_html": "<h3>Community reports and a spam score</h3><p>What other people said about the caller, and a score built only from that evidence.</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000043",
        "title": "What You Dont Get",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000126",
            "name": "not_heading",
            "value_html": "<h2>What you do NOT get</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000127",
            "name": "not_text",
            "value_html": "<p>You do not get the owner's name or address. In the UK that information is not public, and any site that sells it to you is selling data of doubtful legality. We never publish it.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000128",
            "name": "not_h3",
            "value_html": "<h3>Free vs paid</h3><p>Paid data brokers mainly sell US data. For a UK number, the honest free check \u2014 origin, type, reports, score \u2014 is usually all you need.</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000044",
        "title": "How To",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000129",
            "name": "how_heading",
            "value_html": "<h2>How to check a number</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000130",
            "name": "how_text",
            "value_html": "<p>Search the number on the <a href=\"/\">homepage</a>. Read the reports. If there are none, treat the number as Unknown and be careful. Then vote or report it yourself.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000014",
    "slug": "scam-calls",
    "type": "hub",
    "title": "Scam Calls",
    "language_code": "en-GB",
    "meta_title": "Scam Calls \u2014 MyRingCheck",
    "meta_description": "The main scam call types in the UK \u2014 HMRC, bank, delivery and more \u2014 and what to do about each one.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000045",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000131",
            "name": "hero_heading",
            "value_html": "<h1>Scam Calls</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000132",
            "name": "hero_subtext",
            "value_html": "<p>Scam calls follow a small number of scripts. Learn the scripts, and the call stops working on you.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000046",
        "title": "Types",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000133",
            "name": "types_heading",
            "value_html": "<h2>The main scam call types</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000134",
            "name": "types_h3_1",
            "value_html": "<h3>HMRC and tax scams</h3><p>Recorded messages about unpaid tax, arrest warrants and suspended National Insurance numbers. HMRC never works this way \u2014 see the <a href=\"/scam-calls/hmrc-scam-calls/\">HMRC scam calls</a> page.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000135",
            "name": "types_h3_2",
            "value_html": "<h3>Bank scams</h3><p>Callers pretending to be your bank, asking you to move money to a safe account. Real banks never ask this \u2014 see the <a href=\"/scam-calls/bank-scam-calls/\">bank scam calls</a> page.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000136",
            "name": "types_h3_3",
            "value_html": "<h3>Delivery and parcel scams</h3><p>Texts and calls about a missed delivery, with a link to pay a small fee. The link steals your card details.</p>",
            "sort_order": 3
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000047",
        "title": "Signs",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000137",
            "name": "signs_heading",
            "value_html": "<h2>Universal warning signs</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000138",
            "name": "signs_text",
            "value_html": "<p>Urgency (\"act now or else\"), secrecy (\"do not tell your bank\"), and a request for a code, a password, or a payment by gift card or bank transfer. Any one of these is enough to hang up.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000048",
        "title": "What To Do",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000139",
            "name": "do_heading",
            "value_html": "<h2>What to do when a scam call comes in</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000140",
            "name": "do_text",
            "value_html": "<p>Hang up. Do not press 1, do not call back the number they gave you. If it was a bank scam, call 159. If it was a text, forward it to 7726. Then <a href=\"/report-a-number/\">report the number</a> here.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000015",
    "slug": "hmrc-scam-calls",
    "type": "subpage",
    "parent_id": "00000000-0000-0000-0000-000000000014",
    "title": "HMRC Scam Calls",
    "language_code": "en-GB",
    "meta_title": "HMRC Scam Calls \u2014 MyRingCheck",
    "meta_description": "HMRC scam calls explained \u2014 the three scripts, what HMRC actually does, and what to do if you get one.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000049",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000141",
            "name": "hero_heading",
            "value_html": "<h1>HMRC Scam Calls</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000142",
            "name": "hero_subtext",
            "value_html": "<p>HMRC scam calls are the most reported scam in the UK. They all follow the same scripts \u2014 and HMRC never uses any of them.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000050",
        "title": "Scripts",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000143",
            "name": "scripts_heading",
            "value_html": "<h2>The three HMRC scripts</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000144",
            "name": "scripts_h3_1",
            "value_html": "<h3>1. The recorded message</h3><p>A robot voice says a tax case has been opened and you must press 1 to speak to an officer.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000145",
            "name": "scripts_h3_2",
            "value_html": "<h3>2. The returned letter</h3><p>A letter was returned undelivered, so legal action is starting. It never was.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000146",
            "name": "scripts_h3_3",
            "value_html": "<h3>3. The arrest threat</h3><p>A warrant has been issued and police are on their way unless you pay now. HMRC does not arrest people by phone.</p>",
            "sort_order": 3
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000051",
        "title": "What HMRC Does",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000147",
            "name": "real_heading",
            "value_html": "<h2>What HMRC actually does</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000148",
            "name": "real_text",
            "value_html": "<p>HMRC writes to you by post. It never robocalls you, never calls from a mobile number, never asks for payment by gift card, and never threatens arrest on a call. Its real contact number is 0300 200 3300.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000052",
        "title": "If You Got One",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000149",
            "name": "if_heading",
            "value_html": "<h2>If you got an HMRC scam call</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000150",
            "name": "if_text",
            "value_html": "<p>Hang up, do not press 1, and do not pay anything. Report the number here, and forward any related scam text to 7726. If you already paid, call your bank immediately and report it to Action Fraud.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000016",
    "slug": "bank-scam-calls",
    "type": "subpage",
    "parent_id": "00000000-0000-0000-0000-000000000014",
    "title": "Bank Scam Calls",
    "language_code": "en-GB",
    "meta_title": "Bank Scam Calls \u2014 MyRingCheck",
    "meta_description": "Bank scam calls explained \u2014 the safe account trick, what your bank will never ask, and calling 159.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000053",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000151",
            "name": "hero_heading",
            "value_html": "<h1>Bank Scam Calls</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000152",
            "name": "hero_subtext",
            "value_html": "<p>A caller says they are from your bank and your money is at risk. It sounds urgent and official. It is the most expensive scam in the UK.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000054",
        "title": "Scripts",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000153",
            "name": "bscripts_heading",
            "value_html": "<h2>The bank scam scripts</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000154",
            "name": "bscripts_h3_1",
            "value_html": "<h3>The safe account</h3><p>Move your money to a safe account while we investigate. The safe account belongs to the scammer.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000155",
            "name": "bscripts_h3_2",
            "value_html": "<h3>The suspicious payment</h3><p>A large payment is about to leave your account. Confirm your details so we can stop it.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000156",
            "name": "bscripts_h3_3",
            "value_html": "<h3>The code check</h3><p>Read out the code we just sent you, so we know it is really you. That code lets them into your account.</p>",
            "sort_order": 3
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000055",
        "title": "What Bank Never Does",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000157",
            "name": "never_heading",
            "value_html": "<h2>What your bank will never ask</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000158",
            "name": "never_text",
            "value_html": "<p>Your bank will never ask for your full password, your PIN, or a one-time code on a call. It will never ask you to move money to a safe account, and never ask you to download software during a call.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000056",
        "title": "159",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000159",
            "name": "n159_heading",
            "value_html": "<h2>If you get a bank scam call, call 159</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000160",
            "name": "n159_text",
            "value_html": "<p>Hang up. Then dial 159 yourself \u2014 it connects you to your own bank's fraud team. Never call back a number the caller gave you. Read the full 159 guide in our blog: <a href=\"/blog/159-bank-scam-number/\">159: the number to call if a bank scam call comes in</a>.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000017",
    "slug": "area-codes",
    "type": "hub",
    "title": "Area Codes",
    "language_code": "en-GB",
    "meta_title": "UK Area Codes \u2014 MyRingCheck",
    "meta_description": "UK area codes explained \u2014 what a number's prefix tells you, and what it does not.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000057",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000161",
            "name": "hero_heading",
            "value_html": "<h1>Area Codes</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000162",
            "name": "hero_subtext",
            "value_html": "<p>An area code tells you where a number was allocated. It does not tell you where the caller is.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000058",
        "title": "Geographic",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000163",
            "name": "geo_heading",
            "value_html": "<h2>Geographic area codes</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000164",
            "name": "geo_text",
            "value_html": "<p>020 is London, 0161 is Manchester, 0121 is Birmingham, 0131 is Edinburgh, 0113 is Leeds. These numbers belong to a place \u2014 but the caller can be anywhere, because caller ID can be spoofed.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000059",
        "title": "NonGeo",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000165",
            "name": "nongeo_heading",
            "value_html": "<h2>Non-geographic ranges</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000166",
            "name": "nongeo_h3_1",
            "value_html": "<h3>07 \u2014 UK mobiles</h3><p>The most common range in the UK, and the most spoofed by scammers pretending to be HMRC or a delivery company.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000167",
            "name": "nongeo_h3_2",
            "value_html": "<h3>0800 \u2014 freephone</h3><p>Free to call. Used by real companies and by telemarketers.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000168",
            "name": "nongeo_h3_3",
            "value_html": "<h3>03 \u2014 UK-wide</h3><p>Charged at the standard rate. Used by government departments, banks and large companies \u2014 and by scammers copying them.</p>",
            "sort_order": 3
          },
          {
            "id": "20000000-0000-0000-0000-000000000169",
            "name": "nongeo_h3_4",
            "value_html": "<h3>070 \u2014 personal numbers</h3><p>Expensive to call back and often used in scams. Be very careful with 070 numbers.</p>",
            "sort_order": 4
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000060",
        "title": "Use",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000170",
            "name": "use_heading",
            "value_html": "<h2>How to use an area code sensibly</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000171",
            "name": "use_text",
            "value_html": "<p>Use the area code as a first clue, then search the number itself. The reports on the number page matter far more than the prefix.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000018",
    "slug": "020",
    "type": "subpage",
    "parent_id": "00000000-0000-0000-0000-000000000017",
    "title": "London \u2014 020",
    "language_code": "en-GB",
    "meta_title": "London 020 Area Code \u2014 MyRingCheck",
    "meta_description": "The 020 London area code \u2014 what it means, why scammers spoof it, and how to check a 020 number.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000061",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000172",
            "name": "hero_heading",
            "value_html": "<h1>London \u2014 020</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000173",
            "name": "hero_subtext",
            "value_html": "<p>020 is the area code for London. It is also one of the most spoofed prefixes in the UK.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000062",
        "title": "What",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000174",
            "name": "what_heading",
            "value_html": "<h2>What 020 means</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000175",
            "name": "what_text",
            "value_html": "<p>A 020 number was allocated in London. That is all it means. It does not mean the caller is in London, works in London, or is who they say they are.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000176",
            "name": "what_h3",
            "value_html": "<h3>020 numbers are also used by real London businesses</h3><p>Not every 020 call is a scam. Check the number itself \u2014 the reports tell you which ones are.</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000063",
        "title": "Spoofing",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000177",
            "name": "spoof_heading",
            "value_html": "<h2>Why scammers love 020</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000178",
            "name": "spoof_text",
            "value_html": "<p>London sounds official. A scam call from a 020 number feels more trustworthy than one from an unknown mobile \u2014 which is exactly why scammers spoof it. Read our full guide: <a href=\"/blog/020-number-spoofing/\">Why a London (020) number can call you from abroad</a>.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000179",
            "name": "spoof_h3",
            "value_html": "<h3>The story is the giveaway, not the prefix</h3><p>An HMRC call from a London number that asks you to press 1 is a scam \u2014 HMRC never works that way, whatever the number looks like.</p>",
            "sort_order": 2
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000064",
        "title": "Check",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000180",
            "name": "check_heading",
            "value_html": "<h2>How to check a 020 number</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000181",
            "name": "check_text",
            "value_html": "<p>Search the full number on the <a href=\"/\">homepage</a>. If other people reported it, you will see the reports and the score. If there are no reports, treat it as Unknown.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000019",
    "slug": "07-mobile-numbers",
    "type": "subpage",
    "parent_id": "00000000-0000-0000-0000-000000000017",
    "title": "Mobile Numbers \u2014 07 Range",
    "language_code": "en-GB",
    "meta_title": "UK 07 Mobile Numbers \u2014 MyRingCheck",
    "meta_description": "The UK 07 mobile range \u2014 why most scam calls come from 07 numbers, and how to check one.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000065",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000182",
            "name": "hero_heading",
            "value_html": "<h1>Mobile Numbers \u2014 07 Range</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000183",
            "name": "hero_subtext",
            "value_html": "<p>07 is the UK mobile range. Most scam calls in the UK come from 07 numbers \u2014 because most people trust a mobile number.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000066",
        "title": "What",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000184",
            "name": "mwhat_heading",
            "value_html": "<h2>What 07 means</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000185",
            "name": "mwhat_text",
            "value_html": "<p>07 numbers are UK mobiles. They are cheap to get, easy to replace, and hard to trace \u2014 which is why scammers use them and throw them away.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000067",
        "title": "Scams",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000186",
            "name": "mscams_heading",
            "value_html": "<h2>Common 07 scams</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000187",
            "name": "mscams_h3_1",
            "value_html": "<h3>HMRC from a mobile</h3><p>HMRC never calls from a mobile. Any HMRC call from an 07 number is a scam.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000188",
            "name": "mscams_h3_2",
            "value_html": "<h3>Hi Mum / Hi Dad</h3><p>A text from a new number pretending to be your child, asking for money. Always call your child on their old number first.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000189",
            "name": "mscams_h3_3",
            "value_html": "<h3>Delivery texts</h3><p>A missed delivery message with a link to pay a fee. The link steals your card details.</p>",
            "sort_order": 3
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000068",
        "title": "Check",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000190",
            "name": "mcheck_heading",
            "value_html": "<h2>How to check an 07 number</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000191",
            "name": "mcheck_text",
            "value_html": "<p>Search it on the <a href=\"/\">homepage</a> before you reply or call back. A number with reports will show them; a number with none is Unknown, not Safe.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000020",
    "slug": "report-scam-call-uk",
    "type": "pillar",
    "title": "How to Report a Scam Call in the UK",
    "language_code": "en-GB",
    "meta_title": "How to Report a Scam Call in the UK \u2014 MyRingCheck",
    "meta_description": "How to report a scam call in the UK \u2014 7726 for texts, 159 for bank scams, Action Fraud, and reporting the number here.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000069",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000192",
            "name": "hero_heading",
            "value_html": "<h1>How to Report a Scam Call in the UK</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000193",
            "name": "hero_subtext",
            "value_html": "<p>Reporting takes two minutes. It protects the next person \u2014 and it helps the networks and the police shut the scammers down.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000070",
        "title": "Steps",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000194",
            "name": "rsteps_heading",
            "value_html": "<h2>Report it in three places</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000195",
            "name": "rsteps_h3_1",
            "value_html": "<h3>1. Report the number here</h3><p>Use the <a href=\"/report-a-number/\">Report a Number</a> form. Say what the caller said and what they asked for.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000196",
            "name": "rsteps_h3_2",
            "value_html": "<h3>2. Forward scam texts to 7726</h3><p>Forward the message to 7726. It is free, and your network uses it to block the sender. Full guide: <a href=\"/blog/report-scam-text-7726/\">How to report a scam text to 7726</a>.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000197",
            "name": "rsteps_h3_3",
            "value_html": "<h3>3. Bank scam? Call 159. Lost money? Action Fraud</h3><p>If it was a bank scam, hang up and call 159. If you lost money, report it to Action Fraud (0300 123 2040) and your bank.</p>",
            "sort_order": 3
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000071",
        "title": "What Happens",
        "sort_order": 2,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000198",
            "name": "happens_heading",
            "value_html": "<h2>What happens after you report</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000199",
            "name": "happens_text",
            "value_html": "<p>Your report is checked, then published on the number page. Other people who search the same number will see the warning before they answer or call back.</p>",
            "sort_order": 1
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000072",
        "title": "Evidence",
        "sort_order": 3,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000200",
            "name": "ev_heading",
            "value_html": "<h2>Keep the evidence</h2>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000201",
            "name": "ev_text",
            "value_html": "<p>Do not delete the call log or the text. Screenshot the message, note the date and time, and keep any payment records. Action Fraud and your bank may ask for them.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000101",
    "slug": "report-scam-text-7726",
    "type": "blog",
    "title": "How to Report a Scam Text to 7726 (UK)",
    "language_code": "en-GB",
    "meta_title": "How to Report a Scam Text to 7726 (UK) \u2014 MyRingCheck",
    "meta_description": "Forward a scam text to 7726 for free. Step by step: what 7726 is, what to forward, and what happens next.",
    "canonical_url": "",
    "featured_image": "/blog-7726.svg",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000073",
        "title": "Blog Content",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000202",
            "name": "draft_note",
            "value_html": "<p><strong>Draft template \u2014 dummy content. Nomi will replace this text with the final post.</strong></p>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000203",
            "name": "intro",
            "value_html": "<h2>What 7726 is</h2><p>7726 is the UK's free service for reporting scam texts. It is run by the mobile networks. It is for texts only \u2014 not for calls.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000204",
            "name": "steps",
            "value_html": "<h2>How to forward a scam text to 7726</h2><h3>Step 1 \u2014 Forward, do not reply</h3><p>Forward the message to 7726. Do not reply to the sender and do not click any link in the message.</p><h3>Step 2 \u2014 Send the sender's number if asked</h3><p>Your network may ask for the number the text came from. Send it exactly as shown.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000205",
            "name": "after",
            "value_html": "<h2>What happens after you report</h2><p>Your network investigates the sender and can block the number. Reporting also helps the networks spot new scam campaigns early.</p>",
            "sort_order": 3
          },
          {
            "id": "20000000-0000-0000-0000-000000000206",
            "name": "free",
            "value_html": "<h2>Is 7726 free?</h2><p>Yes. Forwarding a text to 7726 is free on all UK networks.</p>",
            "sort_order": 4
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000074",
        "title": "Closing",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000207",
            "name": "closing",
            "value_html": "<h2>Received one of these texts?</h2><p>Search the sender's number on the <a href=\"/\">homepage</a> to see if other people reported it too.</p>",
            "sort_order": 0
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000102",
    "slug": "159-bank-scam-number",
    "type": "blog",
    "title": "159: The Number to Call If a Bank Scam Call Comes In",
    "language_code": "en-GB",
    "meta_title": "159: The Number to Call If a Bank Scam Call Comes In \u2014 MyRingCheck",
    "meta_description": "What is 159? Hang up on a bank scam call, then dial 159 yourself to reach your own bank's fraud team.",
    "canonical_url": "",
    "featured_image": "/blog-159.svg",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000075",
        "title": "Blog Content",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000208",
            "name": "draft_note",
            "value_html": "<p><strong>Draft template \u2014 dummy content. Nomi will replace this text with the final post.</strong></p>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000209",
            "name": "intro",
            "value_html": "<h2>What 159 is</h2><p>159 is the Stop Scams UK number. When you dial it, you are connected to your own bank's fraud team \u2014 the real one, not the caller.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000210",
            "name": "when",
            "value_html": "<h2>When to call 159</h2><h3>A bank call that feels wrong</h3><p>If a caller says they are from your bank and asks you to move money, share a code, or confirm details, hang up first \u2014 then dial 159 yourself.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000211",
            "name": "what",
            "value_html": "<h2>What happens when you call 159</h2><p>You choose your bank from a menu and speak to its fraud team. They can check your account and stop a payment if it is still in time.</p>",
            "sort_order": 3
          },
          {
            "id": "20000000-0000-0000-0000-000000000212",
            "name": "never",
            "value_html": "<h2>Never call back the caller's number</h2><p>Always dial 159 yourself from your own phone. A number the caller gave you may go straight back to the scammers.</p>",
            "sort_order": 4
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000076",
        "title": "Closing",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000213",
            "name": "closing",
            "value_html": "<h2>Received one of these calls?</h2><p>Search the number on the <a href=\"/\">homepage</a> and report it so the next person is warned.</p>",
            "sort_order": 0
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000103",
    "slug": "block-unknown-number",
    "type": "blog",
    "title": "How to Block an Unknown Number on iPhone and Android (UK)",
    "language_code": "en-GB",
    "meta_title": "How to Block an Unknown Number on iPhone and Android (UK) \u2014 MyRingCheck",
    "meta_description": "Block an unknown number on iPhone and Android, use Silence Unknown Callers, and report the number afterwards.",
    "canonical_url": "",
    "featured_image": "/blog-block.svg",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000077",
        "title": "Blog Content",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000214",
            "name": "draft_note",
            "value_html": "<p><strong>Draft template \u2014 dummy content. Nomi will replace this text with the final post.</strong></p>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000215",
            "name": "intro",
            "value_html": "<h2>Blocking, in short</h2><p>Blocking stops that number from calling you again. It does not stop the scammers \u2014 they change numbers. Report the number too, so others are warned.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000216",
            "name": "iphone",
            "value_html": "<h2>Block on iPhone</h2><h3>From Recents</h3><p>Open Phone, tap Recents, tap the i next to the number, then Block this Caller. You can also turn on Silence Unknown Callers in Settings, Phone.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000217",
            "name": "android",
            "value_html": "<h2>Block on Android</h2><h3>From the Phone app</h3><p>Open Phone, tap Recents, tap the number, then Block. On Samsung phones the option is in the call details menu.</p>",
            "sort_order": 3
          },
          {
            "id": "20000000-0000-0000-0000-000000000218",
            "name": "after",
            "value_html": "<h2>What happens after you block a number</h2><p>The number can no longer call or text you. The caller hears nothing useful \u2014 and you hear nothing at all.</p>",
            "sort_order": 4
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000078",
        "title": "Closing",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000219",
            "name": "closing",
            "value_html": "<h2>Blocked it? Report it too</h2><p>Search the number on the <a href=\"/\">homepage</a> and add a report, so the next person who gets the call sees the warning.</p>",
            "sort_order": 0
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000104",
    "slug": "missed-call-unknown-number",
    "type": "blog",
    "title": "Missed Call from an Unknown Number? Should You Call Back?",
    "language_code": "en-GB",
    "meta_title": "Missed Call from an Unknown Number? Should You Call Back? \u2014 MyRingCheck",
    "meta_description": "A missed call from an unknown number? Check it first. Three checks before you call back, and the one-ring Wangiri warning.",
    "canonical_url": "",
    "featured_image": "/blog-missed.svg",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000079",
        "title": "Blog Content",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000220",
            "name": "draft_note",
            "value_html": "<p><strong>Draft template \u2014 dummy content. Nomi will replace this text with the final post.</strong></p>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000221",
            "name": "intro",
            "value_html": "<h2>First: do not call back straight away</h2><p>A missed call from a number you do not know is not an emergency. Check the number first \u2014 it takes ten seconds.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000222",
            "name": "checks",
            "value_html": "<h2>Three checks before you call back</h2><h3>Check 1 \u2014 Search the number</h3><p>Search it on the <a href=\"/\">homepage</a>. If other people reported it as a scam, do not call back.</p><h3>Check 2 \u2014 Look at the prefix</h3><p>A 070 number or a foreign-looking number is a warning sign. Calling back can be expensive.</p><h3>Check 3 \u2014 Think about what you are expecting</h3><p>Are you waiting for a delivery, a doctor, or a job call? If not, there is no reason to call back.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000223",
            "name": "onering",
            "value_html": "<h2>The one-ring missed call scam</h2><p>Your phone rings once and stops. The scammer wants you to call back a premium-rate number. If it rang once and you do not know the number, do not call back.</p>",
            "sort_order": 3
          },
          {
            "id": "20000000-0000-0000-0000-000000000224",
            "name": "when",
            "value_html": "<h2>When it is safe to call back</h2><p>When the number has no reports, looks like a normal UK number, and you are expecting a call \u2014 then it is probably fine.</p>",
            "sort_order": 4
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000080",
        "title": "Closing",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000225",
            "name": "closing",
            "value_html": "<h2>Got a missed call just now?</h2><p>Search the number on the <a href=\"/\">homepage</a> before you decide.</p>",
            "sort_order": 0
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000105",
    "slug": "020-number-spoofing",
    "type": "blog",
    "title": "Why a London (020) Number Can Call You from Abroad \u2014 Spoofing Explained",
    "language_code": "en-GB",
    "meta_title": "Why a London (020) Number Can Call You from Abroad \u2014 MyRingCheck",
    "meta_description": "A 020 number does not mean the caller is in London. Caller ID spoofing explained, and how to spot it.",
    "canonical_url": "",
    "featured_image": "/blog-spoofing.svg",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000081",
        "title": "Blog Content",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000226",
            "name": "draft_note",
            "value_html": "<p><strong>Draft template \u2014 dummy content. Nomi will replace this text with the final post.</strong></p>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000227",
            "name": "intro",
            "value_html": "<h2>What spoofing is</h2><p>Caller ID spoofing is when a caller makes any number they like appear on your phone. The number you see is not proof of where the caller is, or who they are.</p>",
            "sort_order": 1
          },
          {
            "id": "20000000-0000-0000-0000-000000000228",
            "name": "why",
            "value_html": "<h2>Why scammers spoof 020</h2><h3>London sounds official</h3><p>A London number feels trustworthy. A scammer in another country can show a 020 number in seconds, using cheap internet calling software.</p>",
            "sort_order": 2
          },
          {
            "id": "20000000-0000-0000-0000-000000000229",
            "name": "signs",
            "value_html": "<h2>How to spot a spoofed call</h2><h3>The story does not match the number</h3><p>HMRC calling from a London landline but asking you to press 1? A bank calling from 020 but asking for your code? The number is real-looking; the story is the giveaway.</p>",
            "sort_order": 3
          },
          {
            "id": "20000000-0000-0000-0000-000000000230",
            "name": "todo",
            "value_html": "<h2>What to do</h2><p>Hang up and call the organisation back on its official number. Search the number here first, and report it if it was a scam.</p>",
            "sort_order": 4
          }
        ]
      },
      {
        "id": "10000000-0000-0000-0000-000000000082",
        "title": "Closing",
        "sort_order": 1,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000231",
            "name": "closing",
            "value_html": "<h2>Got a call from a 020 number you do not know?</h2><p>Search it on the <a href=\"/\">homepage</a> and read the reports before you call back.</p>",
            "sort_order": 0
          }
        ]
      }
    ]
  },
  {
    "id": "00000000-0000-0000-0000-000000000201",
    "slug": "",
    "type": "tool",
    "title": "P\u00e1gina principal (Espa\u00f1ol)",
    "language_code": "es-ES",
    "meta_title": "\u00bfQui\u00e9n me llam\u00f3? Comprueba n\u00fameros desconocidos \u2014 MyRingCheck",
    "meta_description": "Comprueba cualquier n\u00famero desconocido gratis. Consulta informes de spam y qui\u00e9n te llam\u00f3.",
    "canonical_url": "",
    "featured_image": "",
    "status": "published",
    "publish_date": "2026-11-21T00:00:00Z",
    "sections": [
      {
        "id": "10000000-0000-0000-0000-000000000901",
        "title": "Hero Section",
        "sort_order": 0,
        "variables": [
          {
            "id": "20000000-0000-0000-0000-000000000901",
            "name": "hero_heading",
            "value_html": "<h1>\u00bfQui\u00e9n me llam\u00f3?</h1>",
            "sort_order": 0
          },
          {
            "id": "20000000-0000-0000-0000-000000000902",
            "name": "hero_subtext",
            "value_html": "<p>Introduce cualquier n\u00famero y consulta al instante los informes de spam y qui\u00e9n te llam\u00f3.</p>",
            "sort_order": 1
          }
        ]
      }
    ]
  }
];

export function getFallbackPageBySlug(slug, langShort) {
  if (langShort) return FALLBACK_PAGES.find((p) => p.slug === slug && shortCode(p.language_code) === langShort) || null;
  return FALLBACK_PAGES.find((p) => p.slug === slug && shortCode(p.language_code) === "en") || null;
}

export function getFallbackPageById(id) {
  return FALLBACK_PAGES.find((p) => p.id === id) || null;
}

export function getFallbackTranslations(groupId) {
  return FALLBACK_PAGES.filter((p) => (p.translation_group_id || p.id) === groupId);
}
