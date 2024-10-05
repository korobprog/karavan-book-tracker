import { BookDoc } from "../../../services/api/books";

export type BookFormValues = Omit<BookDoc, "id">;
