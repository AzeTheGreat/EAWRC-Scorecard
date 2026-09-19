import { renderMatrixView } from './views/matrixView.js';
import { updateStatPills } from './views/statPills.js';
import { renderListView } from './views/listView.js';
import { setApiData } from './state/apiData.js';

const profileInput = document.getElementById("profile-name");
const suggestBox = document.getElementById("profile-suggest");
let debounce, suggestAbort;

export function render() {
  renderMatrixView();
  updateStatPills();
  renderListView();
}

const getUsernameFromURL = () => new URLSearchParams(window.location.search).get("user") || null;

function setUsernameInURL(username) {
  const url = new URL(window.location.href);
  if (username) url.searchParams.set("user", username);
  else url.searchParams.delete("user");
  history.pushState(null, "", url.toString());
}

async function loadProfile(username, pushURL = true) {
  suggestBox.hidden = true;
  profileInput.value = username ?? "";
  if (username) {
    try {
      const res = await fetch("https://fourleft.io/api_v2/time-trials/player?name=" + encodeURIComponent(username));
      if (!res.ok) throw new Error("API request failed: " + res.status);
      setApiData(await res.json());
    } catch (err) {
      alert(err.message);
      return;
    }
  } else {
    setApiData(null);
  }
  render();
  if (pushURL) setUsernameInURL(username);
}

window.addEventListener("popstate", () => loadProfile(getUsernameFromURL(), false));

profileInput.addEventListener("keydown", e => {
  if (e.key === "Enter") loadProfile(e.target.value.trim() || null);
});

profileInput.addEventListener("input", e => {
  clearTimeout(debounce);
  suggestAbort?.abort();
  debounce = setTimeout(async () => {
    const q = e.target.value.trim();
    if (q.length < 2) { suggestBox.hidden = true; return; }
    suggestAbort = new AbortController();
    try {
      const res = await fetch("https://fourleft.io/api_v2/time-trials/players/suggest?q=" + encodeURIComponent(q), { signal: suggestAbort.signal });
      if (q !== profileInput.value.trim()) return;
      const list = res.ok ? await res.json() : [];
      suggestBox.innerHTML = "";
      for (const name of list) {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = name;
        li.append(btn);
        suggestBox.append(li);
      }
      suggestBox.hidden = !list.length;
    } catch (err) { if (err?.name !== "AbortError") suggestBox.hidden = true; }
  }, 180);
});

suggestBox.addEventListener("mousedown", e => {
  e.preventDefault();
  const btn = e.target.closest("button");
  if (btn) loadProfile(btn.textContent.trim());
});

profileInput.addEventListener("blur", () => { suggestBox.hidden = true; });

loadProfile(getUsernameFromURL(), false);