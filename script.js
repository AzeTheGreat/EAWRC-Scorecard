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
    const grid = getElem("div", "score-table-grid");

    Object.entries({ "": null, ...config.xDict }).forEach(([xKey, xVal], xi) => {
      Object.entries({ "": null, ...config.yDict }).forEach(([yKey, yVal], yi) => {
        let chunk;
        if (xKey && yKey)
          chunk = getChunk(config.dataGroupFunc(xKey, yKey), yVal.map(y => xVal.map(x => config.dataFunc(x, y))), "data");
        else if(xKey)
          chunk = getChunk(config.xGroupFunc(xKey), [xVal.map(config.xFunc)], "xhead");
        else if(yKey)
          chunk = getChunk(config.yGroupFunc(yKey), yVal.map(y => [config.yFunc(y)]), "yhead");
        else
          chunk = getChunk(null, null);

        chunk.style.gridColumn = xi + 1;
        chunk.style.gridRow = yi + 1;
        grid.appendChild(chunk);
      })
    })

    const wrapper = document.querySelector(".table-wrapper");
    wrapper.appendChild(grid);

    function getChunk(groupVal, cellVals, classStr) {
      const chunk = getElem("div", "chunk " + classStr);
      
      if(groupVal === null || cellVals === null)
        return chunk;

      const table = getElem("table");
      const thead = getElem("thead");
      const headerRow = getElem("tr");
      const th = getElem("th", null, groupVal);
      th.colSpan = cellVals[0].length;
      headerRow.appendChild(th);
      thead.appendChild(headerRow);
      table.appendChild(thead);

      const tbody = getElem("tbody");
      cellVals.forEach((row) => {
        const tr = getElem("tr");
        row.forEach((c) => {
          tr.appendChild(getElem("td", null, c));
        });
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      chunk.appendChild(table);
      return chunk;
    }
  }

  function getElem(tag, className, text) {
    const elem = document.createElement(tag);
    if (className) elem.className = className;
    if (text != null) elem.textContent = text;
    return elem;
  }
})();
