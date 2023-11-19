import type { Moment } from "moment";

import { DistributedBook } from "../../../services/api/operations";
import { $books } from "common/src/services/books";
import { HolderBooks, HolderTransferType } from "../../../services/api/holderTransfer";
import { HolderBookPrices } from "../../../services/api/holders";

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

export type CountEntrise = [string, number][];

export const PRICE_PREFIX = "price";

export const calcBooksCountsFromValues = (formValues: StockFormValues) => {
  const { transferType, date, ...otherFieldValues } = formValues;
  const bookIdsWithCounts = [] as CountEntrise;
  const bookPrices = {} as HolderBookPrices;
  for (const key in otherFieldValues) {
    if (!Number.isNaN(Number(key))) {
      bookIdsWithCounts.push([key, otherFieldValues[key]]);
    } else {
      const [prefix, id] = key.split("-");
      if (prefix === PRICE_PREFIX && !Number.isNaN(Number(id)) && otherFieldValues[key]) {
        bookPrices[id] = otherFieldValues[key];
      }
    }
  }

  const booksCounts = calcBooksCounts(bookIdsWithCounts);

  return { ...booksCounts, bookPrices };
};

export const calcBooksCounts = (bookIdsWithCounts: CountEntrise) => {
  const books = $books.getState();
  let totalCount = 0;
  let totalPoints = 0;
  const operationBooks = bookIdsWithCounts.reduce((acc, [id, count]) => {
    if (count) {
      totalCount += count;
      totalPoints += (Number(books.find((book) => book.id === id)?.points) || 0) * count;
      acc[id] = count;
    }
    return acc;
  }, {} as HolderBooks);

  return { operationBooks, totalCount, totalPoints, length: bookIdsWithCounts.length };
};

export const calcFormValuesFromBooks = (books: DistributedBook[]) => {
  return books.reduce((acc, book) => {
    acc[book.bookId] = book.count;

    return acc;
  }, {} as Record<number, number>);
};

export const addPrefixToKeys = (obj: Record<string, number>, prefix: string) => {
  const newObj = {} as Record<string, number>;
  for (const key in obj) {
    const newKey = `${prefix}${key}`;
    newObj[newKey] = obj[key];
  }

  return newObj;
};
