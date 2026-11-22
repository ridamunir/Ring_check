
// Number data layer: Supabase when configured, in-memory seed fallback otherwise.
// Votes and searches are NEVER seeded. A counter only grows from a real user
// action (a real search recorded here, or a real vote cast here).
import { getSupabaseAdmin } from "./supabase";
import { computeScore } from "./numbers";

const SEED = [{"number": "08007613372", "category": "telemarketing", "reports": [{"body": "Caller said they were from Sky and offered a cheaper TV and broadband deal. They asked for bank details to set up the new package. The number is reported by many people as Sky telemarketing.", "category": "telemarketing", "asked_otp": false, "asked_bank_details": true, "used_threat": false, "date": "2026-11-19"}, {"body": "A recorded message about a Sky discount, then a person tried to confirm my account details. I did not give anything.", "category": "telemarketing", "asked_otp": false, "asked_bank_details": true, "used_threat": false, "date": "2026-11-17"}]}, {"number": "02079460958", "category": "scam", "reports": [{"body": "Caller claimed to be from an investment recovery firm and said they could get back money lost to a scam, for a fee paid in advance. This is a classic recovery scam.", "category": "scam", "asked_otp": false, "asked_bank_details": true, "used_threat": false, "date": "2026-11-18"}, {"body": "They knew my name and said my investment had been recovered. They wanted a release fee by bank transfer.", "category": "scam", "asked_otp": false, "asked_bank_details": true, "used_threat": false, "date": "2026-11-15"}]}, {"number": "07379885614", "category": "scam", "reports": [{"body": "Recorded message claiming to be HMRC. It said a tax fraud case had been opened against me and I should press 1 to speak to an officer. HMRC never contacts people this way.", "category": "scam", "asked_otp": false, "asked_bank_details": false, "used_threat": true, "date": "2026-11-20"}]}, {"number": "02045376782", "category": "scam", "reports": [{"body": "Caller said they were from a housing association and needed to check my address and bank details for a repair visit. I do not live in housing association property.", "category": "scam", "asked_otp": false, "asked_bank_details": true, "used_threat": false, "date": "2026-11-19"}]}, {"number": "02035661067", "category": "scam", "reports": [{"body": "Caller offered free loft insulation under a government scheme and asked for personal details and a survey appointment. The call followed the usual loft insulation scam script.", "category": "scam", "asked_otp": false, "asked_bank_details": false, "used_threat": false, "date": "2026-11-18"}]}, {"number": "03332029470", "category": "scam", "reports": [{"body": "Caller said they were from British Gas and my account was in arrears. They asked me to pay by bank transfer to avoid disconnection.", "category": "scam", "asked_otp": false, "asked_bank_details": true, "used_threat": true, "date": "2026-11-19"}]}, {"number": "07364165789", "category": "scam", "reports": [{"body": "Missed call, then a text saying I had won a prize and should call back. Calling back a premium-rate number can cost a lot \u2014 this looks like a cost trap.", "category": "scam", "asked_otp": false, "asked_bank_details": false, "used_threat": false, "date": "2026-11-16"}]}, {"number": "07441955492", "category": "scam", "reports": [{"body": "Caller offered guaranteed returns on a crypto investment and pushed me to deposit money the same day through a link they sent.", "category": "scam", "asked_otp": false, "asked_bank_details": true, "used_threat": false, "date": "2026-11-18"}]}, {"number": "07394513075", "category": "scam", "reports": [{"body": "Caller claimed to be from a job agency with a work-from-home job. They asked for a training fee before I could start.", "category": "scam", "asked_otp": false, "asked_bank_details": true, "used_threat": false, "date": "2026-11-15"}]}, {"number": "07441933356", "category": "scam", "reports": [{"body": "Added me to a WhatsApp group promising daily trading profits. The group was full of fake success stories and links to deposit money.", "category": "scam", "asked_otp": false, "asked_bank_details": true, "used_threat": false, "date": "2026-11-17"}]}, {"number": "07860043075", "category": "scam", "reports": [{"body": "Text and call pretending to be a delivery company, saying a parcel could not be delivered and asking me to click a link and pay a redelivery fee.", "category": "scam", "asked_otp": false, "asked_bank_details": true, "used_threat": false, "date": "2026-11-20"}]}, {"number": "07846846431", "category": "spam", "reports": [{"body": "Caller talked about a political survey, then kept calling back several times in one day even after I asked them to stop.", "category": "spam", "asked_otp": false, "asked_bank_details": false, "used_threat": false, "date": "2026-11-17"}]}, {"number": "07537453904", "category": "other", "reports": [{"body": "This number has been reported by community members, but no confirmed scam pattern has been found for it yet. Treat it as unknown and check back if more reports appear.", "category": "other", "asked_otp": false, "asked_bank_details": false, "used_threat": false, "date": "2026-11-11"}]}, {"number": "02046131964", "category": "other", "reports": [{"body": "This number has been reported by community members, but no confirmed scam pattern has been found for it yet. Treat it as unknown and check back if more reports appear.", "category": "other", "asked_otp": false, "asked_bank_details": false, "used_threat": false, "date": "2026-11-10"}]}, {"number": "03330046113", "category": "other", "reports": [{"body": "This number has been reported by community members, but no confirmed scam pattern has been found for it yet. Treat it as unknown and check back if more reports appear.", "category": "other", "asked_otp": false, "asked_bank_details": false, "used_threat": false, "date": "2026-11-08"}]}, {"number": "07887825391", "category": "scam", "reports": [{"body": "Recorded HMRC message: a letter was returned undelivered and legal action was about to start. Press 1 for an officer. HMRC never threatens arrest by phone and never calls from a mobile.", "category": "scam", "asked_otp": false, "asked_bank_details": false, "used_threat": true, "date": "2026-11-19"}]}, {"number": "07410637126", "category": "scam", "reports": [{"body": "Caller said they were HMRC and I owed tax. They demanded immediate payment by gift card or bank transfer.", "category": "scam", "asked_otp": false, "asked_bank_details": true, "used_threat": true, "date": "2026-11-18"}]}, {"number": "07804327509", "category": "scam", "reports": [{"body": "HMRC scam call. A recorded voice said my National Insurance number would be suspended unless I pressed 1.", "category": "scam", "asked_otp": false, "asked_bank_details": false, "used_threat": true, "date": "2026-11-17"}]}, {"number": "07878035194", "category": "scam", "reports": [{"body": "Caller pretended to be HMRC and said a warrant had been issued for my arrest over unpaid tax.", "category": "scam", "asked_otp": false, "asked_bank_details": false, "used_threat": true, "date": "2026-11-18"}]}, {"number": "03300183589", "category": "robocall", "reports": [{"body": "Robocall claiming to be HMRC. A recorded message asked me to press 1 to speak to a tax officer about an unpaid bill.", "category": "robocall", "asked_otp": false, "asked_bank_details": false, "used_threat": false, "date": "2026-11-17"}]}];

