import { useCollectionData } from "react-firebase-hooks/firestore";
import { addDoc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import {
  SearchOutlined,
  GiftOutlined,
  LoginOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

import { apiRefs } from "./refs";
import { usePreloadedData } from "../../utils/memo/usePreloadedData";

type BookId = string;
type BookCount = number;

export type HolderBooks = Record<BookId, BookCount>;

export enum HolderTransferType {
  // Актуально без distributors
  bbtIncome = "bbt-income",
  adjustment = "adjustment",
  move = "move",
  donations = "donations",
  found = "found",
  // Актуально для distributors
  return = "return",
  installments = "installments",
  sale = "sale",
  report = "report",
}

export const HolderTransferMap = {
  [HolderTransferType.bbtIncome]: { name: "Приход из ББТ", icon: LoginOutlined },
  [HolderTransferType.adjustment]: { name: "Корректировка", icon: QuestionCircleOutlined },
  [HolderTransferType.move]: { name: "Перемещение", icon: LogoutOutlined },
  [HolderTransferType.donations]: { name: "Пожертвования", icon: GiftOutlined },
  [HolderTransferType.found]: { name: "Нашли", icon: SearchOutlined },
  [HolderTransferType.return]: { name: "Возврат", icon: null },
  [HolderTransferType.installments]: { name: "Выдача в рассрочку", icon: null },
  [HolderTransferType.sale]: { name: "Продажа", icon: null },
  [HolderTransferType.report]: { name: "Отчет", icon: null },
};

export type HolderTransferDoc = {
  id?: string;
  type: HolderTransferType;
  date: string;
  userId: string;
  fromHolderId: string | null;
  toHolderId: string | null;
  books: HolderBooks;
};

export type HolderTransferDocWithId = HolderTransferDoc & {
  id: string;
};

export const addHolderTransfer = async (data: HolderTransferDoc) => {
  return addDoc(apiRefs.holderTransfers, data);
};

export const editHolderTransfer = async (id: string, data: HolderTransferDoc) => {
  setDoc(apiRefs.holderTransfer(id), data);
};

export const updateHolderTransfer = async (id: string, data: Partial<HolderTransferDoc>) => {
  updateDoc(apiRefs.holderTransfer(id), data);
};

export const deleteHolderTransfer = async (id: string) => {
  deleteDoc(apiRefs.holderTransfer(id));
};

export type UseHolderTransfersParams = {
  userId: string;
};

export const useHolderTransfers = (params: UseHolderTransfersParams | null) => {
  const { userId } = params || {};

  const [holderTransfersDocData, holderTransfersDocLoading] = useCollectionData<HolderTransferDoc>(
    userId ? query(apiRefs.holderTransfers, where("userId", "==", userId)) : apiRefs.holderTransfers
  );

  const holderTransfers = usePreloadedData(holderTransfersDocData, holderTransfersDocLoading);

  return {
    holderTransfers: holderTransfers || [],
    loading: holderTransfersDocLoading,
  };
};
