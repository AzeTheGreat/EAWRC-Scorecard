import { getStageName, getLocationName, getClassName } from '../core/luts.js';
import { getStats } from '../core/calc.js';
import { scorecardStatDefs } from '../core/statDefs.js';
import { getCurrentEntries } from '../state/scorecardState.js';
import { getElem } from '../lib/dom.js';

var sortState = { column: "percentile", isAscending: true };

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
    { label: "Placement", col: "placement" },
    { label: "Percentile", col: "percentile" },
    { label: "Delta", col: "delta" },
  ];
  cols.forEach(function (c) {
    var label = c.label;
    if (c.col === sortState.column) label += " " + (sortState.isAscending ? "\u25B4" : "\u25BE");
    var th = getElem("th", null, label);
    if (c.col) th.addEventListener("click", toggleSort.bind(null, c.col));
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

    var stageName = getStageName(e.routeId) || e.routeId;
    var locationName = getLocationName(e.locationId) || "";
    var className = getClassName(e.vehicleClassId) || "";
    var weather = e.surfaceCondition == 1 ? "Wet" : "Dry";
    var stageTd = getElem("td");
    stageTd.innerHTML =
      "<span class=\"stage-main\">" + stageName + "</span><br>" +
      "<span class=\"muted\">" + locationName + " \u2014 " + weather + " \u2014 " + className + "</span>";
    tr.appendChild(stageTd);

    tr.appendChild(getElem("td", null, e.rank));
    tr.appendChild(getElem("td", null, s.percentile != null ? scorecardStatDefs.percentile(s) : ""));
    tr.appendChild(getElem("td", null, scorecardStatDefs.delta(s)));

    tbody.appendChild(tr);
  });
}

export { setSort, renderListView };
