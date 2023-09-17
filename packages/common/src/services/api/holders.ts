import { useDocumentData } from "react-firebase-hooks/firestore";
import { addDoc, updateDoc } from "firebase/firestore";
import { apiRefs } from "./refs";
import { usePreloadedData } from "../../utils/memo/usePreloadedData";

export type BookCount = number;

export enum HolderType {
  stock = "stock",
  distributor = "distributor",
}

export type HolderDoc = {
  type: HolderType;
  creatorId: string; // id текущего пользователя (в форме не отображаем)
  name: string; // название склада - в форме отображаем (не обязательное)
  locationId: string; // местоположение склада - в форме это locationSelect (обязательное)
  books?: Record<string, BookCount>; // по умолчанию это пустой объект {}, в этой задаче его не наполняем
};

export const addHolder = async (data: HolderDoc) => {
  return addDoc(apiRefs.holders, data);
};

export const updateHolder = async (id: string, data: Partial<HolderDoc>) => {
  return updateDoc(apiRefs.holder(id), data);
};

export const useHolder = (userId?: string) => {
  const [holderDocData, holderDocLoading] = useDocumentData<HolderDoc>(
    userId ? apiRefs.holder(userId) : null
  );

  const holder = usePreloadedData(holderDocData, holderDocLoading);

  return {
    holder: holder,
    loading: holderDocLoading,
  };
};
