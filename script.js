(function () {
  "use strict";

  const table = document.getElementById("score-table");
  const classes = window.CLASS_LUT;
  const locations = window.LOCATION_LUT;

  const groups = ["RWD", "4WD", "FWD"].map((dt) => ({
    label: dt,
    classes: classes.filter((c) => c.drivetrain === dt),
  }));

  const surfaces = [
    { name: "Loose", locs: locations.filter((l) => l.surfaceType === "Loose") },
    { name: "Asphalt", locs: locations.filter((l) => l.surfaceType === "Asphalt") },
  ];

  const allClasses = groups.flatMap((g) => g.classes);

  function createElem(tag, text) {
    const elem = document.createElement(tag);
    if (text != null) elem.textContent = text;
    return elem;
  }

  function randomValue() {
    return Math.random() < 0.33 ? Math.floor(Math.random() * 101) : "";
  }

  // thead
  const thead = createElem("thead");

  const drivetrainRow = createElem("tr");
  const corner = createElem("th");
  corner.rowSpan = 2;
  drivetrainRow.appendChild(corner);
  groups.forEach((g) => {
    const th = createElem("th", g.label);
    th.colSpan = g.classes.length;
    drivetrainRow.appendChild(th);
  });
  thead.appendChild(drivetrainRow);

  const classRow = createElem("tr");
  allClasses.forEach((c) => classRow.appendChild(createElem("th", c.shortName)));
  thead.appendChild(classRow);

  table.appendChild(thead);

  // tbody
  const tbody = createElem("tbody");

  surfaces.forEach((surface) => {
    const surfaceRow = createElem("tr");
    surfaceRow.appendChild(createElem("th", surface.name));
    groups.forEach((g) => {
      const td = createElem("td", randomValue());
      td.colSpan = g.classes.length;
      surfaceRow.appendChild(td);
    });
    tbody.appendChild(surfaceRow);

    surface.locs.forEach((loc) => {
      const row = createElem("tr");
      row.appendChild(createElem("th", loc.shortName));
      allClasses.forEach(() => row.appendChild(createElem("td", randomValue())));
      tbody.appendChild(row);
    });
  });

  table.appendChild(tbody);
})();
