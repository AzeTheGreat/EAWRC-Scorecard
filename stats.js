import { getFilteredEntries, getStat } from './calc.js';
import { formatTime } from './util.js';
import { state, buildTable, setCellValueFn } from './table.js';
import { setSort } from './entries.js';

function setPill(stat, value) {
  document.querySelector('[data-stat="' + stat + '"] .pill-value').textContent = value;
}

function selectStat(el, getDisplayStr) {
  setCellValueFn(getDisplayStr);
  document.querySelectorAll("[data-stat].active").forEach(function(e) { e.classList.remove("active"); });
  el.classList.add("active");
  var stat = el.getAttribute("data-stat");
  setSort(stat, true);
  buildTable();
}

function registerStat(stat, getDisplayStr) {
  var el = document.querySelector('[data-stat="' + stat + '"]');
  if (el) el.addEventListener("click", () => selectStat(el, getDisplayStr));
}

registerStat("percentile", s => Math.round(s.percentile) + "");
registerStat("delta", s => formatTime(s.delta));
registerStat("placement", s => s.placement != null ? s.placement.toFixed(1) : "\u2014");
registerStat("medal1", s => (s.medal1 || 0) + "");
registerStat("medal2", s => (s.medal2 || 0) + "");
registerStat("medal3", s => (s.medal3 || 0) + "");
registerStat("medal10", s => (s.medal10 || 0) + "");

document.querySelector('[data-stat="percentile"]').classList.add("active");

function updateStatPills() {
  var entries = window.apiData?.entries;
  var allEntries = window.apiData?.entries || [];
  var matching = entries ? getFilteredEntries(state) : [];

  var allStats   = getStat(allEntries);
  var matchStats = getStat(matching);

  setPill("sp",         allStats.sp != null ? Math.round(allStats.sp) + "" : "");
  setPill("tp",         allStats.tp != null ? Math.round(allStats.tp) + "" : "");
  setPill("percentile", matchStats.percentile != null ? Math.round(matchStats.percentile) + "" : "");
  setPill("delta",      formatTime(matchStats.delta));
  setPill("placement",  matchStats.placement != null ? matchStats.placement.toFixed(1) : "\u2014");

  document.querySelectorAll('[data-stat="medals"] .medal-icon').forEach(function(el) {
    var statKey = el.getAttribute("data-stat");
    el.querySelector(".medal-count").textContent = matchStats[statKey] || 0;
  });
}

export { updateStatPills };
