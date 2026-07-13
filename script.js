(function () {
  "use strict";

  buildTable({
    xDict: ClassIdsByDrivetrain,
    xGroupFunc: (drivetrain) => drivetrain,
    xFunc: (classId) => ClassNameByClassId[classId],
    yDict: LocIdsBySurface,
    yGroupFunc: (surface) => surface,
    yFunc: (locId) => LocNameByLocID[locId],
    dataGroupFunc: (drivetrain, surface) => getTotals(null, null).percentile,
    dataFunc: (classId, locId) => getTotals(classId, locId).percentile,
  });

  function getTotals(classId, locId) {
    const hasValue = Math.random() < 0.33;
    return { percentile: hasValue ? Math.floor(Math.random() * 101) : "" };
  }

  function buildTable(config) {
    const table = document.getElementById("score-table");
    const xKeys = Object.keys(config.xDict);
    const yKeys = Object.keys(config.yDict);

    const getHeaderRow = () => getRow([
      { text: null, rowspan: 2 },
      ...xKeys.map(k => ({ text: config.xGroupFunc(k), colSpan: config.xDict[k].length })),
    ]);

    const getSubHeaderRow = () => getRow(
      xKeys.flatMap(k => config.xDict[k].map(v => ({ text: config.xFunc(v) })))
    );

    const getGroupDataRow = (yKey) => getRow([
      { text: config.yGroupFunc(yKey) },
      ...xKeys.map(k => ({ text: config.dataGroupFunc(k, yKey), tag: "td", colSpan: config.xDict[k].length })),
    ]);

    const getDataRow = (yKey, yVal) => getRow([
      { text: config.yFunc(yVal) },
      ...xKeys.flatMap(k => config.xDict[k].map(v => ({ text: config.dataFunc(v, yVal), tag: "td" }))),
    ]);

    const thead = getElem("thead");
    thead.appendChild(getHeaderRow());
    thead.appendChild(getSubHeaderRow());
    table.appendChild(thead);

    const tbody = getElem("tbody");
    yKeys.forEach(yKey => {
      tbody.appendChild(getGroupDataRow(yKey));
      config.yDict[yKey].forEach(yVal => {
        tbody.appendChild(getDataRow(yKey, yVal));
      });
    });

    table.appendChild(tbody);
  };

  function getRow(cells) {
    const row = getElem("tr");
    cells.forEach(({ text, tag = "th", colSpan, rowspan }) => {
      const cell = getElem(tag, text);
      if (colSpan) cell.colSpan = colSpan;
      if (rowspan) cell.rowSpan = rowspan;
      row.appendChild(cell);
    });
    return row;
  };

  function getElem(tag, text) {
    const elem = document.createElement(tag);
    if (text != null) elem.textContent = text;
    return elem;
  };

})();
