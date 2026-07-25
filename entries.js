import { StageNameByStageId, LocNameByLocID, ClassNameByClassId } from './luts.js';
import { getFilteredEntries, getStat } from './calc.js';
import { formatTime } from './util.js';
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

  var withStats = getFilteredEntries(state).map(e => ({ entry: e, stats: getStat([e]) }));
  withStats.sort((a, b) => {
    var cmp = (a.stats[entriesSort.column]) - (b.stats[entriesSort.column]);
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

export { setSort, renderEntriesView };
