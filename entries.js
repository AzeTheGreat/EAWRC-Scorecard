import { StageNameByStageId, LocNameByLocID, ClassNameByClassId } from './luts.js';
import { parseTime, formatTime, getFilteredEntries } from './calc.js';
import { state, getElem } from './table.js';

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

  var sorted = getFilteredEntries(state).sort((a, b) => {
    var cmp = compareEntries(a, b, entriesSort.column);
    return entriesSort.isAscending ? cmp : -cmp;
  });

  sorted.forEach(function (e) {
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
    tr.appendChild(getElem("td", null, Math.round((e.rank / e.totalEntries) * 100)));

    var deltaSecs = parseTime(e.differenceToFirst);
    tr.appendChild(getElem("td", null, deltaSecs != null ? formatTime(deltaSecs) : "\u2014"));

    tbody.appendChild(tr);
  });
}

function compareEntries(a, b, column) {
  switch (column) {
    case "placement":
      return a.rank - b.rank;
    case "percentile":
      return a.rank / a.totalEntries - b.rank / b.totalEntries;
    case "delta":
      return (parseTime(a.differenceToFirst) || 0) - (parseTime(b.differenceToFirst) || 0);
  }
  return 0;
}

export { setSort, renderEntriesView };
