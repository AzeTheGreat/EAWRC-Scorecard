"use strict";

function getTotals(xEntry, yEntry) {
  const entries = window.apiData?.entries;
  if (!entries) return "";

  const filters = {};
  if (xEntry) filters[xEntry.lvl.levelID] = xEntry.id;
  if (yEntry) filters[yEntry.lvl.levelID] = yEntry.id;

  const matching = entries.filter(
    e =>
      (!filters.class || e.vehicleClassId === filters.class) &&
      (!filters.drivetrain || (window.ClassIdsByDrivetrain[filters.drivetrain] || []).includes(e.vehicleClassId)) &&
      (!filters.location || e.locationId === filters.location) &&
      (!filters.surface || (window.LocIdsBySurface[filters.surface] || []).includes(e.locationId)) &&
      (!filters.stage || e.routeId === filters.stage)
  );
  if (!matching.length) return "";
  const sum = matching.reduce((s, e) => s + (e.rank / e.totalEntries) * 100, 0);
  return Math.round(sum / matching.length);
}
