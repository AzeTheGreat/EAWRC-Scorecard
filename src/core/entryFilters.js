import { getClassIds, getLocationIds } from './luts.js';

function getFilteredEntries(entries, filters) {
  if (!entries) return [];

  return entries.filter(function(e) {
    return (
      (!filters.class || e.vehicleClassId === filters.class) &&
      (!filters.drivetrain || getClassIds(filters.drivetrain).includes(e.vehicleClassId)) &&
      (!filters.location || e.locationId === filters.location) &&
      (!filters.surface || getLocationIds(filters.surface).includes(e.locationId)) &&
      (!filters.stage || e.routeId === Number(filters.stage))
    );
  });
}

export { getFilteredEntries };
