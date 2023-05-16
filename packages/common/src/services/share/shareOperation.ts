import moment from "moment";
import { message } from "antd";
import { DistributedBook } from "../api/operations";
import { BooksHashMap } from "../books";
// import { getBookDeclensions } from "../../utils/declension";
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

  let sum = 0;
  for (let prop in booksWithoutPoints) {
    if (booksWithoutPoints.hasOwnProperty(prop)) {
      sum += booksWithoutPoints[prop].count;
    }
  }

  const getBookStrings = () =>
    booksWithPoints
      .map((book) => `${booksHashMap[book.bookId]?.short_name} ${book.count}`)
      .join(`\n`);

  const title = "Отправить статистику";

  const text = `
${name}
${locationName}
${formattedDate}
${getBookStrings()}

${sum > 0 ? `Другие: ${sum}` : ""}

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
