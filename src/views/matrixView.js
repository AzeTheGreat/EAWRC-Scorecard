import { getDrivetrainIds, getClassIds, getClassName, getSurfaceIds, getLocationIds, getStageIds, getLocationName, getStageName } from '../core/luts.js';
import { getElem, getPanel, getAxisToggleButton, getCellLayout } from '../lib/dom.js';
import { getState, setState, getSelectedStat, getCurrentStats } from '../state/scorecardState.js';
import { matrixStatDefs, applyStatColor } from '../core/statDefs.js';

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
const grid = document.querySelector(".table-wrapper");

function updateScrollbarGap() {
  grid.classList.toggle("has-x-scroll", grid.scrollWidth > grid.clientWidth + 1);
}

new ResizeObserver(updateScrollbarGap).observe(grid);

const MOBILE_BREAKPOINT_QUERY = "(max-width: 40em)";
let defaultsCollapsed;
let collapseOverride;

resetCollapseDefaults();

function resetCollapseDefaults() {
  defaultsCollapsed = window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
  collapseOverride = { x: null, y: null };
}

function isAxisCollapsed(axis) {
  const override = collapseOverride[axis];
  return override != null ? override : defaultsCollapsed;
}

function findDeepestPinnedLevel(axisDef, state) {
  let deepest = axisDef;
  let cur = axisDef;
  while (cur) {
    if (state[cur.levelID] != null) deepest = cur;
    cur = cur.childLevel;
  }
  return deepest;
}

// Build UI
function renderMatrixView() {
  grid.innerHTML = "";
  const xLists = buildLists(CONFIG.xAxis);
  const yLists = buildLists(CONFIG.yAxis);

  grid.style.gridTemplateColumns =
    [1, ...xLists.map(x => getChildren(x).length)]
      .map(n => `${n}fr`)
      .join(" ");

  const xEntries = [null, ...xLists];
  const yEntries = [null, ...yLists];

  xEntries.forEach((xGroupEntry, xi) => {
    yEntries.forEach((yGroupEntry, yi) => {
      const panel = buildPanel(xGroupEntry, yGroupEntry);
      panel.style.gridColumn = xi + 1;
      panel.style.gridRow = yi + 1;
      grid.appendChild(panel);
    });
  });
  updateScrollbarGap();
}

function buildPanel(xEntry, yEntry) {
  const getValLayout = (xe, ye) => {
    // buildCell is called with only child entries, which can be null when drilled-down.
    // Thus, filters need to include current drill-down state.
    var filters = { ...getState() };
    if (xe) filters[xe.lvl.levelID] = xe.id;
    if (ye) filters[ye.lvl.levelID] = ye.id;

    const stats = getCurrentStats(filters);
    const selectedStat = getSelectedStat();
    const value = stats.percentile != null ? matrixStatDefs[selectedStat](stats) : "";

    const layout = getElem("div", "val-layout has-completion");
    layout.style.setProperty("--completion", Math.min(stats.completion ?? 0, 1));
    applyStatColor(layout, selectedStat, stats[selectedStat], stats);
    layout.appendChild(getElem("span", "cell-label", value));
    return layout;
  }

  const getHeaderLayout = (xe, ye, className) => {
    const entry = xe ?? ye;
    if (!entry) return buildCornerControls(className?.includes("to-root"));
    const label = getElem("span", "cell-label", entry.lvl.label(entry.id));
    const arrow = className?.includes("drill-up") ? buildDrillArrow(xe ? "up" : "left") : null;
    return getCellLayout(xe ? null : label, xe ? label : null, arrow);
  };

  const isData = xEntry && yEntry;
  const className = isData ? "data" : xEntry ? "xhead" : yEntry ? "yhead" : "corner";
  const valueFn = isData ? getValLayout : getHeaderLayout;

  const groupCell = buildCell(xEntry, yEntry, valueFn, true);
  const cells = getChildren(yEntry).map(y => getChildren(xEntry).map(x => buildCell(x, y, valueFn)));
  return getPanel(className, groupCell, cells);
}

function buildCornerControls(isToRoot) {
  const toggleAxisCollapse = (axis) => { collapseOverride[axis] = !isAxisCollapsed(axis); renderMatrixView(); }
  
  const buildAxisToggleSlot = (axis, axisDef) => !!findDeepestPinnedLevel(axisDef, getState()).childLevel ? 
    getAxisToggleButton(axis, isAxisCollapsed(axis), () => toggleAxisCollapse(axis)) : 
    getElem("div");
  
  const center = getElem("div", "corner-controls-center");
  if (isToRoot) center.appendChild(buildDrillArrow("corner"));
  return getCellLayout(
    buildAxisToggleSlot("y", CONFIG.yAxis),
    center,
    buildAxisToggleSlot("x", CONFIG.xAxis),
  );
}

function buildCell(xEntry, yEntry, valueFn, isHeader) {
  const state = getState();
  const { className, action } = getClickActionAndClass(xEntry, yEntry, state);
  const el = getElem(isHeader ? "th" : "td", className);
  el.appendChild(valueFn(xEntry, yEntry, className));
  if (action) el.addEventListener("click", action);
  return el;
}

function makeArrowSvg() {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", "M2 8h10.5M8.5 4.5 12.5 8l-4 3.5");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "currentColor");
  path.setAttribute("stroke-width", "2.2");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");
  svg.appendChild(path);
  return svg;
}

function buildDrillArrow(variant) {
  const drillRotations = { up: "-90deg", left: "180deg", corner: "-135deg" };

  const el = getElem("span", "drill-arrow");
  el.appendChild(makeArrowSvg());
  if (variant === "corner") el.appendChild(makeArrowSvg());
  el.style.transform = "rotate(" + (drillRotations[variant] || "0deg") + ")";
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
      className: "to-root clickable",
      action: applyAndSet(() => {
        Object.keys(state).forEach(k => (state[k] = null));
        resetCollapseDefaults();
      }),
    };
  }

  // Data cell: drill into both axes, unless we're already there
  if (xEntry && yEntry) {
    const alreadyThere =
      state[xEntry.lvl.levelID] === xEntry.id && state[yEntry.lvl.levelID] === yEntry.id;
    if (alreadyThere) return noOp;
    return {
      className: "clickable",
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
    className: isPinned ? "drill-up clickable" : "clickable",
    action: applyAndSet(() => { state[levelID] = isPinned ? null : id; }),
  };
}

function buildLists(root) {
  const state = getState();
  const levelDef = findDeepestPinnedLevel(root, state);
  const pinnedId = state[levelDef.levelID];
  const ids = pinnedId != null ? [pinnedId] : levelDef.getRootIds();
  return ids.map(id => ({ lvl: levelDef, id }));
}

function getChildren(entry) {
  if (!entry) return [null];
  const { lvl, id } = entry;
  if (!lvl.childLevel || isAxisCollapsed(getLevelAxis(lvl))) return [null];
  return lvl.getChildIds(id).map(cid => ({ lvl: lvl.childLevel, id: cid }));
}

function getLevelAxis(lvl) {
  for (let cur = CONFIG.xAxis; cur; cur = cur.childLevel) if (cur === lvl) return "x";
  for (let cur = CONFIG.yAxis; cur; cur = cur.childLevel) if (cur === lvl) return "y";
}

export { renderMatrixView };
