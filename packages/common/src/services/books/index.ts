import { useEffect } from "react";
import { Sheet } from "use-google-sheets/dist/types";
import { createStore, createEvent } from "effector";
import useGoogleSheets from "use-google-sheets";

export enum BooksCategories {
  small = "small",
  medium = "medium",
  big = "big",
  mahaBig = "maha_big",
  other = "other",
}

const mapBooksByCategory = {
  [BooksCategories.small]: { shortTitle: "S" },
  [BooksCategories.medium]: { shortTitle: "M" },
  [BooksCategories.big]: { shortTitle: "B" },
  [BooksCategories.mahaBig]: { shortTitle: "MB" },
  [BooksCategories.other]: { shortTitle: "O" },
};

export type Book = {
  id: string;
  name: string;
  short_name: string;
  category: string;
  points?: string;
};

export type BooksHashMap = Record<string, Book>;

export const getBooks = (data: Sheet[]) => {
  if (!data[0]) {
    return [];
  }
  return data[0].data as Book[];
};

export const getBooksHashMap = (books: Book[]) => {
  return books.reduce((acc, book) => {
    acc[book.id] = book;
    return acc;
  }, {} as BooksHashMap);
};

export const getBookPointsMap = (books: Book[]): Record<string, number> => {
  return books.reduce((acc, book) => {
    acc[book.id] = book.points ? Number(book.points) : 0;
    return acc;
  }, {} as Record<string, number>);
};

export const booksChanged = createEvent<Book[]>();
export const booksLoadingChanged = createEvent<boolean>();
export const $books = createStore<Book[]>([]);
export const $booksLoading = createStore<boolean>(true);
export const $booksHashMap = $books.map((books) => getBooksHashMap(books));
export const $booksPointsMap = $books.map((books) => getBookPointsMap(books));

$books.on(booksChanged, (_state, books) => books);
$booksLoading.on(booksLoadingChanged, (_state, loading) => loading);

export const useBooks = () => {
  const { data, loading } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
  });

  useEffect(() => {
    booksChanged(getBooks(data));
    booksLoadingChanged(loading);
  }, [data, loading]);
};
