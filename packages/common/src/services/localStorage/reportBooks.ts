import { DistributedBook } from "../api/operations";
import * as storage from "./localStorage";

const booksKey = "trackerReportBooks";

export const setReportBooks = (books: DistributedBook[]) => {
  storage.local.setItem(booksKey, JSON.stringify(books));
};

export const getReportBooks = () => {
  const loc = storage.local.getItem(booksKey);
  const books: DistributedBook[] = loc ? JSON.parse(loc) : [];
  return books;
};

const showOnliFirstBooksKey = "showOnliFirstBooks";

export const setShowOnliFirstBooks = (flag: boolean) => {
  storage.local.setItem(showOnliFirstBooksKey, String(flag));
};

export const getShowOnliFirstBooks = () => {
  const stringValue = storage.local.getItem(showOnliFirstBooksKey);
  return stringValue ? stringValue === "true" : true;
};

const locationKey = "reportLocation";

export const setLocationId = (locationId: string) => {
  storage.local.setItem(locationKey, locationId);
};

export const getLocationId = () => {
  return storage.local.getItem(locationKey);
};
