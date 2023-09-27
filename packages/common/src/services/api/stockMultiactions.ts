import { $distributors, $stock } from "common/src/services/api/holders";
import { HolderTransferDoc, HolderTransferType, addHolderTransfer } from "./holderTransfer";
import { updateHolder } from "./holders";
import { calcObjectFields } from "../../utils/objects";

const getDistributor = (id?: string | null) => {
  const distributors = $distributors.getState();
  const currentDistributor = distributors.find((value) => value.id === id);
  return currentDistributor;
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
        const distributor = getDistributor(toHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        return Promise.all([
          addHolderTransfer(newHolderTransfer),
          updateHolder(stock.id, { books: calcObjectFields(stock.books, "-", books) }),
          updateHolder(distributor.id, { books: calcObjectFields(distributor.books, "+", books) }),
        ]);
      }

      // Продажа
      case HolderTransferType.sale: {
        // TODO: Учитывать в статистике распростроненных
        return Promise.all([
          updateHolder(stock.id, { books: calcObjectFields(stock.books, "-", books) }),
          addHolderTransfer(newHolderTransfer),
        ]);
      }

      // Возврат
      case HolderTransferType.return: {
        const distributor = getDistributor(fromHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        return Promise.all([
          addHolderTransfer(newHolderTransfer),
          updateHolder(stock.id, { books: calcObjectFields(stock.books, "+", books) }),
          updateHolder(distributor.id, { books: calcObjectFields(distributor.books, "-", books) }),
        ]);
      }

      // Принять отчет и платеж по выданным ранее книгам
      case HolderTransferType.report: {
        const distributor = getDistributor(fromHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        // TODO: Учитывать в статистике распростроненных
        return Promise.all([
          addHolderTransfer(newHolderTransfer),
          updateHolder(distributor.id, { books: calcObjectFields(distributor.books, "-", books) }),
        ]);
      }
    }

    console.log("MultiAction successfully committed!");
  } catch (e) {
    console.log("MultiAction failed: ", e);
  }
};
