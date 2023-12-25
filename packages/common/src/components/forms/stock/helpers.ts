import { roundPrice } from "common/src/utils/numbers";
import type { Moment } from "moment";

import { DistributedBook } from "../../../services/api/operations";
import { $books } from "common/src/services/books";
import { HolderBooks, HolderTransferType } from "../../../services/api/holderTransfer";
import { HolderBookPrices, HolderStockDoc } from "../../../services/api/holders";

export type StockFormValues = Record<number, number> & {
  transferType: HolderTransferType;
  date: Moment;
  priceMultiplier: number;
  comment?: string;
};

export type DistributorTransferFormValues = Record<number, number> & {
  transferType: HolderTransferType;
  date: Moment;
  priceMultiplier: number;
};

export type DistributorTransferReportByMoneyFormValues = Record<number, number> & {
  date: Moment;
  priceMultiplier: number;
};

export type StockDistributorFormValues = {
  name: string;
};

export type CountEntrise = [string, number][];

export const PRICE_PREFIX = "_price";

export const calcBooksCountsFromValues = (formValues: StockFormValues) => {
  const { transferType, date, priceMultiplier, ...otherFieldValues } = formValues;
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

export const calcTotalPrice = (
  operationBooks: HolderBooks,
  bookPrices: HolderBookPrices,
  priceMultiplier: number
) => {
  let totalPrice = 0;
  for (const key in operationBooks) {
    const currentBookPrice = roundPrice(priceMultiplier * bookPrices[key]);
    const currentBookTotalPrice = operationBooks[key] * currentBookPrice;
    if (currentBookTotalPrice) {
      totalPrice += currentBookTotalPrice;
    }
  }

  return totalPrice;
};

export const calcBooksCounts = (bookIdsWithCounts: CountEntrise) => {
  // export const calcBooksCounts = (bookIdsWithCounts: Record<number, number> = {}) => {
  const books = $books.getState();
  let totalCount = 0;
  let totalPoints = 0;
  const operationBooks = bookIdsWithCounts.reduce((acc, [id, count]) => {
    if (Number(count)) {
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

export const calcTotalBooksAndSum = (stock: HolderStockDoc, distributorId: string) => {
  const stockDistributor = stock?.distributors?.[distributorId];
  const books = stockDistributor?.books || {};
  const booksCounts = calcBooksCounts(Object.entries(books));
  const { totalCount = 0 } = booksCounts || {};

  const { bookPrices = {}, priceMultiplier = 1 } = stock || {};
  const distributorPriceMultiplier = stockDistributor?.priceMultiplier || priceMultiplier;
  const totalPrice = calcTotalPrice(books, bookPrices, distributorPriceMultiplier);

  return { totalCount, totalPrice };
};

export const findBooksForSum = (
  availableBooks: Record<string, number>,
  bookPrices: Record<string, number>,
  reportSum: number,
  priceMultiplier: number
) => {
  const selectedBooks: Record<string, number> = {};
  let remainingSum = reportSum;

  const sortedBooks = Object.keys(availableBooks).sort((a, b) => bookPrices[a] - bookPrices[b]);

  for (const bookId of sortedBooks) {
    const price = bookPrices[bookId] * priceMultiplier;
    const availableCount = availableBooks[bookId] || 0;

    const maxBooks = Math.min(Math.floor(remainingSum / price), availableCount);
    if (price && maxBooks) {
      selectedBooks[bookId] = maxBooks;
      remainingSum -= maxBooks * price;
    }
  }

  return { selectedBooks, remainingSum };
};
