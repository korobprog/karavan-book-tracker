import moment from "moment";
import { message } from "antd";
import { DistributedBook } from "../api/operations";
import { BooksHashMap } from "../books";
import { UserDoc } from "../api/useUser";

type ShareOperation = {
  total: number;
  date: string;
  locationName: string;
  isOnline?: boolean;
  books: DistributedBook[];
  profile: UserDoc;
  booksHashMap: BooksHashMap;
};

export const shareOperation = async (params: ShareOperation) => {
  const { isOnline, total, date, books, profile, booksHashMap, locationName } = params;

  const formattedDate = moment(date).format("DD.MM.yyyy");
  const name = profile.nameSpiritual || profile.name;

  const booksWithPoints = books.filter((book) => booksHashMap[book.bookId]?.points !== undefined);

  const booksWithoutPoints = books.filter(
    (book) => booksHashMap[book.bookId]?.points === undefined
  );

  let sumWithoutPoints = 0;
  for (let book of booksWithoutPoints) {
    sumWithoutPoints += book.count;
  }

  const getBookStrings = () =>
    booksWithPoints
      .map((book) => `${booksHashMap[book.bookId]?.short_name} ${book.count}`)
      .join(`\n`);

  const title = "Отправить статистику";
  const other = `${sumWithoutPoints > 0 ? `\nДругие: ${sumWithoutPoints}` : ""}`;
  const text = `
${name}
${locationName}
${formattedDate}

${getBookStrings()}${other}

Итого${isOnline ? " (онлайн)" : ""}: ${total}
`;
  console.log(text);
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
    } else {
      message.info("Делиться статистикой пока можно только с мобильного");
    }
  } catch (err) {}
};
