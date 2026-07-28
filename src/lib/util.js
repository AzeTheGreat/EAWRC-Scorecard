function avg(arr) {
  return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : null;
}

function parseTime(timeStr) {
  if (!timeStr) return null;
  var parts = timeStr.split(":");
  if (parts.length === 3) return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
  if (parts.length === 2) return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
  return parseFloat(parts[0]);
}

function formatTime(secs) {
  if (secs == null || isNaN(secs)) return "\u2014";
  var min = Math.floor(secs / 60);
  var s = secs % 60;
  return min + ":" + s.toFixed(1).padStart(4, "0");
}

export { avg, parseTime, formatTime };
