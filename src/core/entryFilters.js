import { ClassIdsByDrivetrain, LocIdsBySurface } from './luts.js';
import { getApiData } from '../state/apiData.js';

function getFilteredEntries(filters) {
  var entries = getApiData()?.entries;
  if (!entries) return [];

  return entries.filter(function(e) {
    return (
      (!filters.class || e.vehicleClassId === filters.class) &&
      (!filters.drivetrain || (ClassIdsByDrivetrain[filters.drivetrain] || []).includes(e.vehicleClassId)) &&
      (!filters.location || e.locationId === filters.location) &&
      (!filters.surface || (LocIdsBySurface[filters.surface] || []).includes(e.locationId)) &&
      (!filters.stage || e.routeId === filters.stage)
    );
  });
}

export { getFilteredEntries };
