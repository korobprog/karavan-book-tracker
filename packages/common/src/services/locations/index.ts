import { getLocationStat } from "../statistic";
import { getOperations, OperationDoc } from "../api/operations";
import {
  defaultYearLocationStatistic,
  editLocation,
  LocationDoc,
  LocationsStatisticType,
} from "../api/locations";
import { calcObjectFields } from "../../utils/objects";
import moment from "moment";

// TODO: get from operation date
const CHANGED_YEAR = 2022;

const getLocationWithoutId = (locationId: string, locations: LocationDoc[]) => {
  const currentLocationWithId = locations.find(
    (location) => location.id === locationId
  );

  if (currentLocationWithId) {
    const { id: _omitKey, ...newLocation } = currentLocationWithId;
    return newLocation as LocationDoc;
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
  locations: LocationDoc[]
) => {
  try {
    const operationsSnapshot = await getOperations();
    const locationsIdsWithoutStatsMap = new Set(locations.map((loc) => loc.id));

    const statsByLocations = {} as Record<string, LocationsStatisticType>;

    operationsSnapshot.forEach((doc) => {
      const operation = doc.data();
      const { locationId } = operation;

      if (locationId) {
        const newOperationStat = getLocationStat(operation);

        const prevStat =
          statsByLocations[locationId] || defaultYearLocationStatistic;
        statsByLocations[locationId] = calcObjectFields(
          prevStat,
          "+",
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
        const promise = editLocationStatistic(
          locationId,
          location,
          defaultYearLocationStatistic
        );
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
  locations: LocationDoc[]
) => {
  const { locationId, isAuthorized, date } = operation;
  if (!isAuthorized) {
    return;
  }
  const newStatYearData = getLocationStat(operation);
  const operationYear = moment(date).year();

  const location = getLocationWithoutId(locationId, locations);
  const prevStat =
    location?.statistic?.[operationYear] || defaultYearLocationStatistic;
  const newStat = calcObjectFields(prevStat, "+", newStatYearData);

  editLocationStatistic(locationId, location, newStat);
};
