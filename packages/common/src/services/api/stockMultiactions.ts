import { $distributors, $stock } from "common/src/services/api/holders";
import { HolderTransferDoc, HolderTransferType, addHolderTransfer } from "./holderTransfer";
import { updateHolder } from "./holders";
import { calcObjectFields } from "../../utils/objects";
import { calcHolderStat } from "../statistic/holder";

const getDistributor = (id?: string | null) => {
  const distributors = $distributors.getState();
  const distributor = distributors.find((value) => value.id === id);
  const distributorPath = `distributors.${distributor?.id}`;

  return { distributor, distributorPath };
};

export const addHolderTransferMultiAction = async (newHolderTransfer: HolderTransferDoc) => {
  try {
    const stock = $stock.getState();
    const { books, fromHolderId, toHolderId } = newHolderTransfer;

    if (!stock) {
      return console.error("holder not found");
    }

    switch (newHolderTransfer.type) {
      // Приход, Корректировка, Найденные, Пожертвования
      case HolderTransferType.bbtIncome:
      case HolderTransferType.adjustment:
      case HolderTransferType.found:
      case HolderTransferType.donations: {
        return Promise.all([
          updateHolder(stock.id, { books: calcObjectFields(stock.books, "+", books) }),
          addHolderTransfer(newHolderTransfer),
        ]);
      }

      // Выдача в рассрочку
      case HolderTransferType.installments: {
        const { distributor, distributorPath } = getDistributor(toHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        return Promise.all([
          addHolderTransfer(newHolderTransfer),
          updateHolder(stock.id, {
            books: calcObjectFields(stock.books, "-", books),
            [`${distributorPath}.books`]: calcObjectFields(
              stock.distributors?.[distributor.id].books,
              "+",
              books
            ),
          }),
          updateHolder(distributor.id, { books: calcObjectFields(distributor.books, "+", books) }),
        ]);
      }

      // Продажа
      case HolderTransferType.sale: {
        const { distributor, distributorPath } = getDistributor(toHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        // TODO: Учитывать в статистике распростроненных
        return Promise.all([
          updateHolder(stock.id, {
            books: calcObjectFields(stock.books, "-", books),
            [distributorPath]: {
              statistic: calcHolderStat(
                stock.distributors?.[distributor.id].statistic,
                "+",
                newHolderTransfer
              ),
            },
          }),
          updateHolder(distributor.id, {
            books: calcObjectFields(distributor.books, "+", books),
            // statistic: calcHolderStat(distributor.statistic, "+", newHolderTransfer),
          }),
          addHolderTransfer(newHolderTransfer),
        ]);
      }

      // Возврат
      case HolderTransferType.return: {
        const { distributor, distributorPath } = getDistributor(fromHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        return Promise.all([
          addHolderTransfer(newHolderTransfer),
          updateHolder(stock.id, {
            books: calcObjectFields(stock.books, "+", books),
            [`${distributorPath}.books`]: calcObjectFields(
              stock.distributors?.[distributor.id].books,
              "-",
              books
            ),
          }),
          updateHolder(distributor.id, { books: calcObjectFields(distributor.books, "-", books) }),
        ]);
      }

      // Принять отчет и платеж по выданным ранее книгам
      case HolderTransferType.report: {
        const { distributor, distributorPath } = getDistributor(fromHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        // TODO: Учитывать в статистике распростроненных
        return Promise.all([
          addHolderTransfer(newHolderTransfer),
          updateHolder(stock.id, {
            [distributorPath]: {
              books: calcObjectFields(stock.distributors?.[distributor.id].books, "-", books),
              statistic: calcHolderStat(
                stock.distributors?.[distributor.id].statistic,
                "+",
                newHolderTransfer
              ),
            },
          }),
        ]);
      }
    }

    console.log("MultiAction successfully committed!");
  } catch (e) {
    console.log("MultiAction failed: ", e);
  }
};
