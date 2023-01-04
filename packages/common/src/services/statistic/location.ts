import moment from "moment";
import { calcObjectFields } from "../../utils/objects";
import {
  defaultYearLocationStatistic,
  LocationDoc,
  LocationsStatisticType,
} from "../api/locations";
import { DistributedBook, OperationDoc } from "../api/operations";
import { $booksPointsMap } from "../books";

export const getBookCountsMap = (books?: DistributedBook[]): Record<string, number> => {
  return (
    books?.reduce((acc, book) => {
      acc[book.bookId] = book.count ? Number(book.count) : 0;
      return acc;
    }, {} as Record<string, number>) || {}
  );
};

export const calcLocationStat = (
  prev: LocationDoc["statistic"],
  operator: "+" | "-",
  operation: OperationDoc
) => {
  const operationYear = moment(operation.date).year();
  const prevLocationStat = prev || {};
  const prevLocationYearStat = prevLocationStat?.[operationYear] || defaultYearLocationStatistic;
  const operationStat = getLocationStat(operation);
  const newLocationStat = { ...prevLocationStat };

  newLocationStat[operationYear] = calcObjectFields(prevLocationYearStat, operator, operationStat);
  return newLocationStat;
};

export const getLocationStat = (operation: OperationDoc): LocationsStatisticType => {
  if (operation.isWithoutBookInformation) {
    const { totalCount = 0, totalPoints = 0, isOnline } = operation;

    return {
      totalPrimaryCount: isOnline ? 0 : totalCount,
      totalPoints: isOnline ? 0 : totalPoints,
      totalOnlineCount: isOnline ? totalCount : 0,
      totalOnlinePoints: isOnline ? totalPoints : 0,
      totalOtherCount: 0,
    };
  }

  const statistic = { ...defaultYearLocationStatistic };
  const bookCountsMap = getBookCountsMap(operation.books);
  const bookPointsMap = $booksPointsMap.getState();

  Object.entries(bookCountsMap).forEach(([id, count]) => {
    if (count) {
      statistic.totalPoints += bookPointsMap[id] * count;
      if (bookPointsMap[id] === 0) {
        statistic.totalOtherCount += count;
      } else {
        statistic.totalPrimaryCount += count;
      }
      if (operation.isOnline) {
        statistic.totalOnlineCount += count;
        statistic.totalOnlinePoints += bookPointsMap[id] * count;
      }
    }
  });

  return statistic;
};
