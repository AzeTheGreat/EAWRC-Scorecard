import { render } from "../app.js"
import { renderMatrixView } from '../views/matrixView.js';

let state = {};
export const getState = () => ({...state});
export function setState(newState) {
  state = newState;
  render();
}

let selectedStat = "percentile";
export const getSelectedStat = () => selectedStat;
export function setSelectedStat(stat) {
  selectedStat = stat;
  renderMatrixView();
}