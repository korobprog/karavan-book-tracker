export const declension = (count: number, variants: string[]) =>
  variants[
    ((count %= 100), 20 > count && count > 4)
      ? 2
      : [2, 0, 1, 1, 1, 2][((count %= 10), count < 5) ? count : 5]
  ];

export const BOOK_DECLENSIONS = ["книга", "книги", "книг"];
export const getBookDeclensions = (count: number) => declension(count, BOOK_DECLENSIONS);

export const DENOMINATION_DECLENSIONS = ["наименование", "наименования", "наименований"];
export const getDenominationDeclensions = (count: number) =>
  declension(count, DENOMINATION_DECLENSIONS);

export const TYPE_DECLENSIONS = ["вида", "видов", "видов"];
export const getTypeDeclensions = (count: number) => declension(count, TYPE_DECLENSIONS);
