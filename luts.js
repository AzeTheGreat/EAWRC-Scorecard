(function () {
  "use strict";

  window.LOCATION_LUT = [
    { name: "AGON by AOC Rally Pacifico", shortName: "Pacifico", surfaceType: "Loose", stageCount: 24, flag: "🇲🇽" },
    { name: "Bio Bío Rally Chile", shortName: "Chile", surfaceType: "Loose", stageCount: 24, flag: "🇨🇱" },
    { name: "EKO Acropolis Rally Greece", shortName: "Greece", surfaceType: "Loose", stageCount: 24, flag: "🇬🇷" },
    { name: "FANATEC Rally Oceania", shortName: "Oceana", surfaceType: "Loose", stageCount: 24, flag: "🇦🇺" },
    { name: "Guanajuato Rally México", shortName: "Mexico", surfaceType: "Loose", stageCount: 24, flag: "🇲🇽" },
    { name: "ORLEN 80th Rally Poland", shortName: "Poland", surfaceType: "Loose", stageCount: 24, flag: "🇵🇱" },
    { name: "Rally Estonia", shortName: "Estonia", surfaceType: "Loose", stageCount: 24, flag: "🇪🇪" },
    { name: "Rally Italia Sardegna", shortName: "Italia", surfaceType: "Loose", stageCount: 24, flag: "🇮🇹" },
    { name: "Rally Scandia", shortName: "Scandia", surfaceType: "Loose", stageCount: 24, flag: "🇸🇪" },
    { name: "Rally Sweden", shortName: "Sweden", surfaceType: "Loose", stageCount: 24, flag: "🇸🇪" },
    { name: "Safari Rally Kenya", shortName: "Kenya", surfaceType: "Loose", stageCount: 24, flag: "🇰🇪" },
    { name: "Secto Rally Finland", shortName: "Finland", surfaceType: "Loose", stageCount: 24, flag: "🇫🇮" },
    { name: "Tet Rally Latvia", shortName: "Latvia", surfaceType: "Loose", stageCount: 24, flag: "🇱🇻" },
    { name: "Vodafone Rally de Portugal", shortName: "Portugal", surfaceType: "Loose", stageCount: 24, flag: "🇵🇹" },
    { name: "Central Europe Rally", shortName: "Central Europe", surfaceType: "Asphalt", stageCount: 24, flag: "🇦🇹" },
    { name: "Croatia Rally", shortName: "Croatia", surfaceType: "Asphalt", stageCount: 24, flag: "🇭🇷" },
    { name: "FORUM8 Rally Japan", shortName: "Japan", surfaceType: "Asphalt", stageCount: 24, flag: "🇯🇵" },
    { name: "Rally Iberia", shortName: "Iberia", surfaceType: "Asphalt", stageCount: 24, flag: "🇪🇸" },
    { name: "Rally Mediterraneo", shortName: "Mediterraneo", surfaceType: "Asphalt", stageCount: 24, flag: "🇮🇹" },
    { name: "Rallye Monte-Carlo", shortName: "Monte-Carlo", surfaceType: "Asphalt", stageCount: 24, flag: "🇲🇨" },
  ];

  window.ClassIdsByDrivetrain = {
    "RWD": [5, 4, 3],
    "4WD": [19, 21, 20, 17, 23, 13, 14, 22, 7, 10, 12, 6],
    "FWD": [8, 9, 11, 2, 1]
  }

  window.ClassNameByClassId = {
    1: "H1",
    2: "H2",
    3: "H2",
    4: "H3",
    5: "Group B",
    6: "Group B",
    7: "NR4",
    8: "Rally4",
    9: "S1600",
    10: "S2000",
    11: "F2 Kit",
    12: "Group A",
    13: "WRC 97-11",
    14: "Rally2",
    17: "WRC 17-21",
    19: "WRC",
    20: "JWRC",
    21: "WRC2",
    22: "Rally3",
    23: "WRC 12-16"
  }

  window.LocIdsBySurface = {
    "Loose": [14, 13, 24, 27, 12, 31, 8, 7, 9, 18, 26, 15, 30, 6],
    "Asphalt": [29, 16, 25, 28, 5, 17]
  }

  window.LocNameByLocID = {
    5: "Mediterraneo",
    6: "Portugal",
    7: "Italia",
    8: "Estonia",
    9: "Scandia",
    12: "Mexico",
    13: "Chile",
    14: "Pacifico",
    15: "Finland",
    16: "Croatia",
    17: "Monte-Carlo",
    18: "Sweden",
    24: "Greece",
    25: "Japan",
    26: "Kenya",
    27: "Oceana",
    28: "Iberia",
    29: "Central Europe",
    30: "Latvia",
    31: "Poland",
  }

  window.CLASS_LUT = [
    { id: "Group B (RWD)", shortName: "GpB RWD", drivetrain: "RWD" },
    { id: "H3 (RWD)", shortName: "H3", drivetrain: "RWD" },
    { id: "H2 (RWD)", shortName: "H2", drivetrain: "RWD" },
    { id: "WRC", shortName: "WRC", drivetrain: "4WD" },
    { id: "WRC2", shortName: "WRC2", drivetrain: "4WD" },
    { id: "JWRC", shortName: "JWRC", drivetrain: "4WD" },
    { id: "World Rally Car 2017 - 2021", shortName: "WRC 17-21", drivetrain: "4WD" },
    { id: "World Rally Car 2012 - 2016", shortName: "WRC 12-16", drivetrain: "4WD" },
    { id: "World Rally Car 1997 - 2011", shortName: "WRC 97-11", drivetrain: "4WD" },
    { id: "Rally2", shortName: "Rally2", drivetrain: "4WD" },
    { id: "Rally3", shortName: "Rally3", drivetrain: "4WD" },
    { id: "NR4/R4", shortName: "NR4/R4", drivetrain: "4WD" },
    { id: "S2000", shortName: "S2000", drivetrain: "4WD" },
    { id: "Group A", shortName: "Grp A", drivetrain: "4WD" },
    { id: "Group B (4WD)", shortName: "GpB 4WD", drivetrain: "4WD" },
    { id: "Rally4", shortName: "Rally4", drivetrain: "FWD" },
    { id: "S1600", shortName: "S1600", drivetrain: "FWD" },
    { id: "F2 Kit Car", shortName: "F2", drivetrain: "FWD" },
    { id: "H2 (FWD)", shortName: "H2 FWD", drivetrain: "FWD" },
    { id: "H1 (FWD)", shortName: "H1", drivetrain: "FWD" },
  ];
})();
