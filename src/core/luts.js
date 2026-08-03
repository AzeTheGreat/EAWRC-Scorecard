const Drivetrains = {
  "4WD": { name: "4WD", displayOrder: 1 },
  "FWD": { name: "FWD", displayOrder: 2 },
  "RWD": { name: "RWD", displayOrder: 0 },
};

const Classes = {
  1: { name: "H1", drivetrainID: "FWD", displayOrder: 4 },
  2: { name: "H2", drivetrainID: "FWD", displayOrder: 3 },
  3: { name: "H2", drivetrainID: "RWD", displayOrder: 2 },
  4: { name: "H3", drivetrainID: "RWD", displayOrder: 1 },
  5: { name: "Group B", drivetrainID: "RWD", displayOrder: 0 },
  6: { name: "Group B", drivetrainID: "4WD", displayOrder: 11 },
  7: { name: "NR4", drivetrainID: "4WD", displayOrder: 8 },
  8: { name: "Rally4", drivetrainID: "FWD", displayOrder: 0 },
  9: { name: "S1600", drivetrainID: "FWD", displayOrder: 1 },
  10: { name: "S2000", drivetrainID: "4WD", displayOrder: 9 },
  11: { name: "F2 Kit", drivetrainID: "FWD", displayOrder: 2 },
  12: { name: "Group A", drivetrainID: "4WD", displayOrder: 10 },
  13: { name: "WRC 97-11", drivetrainID: "4WD", displayOrder: 5 },
  14: { name: "Rally2", drivetrainID: "4WD", displayOrder: 6 },
  17: { name: "WRC 17-21", drivetrainID: "4WD", displayOrder: 3 },
  19: { name: "WRC", drivetrainID: "4WD", displayOrder: 0 },
  20: { name: "JWRC", drivetrainID: "4WD", displayOrder: 2 },
  21: { name: "WRC2", drivetrainID: "4WD", displayOrder: 1 },
  22: { name: "Rally3", drivetrainID: "4WD", displayOrder: 7 },
  23: { name: "WRC 12-16", drivetrainID: "4WD", displayOrder: 4 },
};

const Surfaces = {
  "Asphalt": { name: "Asphalt", displayOrder: 1 },
  "Loose": { name: "Loose", displayOrder: 0 },
};

const Locations = {
  5: { name: "Mediterraneo", surfaceID: "Asphalt", displayOrder: 4 },
  6: { name: "Portugal", surfaceID: "Loose", displayOrder: 13 },
  7: { name: "Italia", surfaceID: "Loose", displayOrder: 7 },
  8: { name: "Estonia", surfaceID: "Loose", displayOrder: 6 },
  9: { name: "Scandia", surfaceID: "Loose", displayOrder: 8 },
  12: { name: "Mexico", surfaceID: "Loose", displayOrder: 4 },
  13: { name: "Chile", surfaceID: "Loose", displayOrder: 1 },
  14: { name: "Pacifico", surfaceID: "Loose", displayOrder: 0 },
  15: { name: "Finland", surfaceID: "Loose", displayOrder: 11 },
  16: { name: "Croatia", surfaceID: "Asphalt", displayOrder: 1 },
  17: { name: "Monte-Carlo", surfaceID: "Asphalt", displayOrder: 5 },
  18: { name: "Sweden", surfaceID: "Loose", displayOrder: 9 },
  24: { name: "Greece", surfaceID: "Loose", displayOrder: 2 },
  25: { name: "Japan", surfaceID: "Asphalt", displayOrder: 2 },
  26: { name: "Kenya", surfaceID: "Loose", displayOrder: 10 },
  27: { name: "Oceana", surfaceID: "Loose", displayOrder: 3 },
  28: { name: "Iberia", surfaceID: "Asphalt", displayOrder: 3 },
  29: { name: "Central Europe", surfaceID: "Asphalt", displayOrder: 0 },
  30: { name: "Latvia", surfaceID: "Loose", displayOrder: 12 },
  31: { name: "Poland", surfaceID: "Loose", displayOrder: 5 },
};

