const table = document.getElementById('score-table');
const cols = 21;
const rows = 22;

for (let r = 0; r < rows; r++) {
  const tr = document.createElement('tr');
  for (let c = 0; c < cols; c++) {
    const cell = r === 0 ? document.createElement('th') : document.createElement('td');
    tr.appendChild(cell);
  }
  table.appendChild(tr);
}
