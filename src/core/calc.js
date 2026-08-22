import { avg, parseTime } from '../lib/util.js';
import { getClassIds, getStageIds, getLocationIds } from './luts.js';

function countPossibleCombos(filters = {}) {
  const locationIds = filters.location != null ? [filters.location] : getLocationIds(filters.surface);
  const stageIds = filters.stage != null ? [filters.stage] : locationIds.flatMap(getStageIds);
  const classIds = filters.class != null ? [filters.class] : getClassIds(filters.drivetrain);

  // * 2 for wet/dry
  return stageIds.length * classIds.length * 2;
}

function computePoints(entries) {
  const scores = entries.map(e => 1 / (e.rank / e.totalEntries));
  scores.sort((a, b) => b - a);

  return { 
    totalPoints: scores.reduce((s, v) => s + v, 0),
    skillPoints: scores.slice(0, 100).reduce((sum, score, i) => sum + score * Math.pow(0.95, i), 0)
  };
}

function getStats(entries) {
  var s = {
    sp: null, tp: null,
    percentile: null, placement: null, delta: null,
    medal1: 0, medal2: 0, medal3: 0, medal10: 0,
  };

  if (entries && entries.length) {
    var pts = computePoints(entries);
    s.sp = pts.skillPoints;
    s.tp = pts.totalPoints;

    s.percentile = avg(entries.map(e => (e.rank / e.totalEntries) * 100));
    s.placement  = avg(entries.map(e => e.rank));
    s.delta      = avg(entries.map(e => parseTime(e.differenceToFirst)));

    s.medal1  = entries.filter(e => e.rank === 1).length;
    s.medal2  = entries.filter(e => e.rank === 2).length;
    s.medal3  = entries.filter(e => e.rank === 3).length;
    s.medal10 = entries.filter(e => e.rank >= 4 && e.rank <= 10).length;
  }

  return s;
}

function getCompletion(entryCount, filters = {}) {
  const totalPossible = countPossibleCombos(filters);
  return totalPossible ? entryCount / totalPossible : null;
}

export { getStats, getCompletion };