const Stages = {
  "12-ss1": { name: "Stage 1", locationID: 12 },
  "12-ss2": { name: "Stage 2", locationID: 12 },
  "12-ss3": { name: "Stage 3", locationID: 12 },
  "13-ss1": { name: "Stage 1", locationID: 13 },
  "13-ss2": { name: "Stage 2", locationID: 13 },
  "13-ss3": { name: "Stage 3", locationID: 13 },
  "14-ss1": { name: "Stage 1", locationID: 14 },
  "14-ss2": { name: "Stage 2", locationID: 14 },
  "14-ss3": { name: "Stage 3", locationID: 14 },
  "15-ss1": { name: "Stage 1", locationID: 15 },
  "15-ss2": { name: "Stage 2", locationID: 15 },
  "15-ss3": { name: "Stage 3", locationID: 15 },
  "16-ss1": { name: "Stage 1", locationID: 16 },
  "16-ss2": { name: "Stage 2", locationID: 16 },
  "16-ss3": { name: "Stage 3", locationID: 16 },
  "17-ss1": { name: "Stage 1", locationID: 17 },
  "17-ss2": { name: "Stage 2", locationID: 17 },
  "17-ss3": { name: "Stage 3", locationID: 17 },
  "18-ss1": { name: "Stage 1", locationID: 18 },
  "18-ss2": { name: "Stage 2", locationID: 18 },
  "18-ss3": { name: "Stage 3", locationID: 18 },
  "24-ss1": { name: "Stage 1", locationID: 24 },
  "24-ss2": { name: "Stage 2", locationID: 24 },
  "24-ss3": { name: "Stage 3", locationID: 24 },
  "25-ss1": { name: "Stage 1", locationID: 25 },
  "25-ss2": { name: "Stage 2", locationID: 25 },
  "25-ss3": { name: "Stage 3", locationID: 25 },
  "26-ss1": { name: "Stage 1", locationID: 26 },
  "26-ss2": { name: "Stage 2", locationID: 26 },
  "26-ss3": { name: "Stage 3", locationID: 26 },
  "27-ss1": { name: "Stage 1", locationID: 27 },
  "27-ss2": { name: "Stage 2", locationID: 27 },
  "27-ss3": { name: "Stage 3", locationID: 27 },
  "28-ss1": { name: "Stage 1", locationID: 28 },
  "28-ss2": { name: "Stage 2", locationID: 28 },
  "28-ss3": { name: "Stage 3", locationID: 28 },
  "29-ss1": { name: "Stage 1", locationID: 29 },
  "29-ss2": { name: "Stage 2", locationID: 29 },
  "29-ss3": { name: "Stage 3", locationID: 29 },
  "30-ss1": { name: "Stage 1", locationID: 30 },
  "30-ss2": { name: "Stage 2", locationID: 30 },
  "30-ss3": { name: "Stage 3", locationID: 30 },
  "31-ss1": { name: "Stage 1", locationID: 31 },
  "31-ss2": { name: "Stage 2", locationID: 31 },
  "31-ss3": { name: "Stage 3", locationID: 31 },
  "5-ss1": { name: "Stage 1", locationID: 5 },
  "5-ss2": { name: "Stage 2", locationID: 5 },
  "5-ss3": { name: "Stage 3", locationID: 5 },
  "6-ss1": { name: "Stage 1", locationID: 6 },
  "6-ss2": { name: "Stage 2", locationID: 6 },
  "6-ss3": { name: "Stage 3", locationID: 6 },
  "7-ss1": { name: "Stage 1", locationID: 7 },
  "7-ss2": { name: "Stage 2", locationID: 7 },
  "7-ss3": { name: "Stage 3", locationID: 7 },
  "8-ss1": { name: "Stage 1", locationID: 8 },
  "8-ss2": { name: "Stage 2", locationID: 8 },
  "8-ss3": { name: "Stage 3", locationID: 8 },
  "9-ss1": { name: "Stage 1", locationID: 9 },
  "9-ss2": { name: "Stage 2", locationID: 9 },
  "9-ss3": { name: "Stage 3", locationID: 9 },
};

export const getDrivetrainIds = () =>
  Object.keys(Drivetrains).sort((a, b) => Drivetrains[a].displayOrder - Drivetrains[b].displayOrder);

export const getClassIds = (drivetrainID) =>
  Object.keys(Classes)
    .filter(id => Classes[id].drivetrainID === drivetrainID)
    .sort((a, b) => Classes[a].displayOrder - Classes[b].displayOrder)
    .map(Number);

export const getClassName = (classId) => Classes[classId]?.name;

export const getSurfaceIds = () =>
  Object.keys(Surfaces).sort((a, b) => Surfaces[a].displayOrder - Surfaces[b].displayOrder);

export const getLocationIds = (surfaceID) =>
  Object.keys(Locations)
    .filter(id => Locations[id].surfaceID === surfaceID)
    .sort((a, b) => Locations[a].displayOrder - Locations[b].displayOrder)
    .map(Number);

export const getLocationName = (locationId) => Locations[locationId]?.name;

export const getStageIds = (locationId) =>
  Object.keys(Stages).filter(id => Stages[id].locationID === locationId);

export const getStageName = (stageId) => Stages[stageId]?.name;
