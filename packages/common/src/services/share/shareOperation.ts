import moment from "moment";
import { message } from "antd";
import { DistributedBook } from "../api/operations";
import { BooksHashMap } from "../books";
import { getBookDeclensions } from "../../utils/declension";
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

  const getBookStrings = () =>
    books.map(
      (book) => `
${booksHashMap[book.bookId]?.name}: ${book.count}`
    );

  const title = "Отправить статистику";
  const bookDeclension = getBookDeclensions(total);

  const text = `
${formattedDate} ${name}
${locationName}
Распространено${isOnline ? ' онлайн' : ''}: ${total} ${bookDeclension}
${getBookStrings()}
`;

  try {
    if (navigator.share) {
      await navigator.share({ title, text });
    } else {
      message.info("Делиться статистикой пока можно только с мобильного");
    }
  } catch (err) {}
};
