import { renderMatrixView } from './views/matrixView.js';
import { updateStatPills } from './views/statPills.js';
import { renderListView } from './views/listView.js';
import { setApiData } from './state/apiData.js';

const profileInput = document.getElementById("profile-name");

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

loadProfile(getUsernameFromURL(), false);