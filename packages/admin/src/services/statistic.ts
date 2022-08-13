import { LocationsStatisticType } from "../firebase/useLocations";
import { DistributedBook } from "../firebase/useOperations";

export const sumOperationStatistic = (
  prev: LocationsStatisticType,
  next: LocationsStatisticType
): LocationsStatisticType => {
  const result = { ...prev };
  for (const prop in result) {
    const key = prop as keyof LocationsStatisticType;
    result[key] += next[key] || 0;
  }
  return result;
};

export const statsInitial: Readonly<LocationsStatisticType> = {
  totalPoints: 0,
  totalPrimaryCount: 0,
  totalOtherCount: 0,
  totalOnlineCount: 0,
  totalOnlinePoints: 0,
};

export const calculateOperationStatistic = (
  bookCountsMap: Record<number, number>,
  bookPointsMap: Record<string, number>,
  isOnline?: boolean
): LocationsStatisticType => {
  const statistic = { ...statsInitial };
  Object.entries(bookCountsMap).forEach(([id, count]) => {
    if (count) {
      statistic.totalPoints += bookPointsMap[id] * count;
      if (bookPointsMap[id] === 0) {
        statistic.totalOtherCount += count;
      } else {
        statistic.totalPrimaryCount += count;
      }
      if (isOnline) {
        statistic.totalOnlineCount += count;
        statistic.totalOnlinePoints += bookPointsMap[id] * count;
      }
    }
  });

  return statistic;
};

export const getBookCountsMap = (
  books?: DistributedBook[]
): Record<string, number> => {
  return (
    books?.reduce((acc, book) => {
      acc[book.bookId] = book.count ? Number(book.count) : 0;
      return acc;
    }, {} as Record<string, number>) || {}
  );
};
