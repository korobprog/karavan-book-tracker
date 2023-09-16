import { addDoc, updateDoc } from "firebase/firestore";
import bookId from "./operations";
import { apiRefs } from "./refs";

export type stock = {
  creatorId: string; // id текущего пользователя (в форме не отображаем)
  name: string; // название склада - в форме отображаем (не обязательное)
  locationId: string; // местоположение склада - в форме это locationSelect (обязательное)
  books: Record<string, { count: number; price: number }>; // по умолчанию это пустой объект {}, в этой задаче его не наполняем
};

export const addHolder = async (data: stock) => {
  addDoc(apiRefs.locations, data);
};

export const updateHolder = async (id: string, data: Partial<stock>) => {
  updateDoc(apiRefs.location(id), data);
};