function seedStore() {
  const numbers = new Map();
  for (const s of SEED) {
    numbers.set(s.number, {
      number: s.number,
      top_category: s.category,
      reports: s.reports.map((r) => ({ ...r, status: "approved" })),
      safeVotes: 0,
      unsafeVotes: 0,
      searches24h: 0,
      totalSearches: 0,
      createdAt: s.reports.length ? s.reports[0].date : "2026-11-21",
    });
  }
  return numbers;
}

let fallback = null;
function getFallback() {
  if (!fallback) fallback = seedStore();
  return fallback;
}

// Nomi's decision 21 Nov 2026: each APPROVED report counts as one Unsafe signal.
// Unsafe votes shown = approved reports + real Unsafe votes cast by users.
// No vote number is ever invented. Safe votes are real votes only.
function toRecord(row, reports, safeVotes, unsafeVotes, searches24h, totalSearches) {
  const score = computeScore(reports, safeVotes, unsafeVotes);
  return {
    number: row.number,
    top_category: row.top_category || (reports[0] ? reports[0].category : "other"),
    reports,
    safeVotes,
    unsafeVotes: (unsafeVotes || 0) + reports.length,
    unsafeFromReports: reports.length,
    seeded: !!row.seeded,
    searches24h,
    totalSearches,
    score,
    createdAt: row.created_at || null,
  };
}

