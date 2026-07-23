"use strict";

// Table Config
const CONFIG = {
  xAxis: {
    levelID: "drivetrain",
    getRootIds: () => Object.keys(window.ClassIdsByDrivetrain),
    getChildIds: id => window.ClassIdsByDrivetrain[id],
    label: id => id,
    childLevel: {
      levelID: "class",
      label: id => window.ClassNameByClassId[id],
    },
  },
  yAxis: {
    levelID: "surface",
    getRootIds: () => Object.keys(window.LocIdsBySurface),
    getChildIds: id => window.LocIdsBySurface[id],
    label: id => id,
    childLevel: {
      levelID: "location",
      getChildIds: id => window.LocToStageIds[id],
      label: id => window.LocNameByLocID[id],
      childLevel: {
        levelID: "stage",
        label: id => window.StageNameByStageId[id],
      },
    },
  },
};


// Main
const state = {};
const collapsed = new Set();
const grid = getElem("div", "score-table-grid");
buildTable();


// Build UI
function buildTable() {
  grid.innerHTML = "";
  const xLists = buildLists(CONFIG.xAxis);
  const yLists = buildLists(CONFIG.yAxis);

  const xEntries = [null, ...xLists];
  const yEntries = [null, ...yLists];

  xEntries.forEach((xGroupEntry, xi) => {
    yEntries.forEach((yGroupEntry, yi) => {
      const chunk = buildChunk(xGroupEntry, yGroupEntry);
      chunk.style.gridColumn = xi + 1;
      chunk.style.gridRow = yi + 1;
      grid.appendChild(chunk);
    });
  });

  const wrapper = document.querySelector(".table-wrapper");
  if (!grid.parentNode && wrapper) wrapper.appendChild(grid);
  updateStatPills();
}

function buildChunk(xEntry, yEntry) {
  const isData = xEntry && yEntry;
  const className = isData ? "data" : xEntry ? "xhead" : yEntry ? "yhead" : "corner";

  const valueFn = isData ? getTotals : (x, y) => x?.lvl.label(x.id) ?? y?.lvl.label(y.id) ?? "";

  const groupCell = buildCell(xEntry, yEntry, valueFn, true);

  const groupEntry = xEntry || yEntry;
  if (!isData && groupEntry?.lvl.childLevel) {
    groupCell.insertBefore(getCollapseArrow(`${groupEntry.lvl.levelID}:${groupEntry.id}`), groupCell.firstChild);
  }

  const cells = getChildren(yEntry).map(y => getChildren(xEntry).map(x => buildCell(x, y, valueFn)));

  return getChunk(className, groupCell, cells);
}

function buildCell(xEntry, yEntry, valueFn, isHeader) {
  const hasClick = xEntry && yEntry
    ? state[xEntry.lvl.levelID] !== xEntry.id || state[yEntry.lvl.levelID] !== yEntry.id
    : xEntry || yEntry || Object.values(state).some(v => v != null);
  const el = getElem(isHeader ? "th" : "td", hasClick ? "cell" : null, valueFn(xEntry, yEntry));
  if (hasClick) {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => pinAndRerender(xEntry, yEntry));
  }
  return el;
}

function pinAndRerender(xEntry, yEntry) {
  const togglePin = (def, id) => state[def.levelID] = state[def.levelID] === id ? null : id;
  if (xEntry) togglePin(xEntry.lvl, xEntry.id);
  if (yEntry) togglePin(yEntry.lvl, yEntry.id);
  if (!xEntry && !yEntry) Object.keys(state).forEach(k => state[k] = null);
  buildTable();
}

function buildLists(root) {
  const levelDef = findDeepestPinned(state, root);
  const pinnedId = state[levelDef.levelID];
  const ids = pinnedId != null ? [pinnedId] : levelDef.getRootIds();
  return ids.map(id => ({ lvl: levelDef, id }));

  function findDeepestPinned(state, root) {
    let deepest = root;
    let cur = root;
    while (cur) {
      if (state[cur.levelID] != null) deepest = cur;
      cur = cur.childLevel;
    }
    return deepest;
  }
}

function getChildren(entry) {
  if (!entry) return [null];
  const { lvl, id } = entry;
  if (!lvl.childLevel || collapsed.has(`${lvl.levelID}:${id}`)) return [null];
  return lvl.getChildIds(id).map(cid => ({ lvl: lvl.childLevel, id: cid }));
}


// Get HTML
function getChunk(className, groupCell, cells) {
  const chunk = getElem("div", "chunk " + className);
  const table = getElem("table");
  const thead = getElem("thead");
  const headerRow = getElem("tr");
  groupCell.colSpan = cells[0]?.length ?? 1;

  headerRow.appendChild(groupCell);
  thead.appendChild(headerRow);
  table.appendChild(thead);

  if (cells.length && !(cells.length === 1 && cells[0].length === 1)) {
    const tbody = getElem("tbody");
    cells.forEach(row => {
      const tr = getElem("tr");
      row.forEach(td => tr.appendChild(td));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  }

  chunk.appendChild(table);
  return chunk;
}

function getCollapseArrow(key) {
  const arrow = getElem("span", "collapse-arrow", collapsed.has(key) ? "▶ " : "▼ ");
  arrow.addEventListener("click", e => {
    e.stopPropagation();
    collapsed.has(key) ? collapsed.delete(key) : collapsed.add(key);
    buildTable();
  });
  return arrow;
}

function getElem(tag, className, text) {
  const elem = document.createElement(tag);
  if (className) elem.className = className;
  if (text != null) elem.textContent = text;
  return elem;
}