import { ClassIdsByDrivetrain, LocIdsBySurface } from './luts.js';

function avg(arr) {
  return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
}

function parseTime(timeStr) {
  if (!timeStr) return null;
  var parts = timeStr.split(":");
  if (parts.length === 3) return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
  if (parts.length === 2) return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  return parseFloat(parts[0]);
}

function formatTime(secs) {
  if (secs == null || isNaN(secs)) return "\u2014";
  var min = Math.floor(secs / 60);
  var s = secs % 60;
  return min + ":" + s.toFixed(1).padStart(4, "0");
}

function getMedal(rank) {
  if (rank === 1) return { name: "WR", cssClass: "platinum" };
  if (rank === 2) return { name: "#2", cssClass: "gold" };
  if (rank === 3) return { name: "#3", cssClass: "silver" };
  if (rank >= 4 && rank <= 10) return { name: "Top 10", cssClass: "bronze" };
  return null;
}

function getFilteredEntries(filters) {
  var entries = window.apiData?.entries;
  if (!entries) return [];

  return entries.filter(function(e) {
    return (
      (!filters.class || e.vehicleClassId === filters.class) &&
      (!filters.drivetrain || (ClassIdsByDrivetrain[filters.drivetrain] || []).includes(e.vehicleClassId)) &&
      (!filters.location || e.locationId === filters.location) &&
      (!filters.surface || (LocIdsBySurface[filters.surface] || []).includes(e.locationId)) &&
      (!filters.stage || e.routeId === filters.stage)
    );
  });
}


function getGroupStats(entries) {
  if (!entries || !entries.length) return null;

  var ranks = entries.map(function(e) { return e.rank; });
  var deltas = entries.map(function(e) { return parseTime(e.differenceToFirst); });
  var medalCounts = {};

  entries.forEach(function(e) {
    var medal = getMedal(e.rank);
    if (medal) medalCounts[medal.name] = (medalCounts[medal.name] || 0) + 1;
  });

  return {
    avgPercentile: avg(entries.map(function(e) { return (e.rank / e.totalEntries) * 100; })),
    avgPlacement: avg(ranks),
    avgDelta: avg(deltas),
    medalCounts: medalCounts,
  };
}

function computePoints(entries) {
  var scores = [];
  entries.forEach(function(e) {
    var pct = e.rank / e.totalEntries;
    if (pct > 0) scores.push(1 / pct);
  });

  var totalPoints = scores.reduce(function(s, v) { return s + v; }, 0);

  scores.sort(function(a, b) { return b - a; });
  var top100 = scores.slice(0, 100);
  var skillPoints = 0;
  top100.forEach(function(score, i) {
    skillPoints += score * Math.pow(0.95, i);
  });

  return { totalPoints: totalPoints, skillPoints: skillPoints };
}

export { parseTime, formatTime, getFilteredEntries, getGroupStats, computePoints };
