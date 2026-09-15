import { getStats } from '../core/calc.js';
import { setSelectedStat, getCurrentStats } from '../state/scorecardState.js';
import { profileStatDefs, pillStatDefs, applyStatColor } from '../core/statDefs.js';
import { setSort } from './listView.js';
import { getApiData } from '../state/apiData.js';

registerStatPillClicks();
registerStatTips();
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
  if (stat.indexOf("medal") === 0) {
    var medalsPill = document.querySelector('[data-stat="medals"]');
    if (medalsPill) medalsPill.classList.add("active");
    setSort("placement", true);
  } else {
    setSort(stat, true);
  }
}

function registerStatTips() {
  var tip = document.createElement("div");
  tip.className = "stat-tip";
  tip.setAttribute("role", "tooltip");
  document.body.appendChild(tip);

  function positionTip(anchor) {
    var r = anchor.getBoundingClientRect();
    tip.style.visibility = "hidden";
    tip.classList.add("visible");
    var tw = tip.offsetWidth;
    var th = tip.offsetHeight;
    tip.classList.remove("visible");
    tip.style.visibility = "";
    var x = Math.min(Math.max(r.left + r.width / 2 - tw / 2, 8), window.innerWidth - tw - 8);
    var y = r.top - th - 8;
    if (y < 8) y = r.bottom + 8;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  }

  function showTip(anchor) {
    var text = anchor.getAttribute("data-tip");
    if (!text) return;
    tip.textContent = text;
    positionTip(anchor);
    tip.classList.add("visible");
  }

  function hideTip() {
    clearTimeout(showTimer);
    tip.classList.remove("visible");
  }

  var showTimer = null;
  var SHOW_DELAY = 400;

  document.querySelectorAll("[data-tip]").forEach(function(el) {
    el.addEventListener("mouseenter", () => {
      clearTimeout(showTimer);
      showTimer = setTimeout(() => showTip(el), SHOW_DELAY);
    });
    el.addEventListener("mouseleave", hideTip);
    el.addEventListener("focus", () => showTip(el));
    el.addEventListener("blur", hideTip);
  });
  window.addEventListener("scroll", hideTip, true);
}

export { updateStatPills };