export async function getNumberData(number) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    const rec = getFallback().get(number);
    if (!rec) return null;
    return toRecord(rec, rec.reports, rec.safeVotes, rec.unsafeVotes, rec.searches24h, rec.totalSearches);
  }
  const { data: row } = await admin.from("numbers").select("*").eq("number", number).single();
  if (!row) return null;
  const { data: reports } = await admin.from("reports").select("*").eq("number", number).eq("status", "approved").order("created_at", { ascending: false });
  const { data: votes } = await admin.from("votes").select("vote").eq("number", number);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: c24 } = await admin.from("searches").select("*", { count: "exact", head: true }).eq("number", number).gte("searched_at", since);
  const { count: total } = await admin.from("searches").select("*", { count: "exact", head: true }).eq("number", number);
  const safe = (votes || []).filter((v) => v.vote === "safe").length;
  const unsafe = (votes || []).filter((v) => v.vote === "unsafe").length;
  return toRecord(row, reports || [], safe, unsafe, c24 || 0, total || 0);
}

// Nomi's decision 21 Nov 2026: the 20 seeded numbers are indexable from launch day.
// Any other number is indexable only after 1 approved report OR 5+ searches.
export function isIndexable(rec) {
  if (!rec) return false;
  return rec.seeded === true || rec.reports.length >= 1 || rec.totalSearches >= 5;
}

export async function recordSearch(number) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    const store = getFallback();
    let rec = store.get(number);
    if (!rec) {
      rec = { number, top_category: "other", reports: [], safeVotes: 0, unsafeVotes: 0, searches24h: 0, totalSearches: 0, createdAt: new Date().toISOString().slice(0, 10) };
      store.set(number, rec);
    }
    rec.searches24h += 1;
    rec.totalSearches += 1;
    return rec.totalSearches;
  }
  await admin.from("numbers").upsert({ number, top_category: "other" }, { onConflict: "number", ignoreDuplicates: true });
  await admin.from("searches").insert({ number });
  const { count } = await admin.from("searches").select("*", { count: "exact", head: true }).eq("number", number);
  return count || 1;
}

export async function submitReport({ number, body, category, askedOtp, askedBank, usedThreat }) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    const store = getFallback();
    let rec = store.get(number);
    if (!rec) {
      rec = { number, top_category: category, reports: [], safeVotes: 0, unsafeVotes: 0, searches24h: 0, totalSearches: 0, createdAt: new Date().toISOString().slice(0, 10) };
      store.set(number, rec);
    }
    // Fallback: report is held for moderation (not shown) — same rule as live.
    return { status: "pending" };
  }
  await admin.from("numbers").upsert({ number, top_category: category }, { onConflict: "number", ignoreDuplicates: true });
  const { error } = await admin.from("reports").insert({
    number, body, category,
    asked_otp: !!askedOtp, asked_bank_details: !!askedBank, used_threat: !!usedThreat,
    status: "pending",
  });
  if (error) throw new Error(error.message);
  return { status: "pending" };
}

