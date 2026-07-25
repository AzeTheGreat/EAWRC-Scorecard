import { StageNameByStageId, LocNameByLocID, ClassNameByClassId } from './luts.js';
import { getFilteredEntries, getStat, formatTime } from './calc.js';
import { state } from './table.js';
import { getElem } from './dom.js';

var entriesSort = { column: "percentile", isAscending: true };

function setSort(colName, isAscending) {
  entriesSort.column = colName;
  entriesSort.isAscending = isAscending;
}

function toggleSort(col) {
  setSort(col, entriesSort.column === col ? !entriesSort.isAscending : true);
  renderEntriesView();
}

function rebuildHeader() {
  var thead = document.querySelector("#entries-table thead");
  thead.innerHTML = "";
  var tr = document.createElement("tr");
  var cols = [
    { label: "Stage", col: null },
    { label: "Placement", col: "placement" },
    { label: "Percentile", col: "percentile" },
    { label: "Delta", col: "delta" },
  ];
  cols.forEach(function (c) {
    var label = c.label;
    if (c.col === entriesSort.column) label += " " + (entriesSort.isAscending ? "\u25B4" : "\u25BE");
    var th = getElem("th", "entriesHead", label);
    if (c.col) th.addEventListener("click", toggleSort.bind(null, c.col));
    tr.appendChild(th);
  });
  thead.appendChild(tr);
}

function renderEntriesView() {
  rebuildHeader();

  var tbody = document.querySelector("#entries-table tbody");
  tbody.innerHTML = "";

  var raw = getFilteredEntries(state);
  var withStats = raw.map(function(e) { return { entry: e, stats: getStat([e]) }; });
  withStats.sort(function(a, b) {
    var cmp = compareEntries(a.stats, b.stats, entriesSort.column);
    return entriesSort.isAscending ? cmp : -cmp;
  });

  withStats.forEach(function(es) {
    var e = es.entry;
    var s = es.stats;
    var tr = document.createElement("tr");

    var stageName = StageNameByStageId[e.routeId] || e.routeId;
    var locationName = LocNameByLocID[e.locationId] || "";
    var className = ClassNameByClassId[e.vehicleClassId] || "";
    var weather = e.surfaceCondition == 1 ? "Wet" : "Dry";
    var stageTd = getElem("td");
    stageTd.innerHTML =
      "<span class=\"stage-main\">" + stageName + "</span><br>" +
      "<span class=\"muted\">" + locationName + " \u2014 " + weather + " \u2014 " + className + "</span>";
    tr.appendChild(stageTd);

    tr.appendChild(getElem("td", null, e.rank));
    tr.appendChild(getElem("td", null, s.percentile != null ? Math.round(s.percentile) + "" : ""));
    tr.appendChild(getElem("td", null, formatTime(s.delta)));

    tbody.appendChild(tr);
  });
}

function compareEntries(a, b, column) {
  switch (column) {
    case "placement":
      return a.placement - b.placement;
    case "percentile":
      return a.percentile - b.percentile;
    case "delta":
      return (a.delta || 0) - (b.delta || 0);
  }
  return 0;
}

export { setSort, renderEntriesView };
