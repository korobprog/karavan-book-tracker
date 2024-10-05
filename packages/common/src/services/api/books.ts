import { query, orderBy, where, addDoc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import { apiRefs } from "./refs";
import { useTranslation } from "react-i18next";

export enum BooksCategories {
  other = "other",
  small = "small",
  medium = "medium",
  big = "big",
  mahaBig = "maha_big",
  sbSet = "sb_set",
  ccSet = "cc_set",
}

export const categoryOptions = [
  { value: "other", label: "Other" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "big", label: "Big" },
  { value: "maha_big", label: "Maha Big" },
  { value: "sb_set", label: "Sb Set" },
  { value: "cc_set", label: "Cc Set" },
];

export type BookDoc = {
  id?: string;
  name: string;
  short_name: string;
  lang: string;
  category: BooksCategories;
};

export type BookDocWithId = BookDoc & {
  id: string;
};

const bookLanguages = ["ru", "en", "hi"] as const;

export const useBookLanguages = () => {
  const { t } = useTranslation();
  const bookLangTranslations = {
    en: t("common.book.lang.en"),
    ru: t("common.book.lang.ru"),
    hi: t("common.book.lang.hi"),
  };

  return bookLanguages.map((lang) => ({ value: lang, label: bookLangTranslations[lang] }));
};

export const updateBook = async (id: string, data: Partial<BookDoc>) => {
  updateDoc(apiRefs.book(id), data);
};

export const addBook = async (data: BookDoc) => {
  return addDoc(apiRefs.books, data);
};

export const setBook = async (id: string, data: BookDoc) => {
  return setDoc(apiRefs.book(id), data);
};

export const deleteBook = async (id: string) => {
  return deleteDoc(apiRefs.book(id));
};

export const useBook = (id?: string) => {
  const [bookDocData, loading] = useDocumentData<BookDoc>(id ? apiRefs.book(id) : null);

  return { bookDocData, loading };
};

export const useBooks = (selectedLang?: string) => {
  const [booksDocData, loading] = useCollectionData<BookDocWithId>(
    selectedLang
      ? query(apiRefs.books, where("lang", "==", selectedLang))
      : query(apiRefs.books, orderBy("name", "asc"))
  );

  return { booksDocData, loading };
};