export async function castVote({ number, vote, voterKey }) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    const store = getFallback();
    let rec = store.get(number);
    if (!rec) {
      rec = { number, top_category: "other", reports: [], safeVotes: 0, unsafeVotes: 0, searches24h: 0, totalSearches: 0, createdAt: new Date().toISOString().slice(0, 10) };
      store.set(number, rec);
    }
    if (vote === "safe") rec.safeVotes += 1; else rec.unsafeVotes += 1;
    return { safe: rec.safeVotes, unsafe: rec.unsafeVotes + rec.reports.length, unsafeFromReports: rec.reports.length };
  }
  await admin.from("numbers").upsert({ number, top_category: "other" }, { onConflict: "number", ignoreDuplicates: true });
  if (voterKey) {
    const { data: existing } = await admin.from("votes").select("id,vote").eq("number", number).eq("voter_key", voterKey).single();
    if (existing) {
      if (existing.vote !== vote) await admin.from("votes").update({ vote }).eq("id", existing.id);
    } else {
      await admin.from("votes").insert({ number, vote, voter_key: voterKey });
    }
  } else {
    await admin.from("votes").insert({ number, vote });
  }
  const { data: votes } = await admin.from("votes").select("vote").eq("number", number);
  const { count: approvedReports } = await admin.from("reports").select("*", { count: "exact", head: true }).eq("number", number).eq("status", "approved");
  return {
    safe: (votes || []).filter((v) => v.vote === "safe").length,
    unsafe: (votes || []).filter((v) => v.vote === "unsafe").length + (approvedReports || 0),
    unsafeFromReports: approvedReports || 0,
  };
}

export async function getTopNumbers(limit = 20) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    const all = [...getFallback().values()].filter((r) => r.reports.length > 0);
    all.sort((a, b) => b.reports.length - a.reports.length || (computeScore(b.reports, 0, 0) || 0) - (computeScore(a.reports, 0, 0) || 0));
    return all.slice(0, limit).map((r) => toRecord(r, r.reports, r.safeVotes, r.unsafeVotes, r.searches24h, r.totalSearches));
  }
  const { data: numbers } = await admin.from("numbers").select("*");
  const out = [];
  for (const row of numbers || []) {
    const rec = await getNumberData(row.number);
    if (rec && rec.reports.length > 0) out.push(rec);
  }
  out.sort((a, b) => b.reports.length - a.reports.length || (b.score || 0) - (a.score || 0));
  return out.slice(0, limit);
}

export async function getLatestReports(limit = 10) {
  const admin = getSupabaseAdmin();
  if (!admin) {
    const all = [];
    for (const r of getFallback().values()) for (const rep of r.reports) all.push({ ...rep, number: r.number });
    all.sort((a, b) => String(b.date || b.created_at || "").localeCompare(String(a.date || a.created_at || "")));
    return all.slice(0, limit);
  }
  const { data } = await admin.from("reports").select("*").eq("status", "approved").order("created_at", { ascending: false }).limit(limit);
  return data || [];
}

export async function getIndexableNumbers() {
  const admin = getSupabaseAdmin();
  if (!admin) {
    const out = [];
    for (const r of getFallback().values()) {
      const rec = toRecord(r, r.reports, r.safeVotes, r.unsafeVotes, r.searches24h, r.totalSearches);
      if (isIndexable(rec)) out.push(rec);
    }
    return out;
  }
  const { data: numbers } = await admin.from("numbers").select("number");
  const out = [];
  for (const row of numbers || []) {
    const rec = await getNumberData(row.number);
    if (rec && isIndexable(rec)) out.push(rec);
  }
  return out;
}

export async function getToolStats() {
  const admin = getSupabaseAdmin();
  if (!admin) {
    const all = [...getFallback().values()];
    return {
      numbers: all.length,
      reports: all.reduce((n, r) => n + r.reports.length, 0),
      votes: all.reduce((n, r) => n + r.safeVotes + r.unsafeVotes, 0),
      searches: all.reduce((n, r) => n + r.totalSearches, 0),
    };
  }
  const [n, r, v, s] = await Promise.all([
    admin.from("numbers").select("*", { count: "exact", head: true }),
    admin.from("reports").select("*", { count: "exact", head: true }).eq("status", "approved"),
    admin.from("votes").select("*", { count: "exact", head: true }),
    admin.from("searches").select("*", { count: "exact", head: true }),
  ]);
  return { numbers: n.count || 0, reports: r.count || 0, votes: v.count || 0, searches: s.count || 0 };
}

export async function getPendingReports() {
  const admin = getSupabaseAdmin();
  if (!admin) return [];
  const { data } = await admin.from("reports").select("*").eq("status", "pending").order("created_at", { ascending: false });
  return data || [];
}
