import { useEffect } from "react";
import { createStore, createEvent } from "effector";
import { useDocumentData, useCollectionData } from "react-firebase-hooks/firestore";
import { addDoc, updateDoc, query, where, documentId } from "firebase/firestore";
import { WithId, apiRefs } from "./refs";
import { usePreloadedData } from "../../utils/memo/usePreloadedData";
import { BaseStatistic } from "./statistic";

export type BookCount = number;
export type HolderBooks = Record<string, BookCount>;
export type StockDistiributor = {
  books: HolderBooks;
  statistic: BaseStatistic;
};
export type DistributorBooks = { id: string; count: BookCount }[];

export type StockDistiributors = Record<string, StockDistiributor>;

export enum HolderType {
  stock = "stock",
  distributor = "distributor",
}

export type HolderDoc = HolderStockDoc | HolderDistributorDoc;
export type HolderStockDoc = {
  id?: string;
  type: HolderType.stock;
  creatorId: string; // id текущего пользователя (в форме не отображаем)
  name: string; // название склада - в форме отображаем (не обязательное)
  locationId: string; // местоположение склада - в форме это locationSelect (обязательное)
  books?: HolderBooks; // по умолчанию это пустой объект {}, в этой задаче его не наполняем
  distributors?: StockDistiributors;
};

export type HolderDistributorDoc = {
  id?: string;
  type: HolderType.distributor;
  userId: string | null;
  creatorId: string; // id текущего пользователя (в форме не отображаем)
  name: string; // название склада - в форме отображаем (не обязательное)
  books?: HolderBooks; // по умолчанию это пустой объект {}, в этой задаче его не наполняем
  // statistic?: BaseStatistic;
};

export const addHolder = async (data: HolderDoc) => {
  return addDoc(apiRefs.holders, data);
};

export const updateHolder = async (id: string, data: Partial<HolderDoc>) => {
  // @ts-ignore
  return updateDoc(apiRefs.holder(id), data);
};

export const updateStockHolder = async (id: string, data: Partial<HolderDoc>) => {
  // @ts-ignore
  return updateDoc(apiRefs.holder(id), data);
};

export const stockChanged = createEvent<WithId<HolderStockDoc> | null>();
export const $stock = createStore<WithId<HolderStockDoc> | null>(null);
export const stockLoadingChanged = createEvent<boolean>();
export const $stockLoading = createStore<boolean>(false);
export const distributorsChanged = createEvent<WithId<HolderDistributorDoc>[]>();
export const $distributors = createStore<WithId<HolderDistributorDoc>[]>([]);

$stock.on(stockChanged, (_state, stock) => stock);
$stockLoading.on(stockLoadingChanged, (_state, loading) => loading);
$distributors.on(distributorsChanged, (_state, distributors) => distributors);

export const useHolders = (holderId?: string) => {
  const [stockDocData, stockDocLoading] = useDocumentData<WithId<HolderStockDoc>>(
    holderId ? apiRefs.stock(holderId) : null
  );
  const stock = usePreloadedData(stockDocData, stockDocLoading);

  const distributorIds = stock?.distributors ? Object.keys(stock.distributors) : [];

  const [distributorDocsData, distributorDocsLoading] = useCollectionData<
    WithId<HolderDistributorDoc>
  >(
    distributorIds.length
      ? query(apiRefs.distributors, where(documentId(), "in", distributorIds))
      : null
  );

  const distributors = usePreloadedData(distributorDocsData, distributorDocsLoading);

  useEffect(() => {
    stockChanged(stock || null);
    stockLoadingChanged(stockDocLoading);
    distributorsChanged(distributors || []);
  }, [stock, distributors, stockDocLoading]);

  return {
    stock,
    stockLoading: stockDocLoading,
    distributors,
    distributorsLoading: distributorDocsLoading,
  };
};
