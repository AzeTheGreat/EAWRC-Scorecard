function formatTime(secs) {
  if (secs == null || isNaN(secs)) return "\u2014";
  var min = Math.floor(secs / 60);
  var s = secs % 60;
  return min + ":" + s.toFixed(1).padStart(4, "0");
}

export { formatTime };
