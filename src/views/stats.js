import { getFilteredEntries, getStat } from '../core/calc.js';
import { getState, setSelectedStat } from '../state/scorecardState.js';
import { profileStatDefs, scorecardStatDefs } from '../core/statDefs.js';
import { setSort } from './entries.js';
import { getApiData } from '../state/apiData.js';

registerStatPillClicks();
document.querySelector('[data-stat="percentile"]').classList.add("active");

function updateStatPills() {
  // Profile
  var allStats = getStat(getApiData()?.entries);
  Object.entries(profileStatDefs).forEach(function([stat, fn]) {
    var pill = document.querySelector('[data-stat="' + stat + '"] .pill-value');
    if (pill) pill.textContent = fn(allStats);
  });

  // Aggregates
  var stats = getStat(getFilteredEntries(getState()));
  Object.entries(scorecardStatDefs).forEach(function([stat, fn]) {
    var pill = document.querySelector('[data-stat="' + stat + '"] .pill-value');
    if (pill) pill.textContent = fn(stats);
    var medal = document.querySelector('[data-stat="medals"] [data-stat="' + stat + '"] .medal-count');
    if (medal) medal.textContent = fn(stats);
  });
}

function registerStatPillClicks() {
  Object.keys(scorecardStatDefs).forEach(function(stat) {
    var el = document.querySelector('[data-stat="' + stat + '"]');
    if (el) el.addEventListener("click", () => selectStat(el, stat));
  });
}

function selectStat(el, stat) {
  setSelectedStat(stat);
  document.querySelectorAll("[data-stat].active").forEach(function(e) { e.classList.remove("active"); });
  el.classList.add("active");
  setSort(stat, true);
}

export { updateStatPills };
