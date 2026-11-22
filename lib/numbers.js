
// UK number normalisation, origin/type and spam-score helpers.
// Display rule: a count of 0 is NEVER shown as a number. Where a count is 0,
// show an honest label instead ("Newly added" / "No votes yet — be the first
// to vote"). A counter appears only after the first real search or vote.
// No estimated counts are ever invented.

export function normalizeUkNumber(input) {
  if (!input) return null;
  let s = String(input).trim().replace(/\(0\)/g, "").replace(/[\s\-().]/g, "");
  if (/[a-zA-Z]/.test(s)) return null;
  if (s.startsWith("+44")) s = "0" + s.slice(3);
  else if (s.startsWith("0044")) s = "0" + s.slice(4);
  else if (s.startsWith("44") && s.length >= 12) s = "0" + s.slice(2);
  if (!/^\d+$/.test(s)) return null;
  if (s.length < 10 || s.length > 11) return null;
  // Missing trunk 0, e.g. 2079460958 -> 02079460958
  if (s.length === 10 && (s.startsWith("2") || s.startsWith("7"))) s = "0" + s;
  if (!s.startsWith("0")) return null;
  return s;
}

export function formatNumber(n) {
  if (!n) return "";
  if (n.startsWith("020")) {
    return n.slice(0, 3) + " " + n.slice(3, 7) + " " + n.slice(7);
  }
  if (n.startsWith("01") || n.startsWith("02")) {
    return n.slice(0, 4) + " " + n.slice(4, 7) + " " + n.slice(7);
  }
  if (n.startsWith("07")) return n.slice(0, 5) + " " + n.slice(5);
  if (n.startsWith("0800")) return n.slice(0, 4) + " " + n.slice(4, 7) + " " + n.slice(7);
  if (n.startsWith("03") || n.startsWith("08")) return n.slice(0, 4) + " " + n.slice(4, 7) + " " + n.slice(7);
  return n;
}

export function numberOrigin(n) {
  if (n.startsWith("020")) return "020 — London allocation";
  if (n.startsWith("0161")) return "0161 — Manchester allocation";
  if (n.startsWith("0121")) return "0121 — Birmingham allocation";
  if (n.startsWith("0131")) return "0131 — Edinburgh allocation";
  if (n.startsWith("0113")) return "0113 — Leeds allocation";
  if (n.startsWith("01") || n.startsWith("02")) return n.slice(0, 5) + " — UK geographic allocation";
  if (n.startsWith("07")) return "UK mobile range";
  if (n.startsWith("0800")) return "UK freephone range";
  if (n.startsWith("03")) return "UK-wide (03 range)";
  if (n.startsWith("084") || n.startsWith("087")) return "UK non-geographic range";
  if (n.startsWith("070")) return "070 personal number range";
  return "UK number";
}

export function numberType(n) {
  if (n.startsWith("07")) return "Mobile";
  if (n.startsWith("0800")) return "Freephone";
  if (n.startsWith("03")) return "UK-wide number";
  if (n.startsWith("01") || n.startsWith("02")) return "Landline";
  if (n.startsWith("070")) return "Personal number";
  return "UK number";
}

export function areaCodeSlug(n) {
  if (n.startsWith("020")) return "020";
  if (n.startsWith("07")) return "07-mobile-numbers";
  return null;
}

const CAT_BONUS = { scam: 6, robocall: 4, telemarketing: 3, spam: 3, other: 0 };

export function computeScore(reports, safeVotes, unsafeVotes) {
  if (!reports || reports.length === 0) return null;
  let score = 8 + 11 * reports.length + 3 * (unsafeVotes || 0) - 2 * (safeVotes || 0);
  for (const r of reports) score += CAT_BONUS[r.category] || 0;
  return Math.max(10, Math.min(97, score));
}

export function scoreBand(score) {
  if (score === null || score === undefined) return { label: "Unknown", text: "Unknown — No reports yet" };
  if (score < 25) return { label: "Low", text: "Low risk — few negative signals" };
  if (score < 50) return { label: "Medium", text: "Medium risk — some negative reports" };
  if (score < 75) return { label: "High", text: "High risk — many negative reports" };
  return { label: "Dangerous", text: "Dangerous — strong scam pattern" };
}

// Display helpers — return null when the count is 0 (caller shows a label instead).
export function searchCountLabel(count24h) {
  if (!count24h || count24h <= 0) return null;
  return count24h + (count24h === 1 ? " search" : " searches") + " in the last 24 hours";
}
export function voteCountLabel(safe, unsafe) {
  const total = (safe || 0) + (unsafe || 0);
  if (total <= 0) return null;
  const safePart = (safe || 0) > 0 ? ", " + safe + " safe" : ", no safe votes yet";
  return total + (total === 1 ? " vote" : " votes") + " (" + unsafe + " unsafe" + safePart + ")";
}
export const NEWLY_ADDED_LABEL = "Newly added";
export const NO_VOTES_YET_LABEL = "No votes yet — be the first to vote";
export const NO_SEARCHES_YET_LABEL = "No searches recorded yet";
