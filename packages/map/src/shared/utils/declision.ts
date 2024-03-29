export const declension = (count: number, variants: string[]) =>
  variants[
    ((count %= 100), 20 > count && count > 4)
      ? 2
      : [2, 0, 1, 1, 1, 2][((count %= 10), count < 5) ? count : 5]
  ];

export const BOOK_DECLENSIONS = ["книга", "книги", "книг"];
