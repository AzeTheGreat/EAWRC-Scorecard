import { ClassIdsByDrivetrain, ClassNameByClassId, LocIdsBySurface, LocNameByLocID, LocToStageIds, StageNameByStageId } from '../core/luts.js';
import { getFilteredEntries } from '../core/entryFilters.js';
import { getStats } from '../core/calc.js';
import { getElem, getChunk, getCollapseArrow } from '../lib/dom.js';
import { getState, setState, getSelectedStat } from '../state/scorecardState.js';
import { getApiData } from '../state/apiData.js';
import { scorecardStatDefs } from '../core/statDefs.js';

// Table Config
const CONFIG = {
  xAxis: {
    levelID: "drivetrain",
    getRootIds: () => Object.keys(ClassIdsByDrivetrain),
    getChildIds: id => ClassIdsByDrivetrain[id],
    label: id => id,
    childLevel: {
      levelID: "class",
      label: id => ClassNameByClassId[id],
    },
  },
  yAxis: {
    levelID: "surface",
    getRootIds: () => Object.keys(LocIdsBySurface),
    getChildIds: id => LocIdsBySurface[id],
    label: id => id,
    childLevel: {
      levelID: "location",
      getChildIds: id => LocToStageIds[id],
      label: id => LocNameByLocID[id],
      childLevel: {
        levelID: "stage",
        label: id => StageNameByStageId[id],
      },
    },
  },
};

// Main
const collapsed = new Set();
const grid = getElem("div", "score-table-grid");

// Build UI
function renderMatrixView() {
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
}

function buildChunk(xEntry, yEntry) {
  const getHeaderStr = (xe, ye) => xe?.lvl.label(xe.id) ?? ye?.lvl.label(ye.id) ?? "";
  const getValStr = (xe, ye) => {
    // buildCell is called with only child entries, which can be null when drilled-down.
    // Thus, filters need to include current drill-down state.
    var filters = { ...getState() };
    if (xe) filters[xe.lvl.levelID] = xe.id;
    if (ye) filters[ye.lvl.levelID] = ye.id;

    const entries = getFilteredEntries(getApiData()?.entries, filters);
    return entries.length ? scorecardStatDefs[getSelectedStat()](getStats(entries)) : "";
  } 

  const isData = xEntry && yEntry;
  const className = isData ? "data" : xEntry ? "xhead" : yEntry ? "yhead" : "corner";
  const valueFn = isData ? getValStr : getHeaderStr;

  const groupCell = buildCell(xEntry, yEntry, valueFn, true);
  const groupEntry = xEntry || yEntry;
  if (!isData && groupEntry?.lvl.childLevel) {
    const key = `${groupEntry.lvl.levelID}:${groupEntry.id}`;
    var arrow = getCollapseArrow(
      collapsed.has(key),
      () => {
        collapsed.has(key) ? collapsed.delete(key) : collapsed.add(key);
        renderMatrixView();
      });

    groupCell.insertBefore(arrow, groupCell.firstChild);
  }

  const cells = getChildren(yEntry).map(y => getChildren(xEntry).map(x => buildCell(x, y, valueFn)));

  return getChunk(className, groupCell, cells);
}

function buildCell(xEntry, yEntry, valueFn, isHeader) {
  const state = getState();
  const hasClick = xEntry && yEntry
    ? state[xEntry.lvl.levelID] !== xEntry.id || state[yEntry.lvl.levelID] !== yEntry.id
    : xEntry || yEntry || Object.values(state).some(v => v != null);
  const el = getElem(isHeader ? "th" : "td", hasClick ? "cell" : null, valueFn(xEntry, yEntry));
  if (hasClick) {
    el.style.cursor = "pointer";
    el.addEventListener("click", () => pinAndRerender(state, xEntry, yEntry));
  }
  return el;
}

function pinAndRerender(state, xEntry, yEntry) {
  const togglePin = (def, id) => state[def.levelID] = state[def.levelID] === id ? null : id;
  if (xEntry) togglePin(xEntry.lvl, xEntry.id);
  if (yEntry) togglePin(yEntry.lvl, yEntry.id);
  if (!xEntry && !yEntry) Object.keys(state).forEach(k => state[k] = null);
  setState(state);
}

function buildLists(root) {
  const state = getState();
  const levelDef = findDeepestPinned(root);
  const pinnedId = state[levelDef.levelID];
  const ids = pinnedId != null ? [pinnedId] : levelDef.getRootIds();
  return ids.map(id => ({ lvl: levelDef, id }));

  function findDeepestPinned(root) {
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

export { renderMatrixView };
