import { getFilteredEntries, getStat } from './calc.js';
import { formatTime } from './util.js';
import { state, buildTable, setCellValueFn } from './table.js';
import { setSort } from './entries.js';

var profileStatDefs = {
  sp: s => Math.round(s.sp),
  tp: s => Math.round(s.tp),
};

var scorecardStatDefs = {
  percentile: s => Math.round(s.percentile),
  delta:      s => formatTime(s.delta),
  placement:  s => s.placement?.toFixed(1),
  medal1:     s => s.medal1,
  medal2:     s => s.medal2,
  medal3:     s => s.medal3,
  medal10:    s => s.medal10,
};

registerStatPillClicks();
document.querySelector('[data-stat="percentile"]').classList.add("active");

function updateStatPills() {
  // Profile
  var allStats = getStat(window.apiData?.entries);
  Object.entries(profileStatDefs).forEach(function([stat, fn]) {
    var pill = document.querySelector('[data-stat="' + stat + '"] .pill-value');
    if (pill) pill.textContent = fn(allStats);
  });

  // Aggregates
  var stats = getStat(getFilteredEntries(state));
  Object.entries(scorecardStatDefs).forEach(function([stat, fn]) {
    var pill = document.querySelector('[data-stat="' + stat + '"] .pill-value');
    if (pill) pill.textContent = fn(stats);
    var medal = document.querySelector('[data-stat="medals"] [data-stat="' + stat + '"] .medal-count');
    if (medal) medal.textContent = fn(stats);
  });
}

function registerStatPillClicks() {
  Object.entries(scorecardStatDefs).forEach(function([stat, fn]) {
    var el = document.querySelector('[data-stat="' + stat + '"]');
    if (el) el.addEventListener("click", () => selectStat(el, fn));
  });
}

function selectStat(el, getDisplayStr) {
  setCellValueFn(getDisplayStr);
  document.querySelectorAll("[data-stat].active").forEach(function(e) { e.classList.remove("active"); });
  el.classList.add("active");
  var stat = el.getAttribute("data-stat");
  setSort(stat, true);
  buildTable();
}

export { updateStatPills };
