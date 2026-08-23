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
