import { sigFig, formatDelta, formatClock } from '../lib/util.js';

export const profileStatDefs = {
  sp: s => Math.round(s.sp).toLocaleString("en-US"),
  tp: s => Math.round(s.tp).toLocaleString("en-US"),
};

export const pillStatDefs = {
  percentile: s => s.percentile == null ? "\u2014" : s.percentile.toFixed(3) + "%",
  delta:      s => formatDelta(s.delta, true, 3),
  placement:  s => s.placement == null ? "\u2014" : "#" + s.placement.toFixed(1),
  medal1:     s => s.medal1,
  medal2:     s => s.medal2,
  medal3:     s => s.medal3,
  medal10:    s => s.medal10,
};

export const matrixStatDefs = {
  percentile: s => sigFig(s.percentile),
  delta:      s => formatClock(s.delta, false, 1),
  placement:  s => s.placement == null ? "\u2014" : String(Math.round(s.placement)),
  medal1:     s => s.medal1 || "",
  medal2:     s => (s.medal1 + s.medal2) || "",
  medal3:     s => (s.medal1 + s.medal2 + s.medal3) || "",
  medal10:    s => (s.medal1 + s.medal2 + s.medal3 + s.medal10) || "",
};

export const listStatDefs = {
  percentile: s => s.percentile == null ? "\u2014" : s.percentile.toFixed(3),
  delta:      s => formatClock(s.delta, false, 3),
  placement:  s => s.placement == null ? "\u2014" : "#" + s.placement.toFixed(1),
};

// Color scaling — worst (text color) to best (max green)
export const statColorRanges = {
  percentile: { worst: 50, best: 0.01},
  delta:      { worst: 120, best: 0.1 },
};

// Returns normalized 0 (worst) .. 1 (best), or null if not colorable
export function statColorT(stat, value) {
  const range = statColorRanges[stat];
  if (!range || value == null || isNaN(value)) return null;
  const v = range.transform ? range.transform(value) : value;
  const t = (range.worst - v) / (range.worst - range.best);
  if (!isFinite(t)) return null;
  return Math.min(Math.max(t, 0), 1);
}

const MEDAL_STATS = ["medal1", "medal2", "medal3", "medal10"];

export function worstMedalForStat(stats, stat) {
  if (!stats) return null;
  return MEDAL_STATS.slice(0, MEDAL_STATS.indexOf(stat) + 1).findLast(m => stats[m] > 0) ?? null;
}

export function placementMedal(value) {
  if (value == null || isNaN(value)) return null;
  const rank = Math.round(value);
  if (rank === 1) return "medal1";
  if (rank === 2) return "medal2";
  if (rank === 3) return "medal3";
  if (rank >= 4 && rank <= 10) return "medal10";
  return null;
}

// Clears any previous coloring, then applies gradient or medal class as appropriate
export function applyStatColor(el, stat, value, fullStats) {
  el.classList.remove("stat-colored", "stat-medal", ...MEDAL_STATS);

  if (stat === "placement" || stat.startsWith("medal")) {
    const medal = stat === "placement"
      ? placementMedal(value)
      : worstMedalForStat(fullStats, stat);
    if (medal) el.classList.add("stat-medal", medal);
    return;
  }

  const t = statColorT(stat, value);
  if (t != null) {
    el.classList.add("stat-colored");
    el.style.setProperty("--stat-t", t);
  }
}
