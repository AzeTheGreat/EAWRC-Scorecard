import { buildTable } from './table.js';
import { updateStatPills } from './stats.js';
import { renderEntriesView } from './entries.js';
import { setApiData } from './apiData.js';

function render() {
  buildTable();
  updateStatPills();
  renderEntriesView();
}

function getUsernameFromURL() {
  var params = new URLSearchParams(window.location.search);
  return params.get("user") || null;
}

function pushUsernameToURL(username) {
  var url = new URL(window.location.href);
  url.searchParams.set("user", username);
  history.pushState(null, "", url.toString());
}

window.fetchProfile = function (username, skipPush) {
  fetch("https://fourleft.io/api_v2/time-trials/player?name=" + encodeURIComponent(username))
    .then(res => {
      if (!res.ok) throw new Error("API request failed: " + res.status);
      return res.json();
    })
    .then(function (apiData) {
      setApiData(apiData);
      render();
      if (!skipPush) pushUsernameToURL(username);
    })
    .catch(err => alert(err.message));
};

window.addEventListener("popstate", function () {
  var username = getUsernameFromURL();
  if (username) window.fetchProfile(username, true);
  else render();
});

var initialUser = getUsernameFromURL();
if (initialUser) window.fetchProfile(initialUser, true);
else render();

document.getElementById("profile-name").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    var name = e.target.value.trim();
    if (name) window.fetchProfile(name);
  }
});

export { render };
