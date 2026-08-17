export function getElem(tag, className, text) {
  const elem = document.createElement(tag);
  if (className) elem.className = className;
  if (text != null) elem.textContent = text;
  return elem;
}

export function getChunk(className, groupCell, cells) {
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

export function getAxisToggleButton(axis, isCollapsed, onToggle) {
  const btn = getElem("span", `axis-toggle axis-toggle--${axis}`, isCollapsed ? "\u276F" : "\u276E");
  btn.addEventListener("click", e => {
    e.stopPropagation();
    onToggle();
  });
  return btn;
}
