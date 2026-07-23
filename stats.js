"use strict";

function setPill(stat, value) {
  document.querySelector('[data-stat="' + stat + '"] .pill-value').textContent = value;
}

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
  setPill("delta", group && group.avgDelta != null ? formatTime(group.avgDelta) : "—");
  setPill("placement", group && group.avgPlacement != null ? group.avgPlacement.toFixed(1) : "—");

  document.querySelectorAll('[data-stat="medals"] .medal-icon').forEach(function(el) {
    var name = el.getAttribute("data-medal");
    el.querySelector(".medal-count").textContent = group ? (group.medalCounts[name] || 0) : "0";
  });
}
