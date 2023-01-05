import moment from "moment";
import { getLocationStat } from "../statistic";
import { getOperations } from "../api/operations";
import { defaultYearLocationStatistic, LocationDoc, updateLocation } from "../api/locations";
import { calcObjectFields } from "../../utils/objects";
import { nowYear } from "../year";

const editLocationStatistic = (locationId: string, statistic: LocationDoc["statistic"]) => {
  return updateLocation(locationId, { statistic });
};

export const recalculateStatisticToLocations = async (locations: LocationDoc[]) => {
  try {
    const operationsSnapshot = await getOperations();
    const locationsIdsWithoutStatsMap = new Set(locations.map((loc) => loc.id));

    const statsByLocations = {} as Record<string, LocationDoc["statistic"]>;

    // Из операций формируем map статистики по локациям
    operationsSnapshot.forEach((doc) => {
      const operation = doc.data();
      const { locationId } = operation;
      const operationYear = moment(operation.date).year();

      if (locationId) {
        const newOperationStat = getLocationStat(operation);

        const prevStat = statsByLocations[locationId];
        const newStat = { ...prevStat };
        const prevStatYear = prevStat?.[operationYear] || defaultYearLocationStatistic;
        const newStatYear = calcObjectFields(prevStatYear, "+", newOperationStat);

        newStat[operationYear] = newStatYear;
        statsByLocations[locationId] = newStat;
      }
    });

    // Переписываем статистику в локациях, где были операции
    const promises = Object.keys(statsByLocations).map(async (locationId) => {
      const newStatistic = statsByLocations[locationId];
      locationsIdsWithoutStatsMap.delete(locationId);
      return editLocationStatistic(locationId, newStatistic);
    });

    // Где не было операций - затираем имеющиеся значения
    locationsIdsWithoutStatsMap.forEach(async (locationId) => {
      if (locationId) {
        const promise = editLocationStatistic(locationId, {
          [nowYear]: defaultYearLocationStatistic,
        });
        promises.push(promise);
      }
    });

    await Promise.all(promises);
  } catch (e) {
    console.error(e);
  }
};
