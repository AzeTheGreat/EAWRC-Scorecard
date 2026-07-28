import { formatTime } from '../lib/util.js';

export const profileStatDefs = {
  sp: s => Math.round(s.sp),
  tp: s => Math.round(s.tp),
};

export const scorecardStatDefs = {
  percentile: s => Math.round(s.percentile),
  delta:      s => formatTime(s.delta),
  placement:  s => s.placement?.toFixed(1),
  medal1:     s => s.medal1,
  medal2:     s => s.medal2,
  medal3:     s => s.medal3,
  medal10:    s => s.medal10,
};
