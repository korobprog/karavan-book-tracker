import { Sheet } from "use-google-sheets/dist/types";
import useGoogleSheets from "use-google-sheets";

export type Book = {
  id: string;
  name: string;
  short_name: string;
  category: string;
  points?: string;
};

export const getBooks = (data: Sheet[]) => {
  if (!data[0]) {
    return [];
  }
  return data[0].data as Book[];
};

export const useBooks = () => {
  const { data, loading: booksLoading } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
  });
  return { books: getBooks(data), booksLoading };
};

export const getBookPointsMap = (books: Book[]): Record<string, number> => {
  return books.reduce((acc, book) => {
    acc[book.id] = book.points ? Number(book.points) : 0;
    return acc;
  }, {} as Record<string, number>);
};
