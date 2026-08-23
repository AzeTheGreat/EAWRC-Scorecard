import { sigFig, formatDelta, formatClock } from '../lib/util.js';

export const profileStatDefs = {
  sp: s => Math.round(s.sp),
  tp: s => Math.round(s.tp),
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
  medal2:     s => s.medal2 || "",
  medal3:     s => s.medal3 || "",
  medal10:    s => s.medal10 || "",
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

// Medal tier for a (possibly averaged) placement
export function placementMedal(value) {
  if (value == null || isNaN(value)) return null;
  const rank = Math.round(value);
  if (rank === 1) return "platinum";
  if (rank === 2) return "gold";
  if (rank === 3) return "silver";
  if (rank >= 4 && rank <= 10) return "bronze";
  return null;
}

// Clears any previous coloring, then applies gradient or medal class as appropriate
export function applyStatColor(el, stat, value) {
  el.classList.remove("stat-colored", "stat-medal", "platinum", "gold", "silver", "bronze");

  if (stat === "placement") {
    const medal = placementMedal(value);
    if (medal) el.classList.add("stat-medal", medal);
    return;
  }

  const t = statColorT(stat, value);
  if (t != null) {
    el.classList.add("stat-colored");
    el.style.setProperty("--stat-t", t);
  }
}
