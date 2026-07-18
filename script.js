"use strict";

window.collapsed = new Set();

function getElem(tag, className, text) {
  const elem = document.createElement(tag);
  if (className) elem.className = className;
  if (text != null) elem.textContent = text;
  return elem;
}

function getTotals(classId, drivetrain, locId, surface) {
  const entries = window.apiData?.entries;
  const config = window.SCORECARD_CONFIG;
  if (!entries) return { percentile: "" };

  const matching = entries.filter(e =>
    (!classId || e.vehicleClassId === classId) &&
    (!drivetrain || (config.xDict[drivetrain] || []).includes(e.vehicleClassId)) &&
    (!locId || e.locationId === locId) &&
    (!surface || (config.yDict[surface] || []).includes(e.locationId))
  );
  if (!matching.length) return { percentile: "" };
  const sum = matching.reduce((s, e) => s + (e.rank / e.totalEntries) * 100, 0);
  return { percentile: Math.round(sum / matching.length) };
}

const grid = getElem("div", "score-table-grid");

window.buildTable = function(config) {
  const buildEntries = (dict) => [["", null], ...Object.entries(dict).map(([k, v]) => window.collapsed.has(k) ? [k, [null]] : [k, v])];

  grid.innerHTML = "";

  buildEntries(config.xDict).forEach(([xKey, xVal], xi) => {
    buildEntries(config.yDict).forEach(([yKey, yVal], yi) => {
      let chunk;
      if (xKey && yKey)
        chunk = getChunk(config.dataFunc(xKey, null, yKey, null), yVal.map(y => xVal.map(x => config.dataFunc(xKey, x, yKey, y))), "data");
      else if (xKey)
        chunk = getChunk(config.xGroupFunc(xKey), xVal[0] ? [xVal.map(config.xFunc)] : null, "xhead", xKey);
      else if (yKey)
        chunk = getChunk(config.yGroupFunc(yKey), yVal[0] ? yVal.map(y => [config.yFunc(y)]) : null, "yhead", yKey);
      else
        chunk = getChunk(null, null);

      chunk.style.gridColumn = xi + 1;
      chunk.style.gridRow = yi + 1;
      grid.appendChild(chunk);
    })
  })

  const wrapper = document.querySelector(".table-wrapper");
  if (!grid.parentNode) wrapper.appendChild(grid);

  function getChunk(groupVal, cellVals, classStr, collapseKey) {
    const chunk = getElem("div", "chunk " + classStr);
    if (groupVal === null) return chunk;

    const table = getElem("table");
    const thead = getElem("thead");
    const headerRow = getElem("tr");
    const th = getElem("th", null, groupVal);
    th.colSpan = cellVals ? cellVals[0].length : 1;
    headerRow.appendChild(th);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    if (collapseKey) {
      th.style.cursor = "pointer";
      th.textContent = (window.collapsed.has(collapseKey) ? "▶ " : "▼ ") + th.textContent;
      th.addEventListener("click", () => {
        if (window.collapsed.has(collapseKey)) window.collapsed.delete(collapseKey);
        else window.collapsed.add(collapseKey);
        window.buildTable(window.SCORECARD_CONFIG);
      });
    }

    // Don't render cellVals if there is only a single value (handled by groupVal)
    if (cellVals && !(cellVals.length === 1 && cellVals[0].length === 1)) {
      const tbody = getElem("tbody");
      cellVals.forEach((row) => {
        const tr = getElem("tr");
        row.forEach((c) => tr.appendChild(getElem("td", null, c)));
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
    }

    chunk.appendChild(table);
    return chunk;
  }
};

window.SCORECARD_CONFIG = {
  xDict: ClassIdsByDrivetrain,
  xGroupFunc: (drivetrain) => drivetrain,
  xFunc: (classId) => ClassNameByClassId[classId],
  yDict: LocIdsBySurface,
  yGroupFunc: (surface) => surface,
  yFunc: (locId) => LocNameByLocID[locId],
  dataFunc: (drivetrain, classId, surface, locId) => getTotals(classId, drivetrain, locId, surface).percentile,
};