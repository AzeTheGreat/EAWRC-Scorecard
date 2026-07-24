"use strict";

function setPill(stat, value) {
  document.querySelector('[data-stat="' + stat + '"] .pill-value').textContent = value;
}

function selectStat(el, fn) {
  cellValueFn = makeCellValueFn(fn);
  document.querySelectorAll("[data-stat].active").forEach(e => e.classList.remove("active"));
  el.classList.add("active");
  var stat = el.getAttribute("data-stat");
  if (window.setSort) setSort(stat, true);
  buildTable();
}

function registerStat(stat, fn) {
  var el = document.querySelector('[data-stat="' + stat + '"]');
  if (el) el.addEventListener("click", function() { selectStat(el, fn); });
}

registerStat("percentile",     g => Math.round(g.avgPercentile));
registerStat("delta",          g => g.avgDelta != null ? formatTime(g.avgDelta) : "\u2014");
registerStat("placement",      g => g.avgPlacement != null ? g.avgPlacement.toFixed(1) : "\u2014");
registerStat("medal-WR",       g => g.medalCounts["WR"] || 0);
registerStat("medal-#2",       g => g.medalCounts["#2"] || 0);
registerStat("medal-#3",       g => g.medalCounts["#3"] || 0);
registerStat("medal-Top 10",   g => g.medalCounts["Top 10"] || 0);

document.querySelector('[data-stat="percentile"]').classList.add("active");

function updateStatPills() {
  var entries = window.apiData?.entries;
  var filters = {};
  for (var k in state) {
    if (state[k] != null) filters[k] = state[k];
  }
  var allEntries = window.apiData?.entries || [];
  var matching = entries ? getFilteredEntries(filters) : [];

  var group = matching.length ? getGroupStats(matching) : null;
  var points = allEntries.length ? computePoints(allEntries) : null;

  setPill("sp", points ? Math.round(points.skillPoints) : "");
  setPill("tp", points ? Math.round(points.totalPoints) : "");
  setPill("percentile", group ? Math.round(group.avgPercentile) : "");
  setPill("delta", group && group.avgDelta != null ? formatTime(group.avgDelta) : "\u2014");
  setPill("placement", group && group.avgPlacement != null ? group.avgPlacement.toFixed(1) : "\u2014");

  document.querySelectorAll('[data-stat="medals"] .medal-icon').forEach(el => {
    var name = el.getAttribute("data-stat").slice(6);
    el.querySelector(".medal-count").textContent = group ? (group.medalCounts[name] || 0) : "0";
  });
}
