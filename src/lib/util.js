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

function sigFig(value) {
  if (value == null || isNaN(value)) return "\u2014";
  return Math.abs(value) >= 1 ? Math.round(value) : Number(value.toPrecision(1));
}

function formatDelta(secs, forceSign, decimals) {
  if (secs == null || isNaN(secs)) return "\u2014";
  var prefix = forceSign ? "+" : "";
  if (secs >= 60) {
    var total = Math.round(secs);
    return prefix + Math.floor(total / 60) + "m " + (total % 60) + "s";
  }
  return prefix + secs.toFixed(decimals) + "s";
}

function formatClock(secs, forceSign, decimals) {
  if (secs == null || isNaN(secs)) return "\u2014";
  var prefix = forceSign ? "+" : "";
  if (secs >= 60) {
    var min = Math.floor(secs / 60);
    var sec = secs % 60;
    var secStr = sec.toFixed(decimals).padStart(decimals + 3, "0");
    if (secStr.startsWith("60")) {
      min += 1;
      secStr = (0).toFixed(decimals).padStart(decimals + 3, "0");
    }
    return prefix + min + ":" + secStr;
  }
  return prefix + secs.toFixed(decimals);
}

export { avg, parseTime, sigFig, formatDelta, formatClock };
