import { render } from "../app.js"
import { renderMatrixView } from '../views/matrixView.js';
import { getApiData } from './apiData.js';
import { getFilteredEntries } from '../core/entryFilters.js';
import { getStats, getCompletion } from '../core/calc.js';

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

export function getCurrentEntries() {
  return getFilteredEntries(getApiData()?.entries, getState());
}

export function getCurrentStats(filters = getState()) {
  const entries = getFilteredEntries(getApiData()?.entries, filters);
  return { ...getStats(entries), completion: getCompletion(entries.length, filters) };
}