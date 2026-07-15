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
          chunk = getChunk(config.dataGroupFunc(xKey, yKey), yVal.map(y => xVal.map(x => config.dataFunc(x, y))));
        else if(xKey)
          chunk = getChunk(config.xGroupFunc(xKey), [xVal.map(config.xFunc)], true);
        else if(yKey)
          chunk = getChunk(config.yGroupFunc(yKey), yVal.map(y => [config.yFunc(y)]), true);
        else
          chunk = getChunk(null, null);

        chunk.style.gridColumn = xi + 1;
        chunk.style.gridRow = yi + 1;
        grid.appendChild(chunk);
      })
    })

    const wrapper = document.querySelector(".table-wrapper");
    wrapper.appendChild(grid);

    function getChunk(headerVal, dataVals, gridCol, gridRow, isHeader = false) {
      const chunk = getElem("div", "chunk");
      if(headerVal === null || dataVals === null)
        return chunk;

      const header = getElem("div", "chunk-header", headerVal);
      chunk.appendChild(header);

      const grid = getElem("div", "chunk-sub-grid");
      dataVals.forEach((row, ri) => {
        row.forEach((d, ci) => {
          const cell = getElem("div", null, d);
          cell.style.gridColumn = ci + 1;
          cell.style.gridRow = ri + 1;
          grid.appendChild(cell);
        });
      });
      chunk.appendChild(grid);

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
