import type { Moment } from "moment";

import { DistributedBook } from "../../../services/api/operations";
import { $booksHashMap } from "common/src/services/books";

export type ReportFormValues = Record<number, number> & {
  locationId: string;
  date: Moment;
  userId?: string;
};

export const calcBooksCountsFromValues = (formValues: ReportFormValues) => {
  const { locationId, date, userId, ...bookIdsWithCounts } = formValues;

  const booksHashMap = $booksHashMap.getState();
  let totalCount = 0;
  let totalPoints = 0;
  const operationBooks = Object.entries(bookIdsWithCounts).reduce((acc, [id, count]) => {
    if (count) {
      totalCount += count;
      totalPoints += (Number(booksHashMap[id]?.points) || 0) * count;
      acc.push({ bookId: Number(id), count });
    }
    return acc;
  }, [] as DistributedBook[]);
  // const operationBooks = [] as DistributedBook[];
  return { operationBooks, totalCount, totalPoints };
};

export const calcFormValuesFromBooks = (books: DistributedBook[]) => {
  return books.reduce((acc, book) => {
    acc[book.bookId] = book.count;

    return acc;
  }, {} as Record<number, number>);
};
