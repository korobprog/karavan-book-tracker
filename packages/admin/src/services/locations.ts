import {
  calculateOperationStatistic,
  getBookCountsMap,
  statsInitial,
  sumOperationStatistic,
} from "./statistic";
import { getOperations, OperationDoc } from "../firebase/useOperations";
import {
  editLocation,
  LocationDoc,
  LocationsStatisticType,
} from "../firebase/useLocations";

// TODO: get from operation date
const CHANGED_YEAR = 2022;

const getLocationWithoutId = (locationId: string, locations: LocationDoc[]) => {
  const currentLocationWithId = locations.find(
    (location) => location.id === locationId
  );

  if (currentLocationWithId) {
    const { id: _omitKey, ...newLocation } = currentLocationWithId;
    return newLocation;
  }

  return null;
};

const editLocationStatistic = (
  locationId: string,
  newLocation: LocationDoc | null,
  newStatisticYearData: LocationsStatisticType
) => {
  if (!newLocation) {
    return Promise.resolve();
  }

  const statistic = newStatisticYearData
    ? {
        ...(newLocation.statistic || {}),
        [CHANGED_YEAR]: newStatisticYearData,
      }
    : undefined;

  return editLocation(locationId, { ...newLocation, statistic });
};

export const recalculateStatisticToLocations = async (
  bookPointsMap: Record<string, number>,
  locations: LocationDoc[]
) => {
  try {
    const operationsSnapshot = await getOperations();
    const locationsIdsWithoutStatsMap = new Set(locations.map((loc) => loc.id));

    const statsByLocations = {} as Record<string, LocationsStatisticType>;

    operationsSnapshot.forEach((doc) => {
      const operation = doc.data();

      if (operation.locationId) {
        const newOperationStat = calculateOperationStatistic(
          getBookCountsMap(operation.books),
          bookPointsMap,
          operation.isOnline
        );

        const prevStat = statsByLocations[operation.locationId] || statsInitial;
        statsByLocations[operation.locationId] = sumOperationStatistic(
          prevStat,
          newOperationStat
        );
      }
    });

    const promises = Object.keys(statsByLocations).map(async (locationId) => {
      const newStatisticYearData = statsByLocations[locationId];
      const location = getLocationWithoutId(locationId, locations);
      locationsIdsWithoutStatsMap.delete(locationId);

      return editLocationStatistic(locationId, location, newStatisticYearData);
    });

    locationsIdsWithoutStatsMap.forEach(async (locationId) => {
      if (locationId) {
        const location = getLocationWithoutId(locationId, locations);
        const promise = editLocationStatistic(locationId, location, statsInitial);
        promises.push(promise);
      }
    });

    await Promise.all(promises);
  } catch (e) {
    console.error(e);
  }
};

export const addOperationToLocationStatistic = async (
  operation: OperationDoc,
  bookPointsMap: Record<string, number>,
  locations: LocationDoc[]
) => {
  const { locationId, isOnline, isAuthorized } = operation;
  if (!isAuthorized) {
    return;
  }

  const newStatisticYearData = calculateOperationStatistic(
    getBookCountsMap(operation.books),
    bookPointsMap,
    isOnline
  );

  const location = getLocationWithoutId(locationId, locations);
  const prevStat = location?.statistic?.[CHANGED_YEAR] || statsInitial;
  const newStatistic = sumOperationStatistic(prevStat, newStatisticYearData);

  editLocationStatistic(locationId, location, newStatistic);
};
