export function getElem(tag, className, text) {
  const elem = document.createElement(tag);
  if (className) elem.className = className;
  if (text != null) elem.textContent = text;
  return elem;
}

export function getPanel(className, groupCell, cells) {
  const panel = getElem("div", "panel " + className);
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

  panel.appendChild(table);
  return panel;
}

export function getAxisToggleButton(axis, isCollapsed, onToggle) {
  const btn = getElem("span", `axis-toggle axis-toggle--${axis}`);
  const icon = makeChevronSvg();
  // Base chevron points right: y => right/left, x => down/up
  const rotation = axis === "x"
    ? (isCollapsed ? "90deg" : "-90deg")
    : (isCollapsed ? "0deg" : "180deg");
  icon.style.transform = `rotate(${rotation})`;
  btn.appendChild(icon);
  btn.addEventListener("click", e => {
    e.stopPropagation();
    onToggle();
  });
  return btn;
}

function makeChevronSvg() {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS(NS, "path");
  path.setAttribute("d", "M5.02 13.5 L8.63 8 L5.02 2.5 L7.45 2.5 L10.99 8 L7.45 13.5 Z");
  path.setAttribute("fill", "currentColor");
  svg.appendChild(path);
  return svg;
}

export function getCellLayout(...columns) {
  const layout = getElem("div", "cell-layout");
  columns.forEach((el, i) => {
    if (!el) return;
    el.style.gridColumn = i + 1;
    layout.appendChild(el);
  });
  return layout;
}
