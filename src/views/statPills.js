import { getStats } from '../core/calc.js';
import { setSelectedStat, getCurrentStats } from '../state/scorecardState.js';
import { profileStatDefs, pillStatDefs, applyStatColor } from '../core/statDefs.js';
import { setSort } from './listView.js';
import { getApiData } from '../state/apiData.js';

registerStatPillClicks();
document.querySelector('[data-stat="percentile"]').classList.add("active");

function updateStatPills() {
  // Profile
  var allStats = getStats(getApiData()?.entries);
  Object.entries(profileStatDefs).forEach(function([stat, fn]) {
    var pill = document.querySelector('[data-stat="' + stat + '"] .pill-value');
    if (pill) pill.textContent = fn(allStats);
  });

  // Aggregates
  var stats = getCurrentStats();
  Object.entries(pillStatDefs).forEach(function([stat, fn]) {
    var pill = document.querySelector('[data-stat="' + stat + '"] .pill-value');
    if (pill) {
      pill.textContent = fn(stats);
      applyStatColor(pill, stat, stats[stat]);
    }
    var medal = document.querySelector('[data-stat="medals"] [data-stat="' + stat + '"] .medal-count');
    if (medal) medal.textContent = fn(stats);
  });

  // Totals bar completion fill
  var totalsBar = document.querySelector(".totals-bar");
  if (totalsBar) {
    totalsBar.classList.add("has-completion");
    totalsBar.style.setProperty("--completion", Math.min(stats.completion ?? 0, 1));
  }
}

function registerStatPillClicks() {
  Object.keys(pillStatDefs).forEach(function(stat) {
    var el = document.querySelector('[data-stat="' + stat + '"]');
    if (el) {
      el.classList.add("clickable");
      el.addEventListener("click", () => selectStat(el, stat));
    }
  });
}

function selectStat(el, stat) {
  setSelectedStat(stat);
  document.querySelectorAll("[data-stat].active").forEach(function(e) { e.classList.remove("active"); });
  el.classList.add("active");
  setSort(stat, true);
}

export { updateStatPills };
