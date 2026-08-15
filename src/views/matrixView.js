import { getDrivetrainIds, getClassIds, getClassName, getSurfaceIds, getLocationIds, getStageIds, getLocationName, getStageName } from '../core/luts.js';
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
    getRootIds: () => getDrivetrainIds(),
    getChildIds: id => getClassIds(id),
    label: id => id,
    childLevel: {
      levelID: "class",
      label: id => getClassName(id),
    },
  },
  yAxis: {
    levelID: "surface",
    getRootIds: () => getSurfaceIds(),
    getChildIds: id => getLocationIds(id),
    label: id => id,
    childLevel: {
      levelID: "location",
      getChildIds: id => getStageIds(id),
      label: id => getLocationName(id),
      childLevel: {
        levelID: "stage",
        label: id => getStageName(id),
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
  const { className, action } = getClickActionAndClass(xEntry, yEntry, state);
  const el = getElem(isHeader ? "th" : "td", className, valueFn(xEntry, yEntry));
  if (action) el.addEventListener("click", action);
  return el;
}

function getClickActionAndClass(xEntry, yEntry, state) {
  const noOp = { className: null, action: null };
  const applyAndSet = (mutate) => () => { mutate(); setState(state); };

  // Corner cell: clear everything, but only if something is actually filtered
  if (!xEntry && !yEntry) {
    const hasFilters = Object.values(state).some(v => v != null);
    if (!hasFilters) return noOp;
    return {
      className: "to-root",
      action: applyAndSet(() => Object.keys(state).forEach(k => (state[k] = null))),
    };
  }

  // Data cell: drill into both axes, unless we're already there
  if (xEntry && yEntry) {
    const alreadyThere =
      state[xEntry.lvl.levelID] === xEntry.id && state[yEntry.lvl.levelID] === yEntry.id;
    if (alreadyThere) return noOp;
    return {
      className: "cell",
      action: applyAndSet(() => {
        state[xEntry.lvl.levelID] = xEntry.id;
        state[yEntry.lvl.levelID] = yEntry.id;
      }),
    };
  }

  // Header cell: toggle drill for a single level
  const { lvl: { levelID }, id } = xEntry || yEntry;
  const isPinned = state[levelID] === id;
  return {
    className: isPinned ? "drill-up" : "cell",
    action: applyAndSet(() => { state[levelID] = isPinned ? null : id; }),
  };
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
