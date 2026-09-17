import { getStageName, getLocationName, getClassName } from '../core/luts.js';
import { getStats } from '../core/calc.js';
import { listStatDefs, applyStatColor } from '../core/statDefs.js';
import { getCurrentEntries } from '../state/scorecardState.js';
import { getElem } from '../lib/dom.js';

var sortState = { column: "percentile", isAscending: true };

function getBoardUrl(e) {
  var url = "https://fourleft.io/easportswrc/time-trials/boards?board=" +
    e.locationId + "-" + e.routeId + "-" + e.surfaceCondition + "-" + e.vehicleClassId;
  var page = Math.floor((e.rank - 1) / 50);
  if (page > 0) url += "&page=" + page;
  return url;
}

function getRowLink(url, cssClass) {
  var a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  if (cssClass) a.className = cssClass;
  return a;
}

function setSort(colName, isAscending) {
  sortState.column = colName;
  sortState.isAscending = isAscending;
  renderListView()
}

function toggleSort(col) {
  setSort(col, sortState.column === col ? !sortState.isAscending : true);
}

function rebuildHeader() {
  var thead = document.querySelector(".entries-table thead");
  thead.innerHTML = "";
  var tr = document.createElement("tr");
  var cols = [
    { label: "Stage", col: null },
    { label: "Pos", col: "placement" },
    { label: "Rank", col: "percentile" },
    { label: "\u0394WR", col: "delta" },
  ];
  cols.forEach(function (c) {
    var th = getElem("th", null, c.label);
    if (c.col) {
      var active = c.col === sortState.column;
      th.prepend(getElem("span", "sort-indicator" + (active ? "" : " sort-indicator--hidden"), active && !sortState.isAscending ? "\u25BE" : "\u25B4"));
      th.classList.add("clickable");
      th.addEventListener("click", toggleSort.bind(null, c.col));
    }
    tr.appendChild(th);
  });
  thead.appendChild(tr);
}

function renderListView() {
  rebuildHeader();

  var tbody = document.querySelector(".entries-table tbody");
  tbody.innerHTML = "";

  var withStats = getCurrentEntries().map(e => ({ entry: e, stats: getStats([e]) }));
  withStats.sort((a, b) => {
    var cmp = (a.stats[sortState.column]) - (b.stats[sortState.column]);
    return sortState.isAscending ? cmp : -cmp;
  });

  withStats.forEach(function(es) {
    var e = es.entry;
    var s = es.stats;
    var tr = document.createElement("tr");
    var boardUrl = getBoardUrl(e);

    var stageName = getStageName(e.routeId) || e.routeId;
    var locationName = getLocationName(e.locationId) || "";
    var className = getClassName(e.vehicleClassId) || "";
    var weather = e.surfaceCondition == 1 ? "Wet" : "Dry";
    var stageHtml =
      "<span class=\"stage-main\">" + stageName + "</span> " +
      "<span class=\"muted\">" + locationName + " \u00B7 " + weather + " \u00B7 " + className + "</span>";
    var stageTd = getElem("td");
    var stageLink = getRowLink(boardUrl, "stage-link");
    stageLink.innerHTML = stageHtml;
    stageTd.appendChild(stageLink);
    tr.appendChild(stageTd);

    var posTd = getElem("td", null, e.rank);
    applyStatColor(posTd, "placement", e.rank);
    tr.appendChild(posTd);

    var rankTd = getElem("td", null, s.percentile != null ? listStatDefs.percentile(s) : "");
    applyStatColor(rankTd, "percentile", s.percentile);
    tr.appendChild(rankTd);

    var deltaTd = getElem("td", null, listStatDefs.delta(s));
    applyStatColor(deltaTd, "delta", s.delta);
    tr.appendChild(deltaTd);

    tbody.appendChild(tr);
  });
}

export { setSort, renderListView };
