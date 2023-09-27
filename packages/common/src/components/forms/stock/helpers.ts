import type { Moment } from "moment";

import { DistributedBook } from "../../../services/api/operations";
import { $books } from "common/src/services/books";
import { HolderBooks, HolderTransferType } from "../../../services/api/holderTransfer";

export type StockFormValues = Record<number, number> & {
  transferType: HolderTransferType;
  date: Moment;
};

export type DistributorTransferFormValues = Record<number, number> & {
  transferType: HolderTransferType;
  date: Moment;
};

export type StockDistributorFormValues = {
  name: string;
};

export const calcBooksCountsFromValues = (formValues: StockFormValues) => {
  const { transferType, date, ...bookIdsWithCounts } = formValues;

  return calcBooksCounts(bookIdsWithCounts);
};

export const calcBooksCounts = (bookIdsWithCounts: Record<number, number>) => {
  const books = $books.getState();
  let totalCount = 0;
  let totalPoints = 0;
  const operationBooks = Object.entries(bookIdsWithCounts).reduce((acc, [id, count]) => {
    if (count) {
      totalCount += count;
      totalPoints += (Number(books.find((book) => book.id === id)?.points) || 0) * count;
      acc[id] = count;
    }
    return acc;
  }, {} as HolderBooks);

  return { operationBooks, totalCount, totalPoints };
};

export const calcFormValuesFromBooks = (books: DistributedBook[]) => {
  return books.reduce((acc, book) => {
    acc[book.bookId] = book.count;

    return acc;
  }, {} as Record<number, number>);
};
