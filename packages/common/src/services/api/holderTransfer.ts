import { useEffect } from "react";
import { createStore } from "effector";
import { createEvent } from "effector";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { addDoc, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import {
  SearchOutlined,
  GiftOutlined,
  LoginOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  RedoOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  DollarOutlined,
} from "@ant-design/icons";

import { WithId, apiRefs } from "./refs";
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

export const StatisticHolderTransferTypes = [HolderTransferType.report, HolderTransferType.sale];

export const HolderTransferMap = {
  [HolderTransferType.bbtIncome]: { title: "Приход из ББТ", icon: LoginOutlined, description: "" },
  [HolderTransferType.adjustment]: {
    title: "Корректировка",
    icon: QuestionCircleOutlined,
    description: "",
  },
  [HolderTransferType.move]: { title: "Перемещение", icon: LogoutOutlined, description: "" },
  [HolderTransferType.donations]: { title: "Пожертвования", icon: GiftOutlined, description: "" },
  [HolderTransferType.found]: { title: "Нашли", icon: SearchOutlined, description: "" },

  [HolderTransferType.return]: {
    title: "Возврат",
    icon: RedoOutlined,
    description:
      "Возврат выданных ранее книг под распространение - снимает с баланса санкиртанщика и добавляет на склад",
  },
  [HolderTransferType.installments]: {
    title: "Выдача в рассрочку",
    icon: SolutionOutlined,
    description: "Выдать под распространение - позже получившему за них нужно будет отчитаться",
  },
  [HolderTransferType.sale]: {
    title: "Продажа",
    icon: DollarOutlined,
    description: "Выдать и сразу рассчитаться - книги сразу считаются как распространенные",
  },
  [HolderTransferType.report]: {
    title: "Отчет",
    icon: CheckCircleOutlined,
    description:
      "Принять отчет по выданным ранее книгам - снимает с баланса санкиртанщика и добавляет в распространенные",
  },
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

export const holderTransferChanged = createEvent<WithId<HolderTransferDoc>[]>();
export const $holderTransfers = createStore<WithId<HolderTransferDoc>[]>([]);

$holderTransfers.on(holderTransferChanged, (_state, distributors) => distributors);

export const useHolderTransfers = (params: UseHolderTransfersParams | null) => {
  const { userId } = params || {};

  const [holderTransfersDocData, holderTransfersDocLoading] = useCollectionData<
    WithId<HolderTransferDoc>
  >(userId ? query(apiRefs.holderTransfers, where("userId", "==", userId)) : null);

  const holderTransfers = usePreloadedData(holderTransfersDocData, holderTransfersDocLoading);

  useEffect(() => {
    holderTransferChanged(holderTransfers || []);
  }, [holderTransfers]);

  return {
    holderTransfers: holderTransfers || [],
    loading: holderTransfersDocLoading,
  };
};
