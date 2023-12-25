import { defaultBaseStatistic } from "./../api/statistic";
import { calcObjectFields, removeZeroFields } from "../../utils/objects";
import { $booksHashMap, mapBooksByCategory, BooksCategories } from "../books";
import { BaseStatistic, BaseStatisticItem, getStatisticDateKeys } from "../api/statistic";
import { HolderTransferDoc } from "../api/holderTransfer";

export const calcHolderStat = (
  prev: BaseStatistic | undefined,
  operator: "+" | "-",
  transfer: HolderTransferDoc
) => {
  const { year, month, quarter } = getStatisticDateKeys(transfer.date);

  const prevCopy = { ...prev };
  const transferStat = getBaseStat(transfer);

  // Берем каждый переиод и имеющуюся в нем статистику складываем с новой из операции
  prevCopy[year] = removeZeroFields(calcObjectFields(transferStat, operator, prevCopy[year]));
  prevCopy[month] = removeZeroFields(calcObjectFields(transferStat, operator, prevCopy[month]));
  prevCopy[quarter] = removeZeroFields(calcObjectFields(transferStat, operator, prevCopy[quarter]));

  return prevCopy;
};

export const getBaseStat = (transfer: HolderTransferDoc): BaseStatisticItem => {
  const statistic = { ...defaultBaseStatistic };
  const booksHashMap = $booksHashMap.getState();

  Object.entries(transfer.books).forEach(([id, count]) => {
    if (count) {
      const category = booksHashMap[id as string].category as BooksCategories;
      const key = mapBooksByCategory[category].shortTitle;
      statistic[key] += count;
    }
  });

  return statistic;
};
