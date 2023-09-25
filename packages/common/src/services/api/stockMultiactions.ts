import { $distributors } from "common/src/services/api/holders";
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
    switch (newHolderTransfer.type) {
      // Приход
      case HolderTransferType.bbtIncome: {
        // TODO: Добавлять книги себе на склад
        await addHolderTransfer(newHolderTransfer);
        break;
      }

      // Выдача в рассрочку
      case HolderTransferType.installments: {
        const distributor = getDistributor(newHolderTransfer.toHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        const booksSum = calcObjectFields(distributor?.books || {}, "+", newHolderTransfer.books);

        // TODO: Списать со своего склада
        return Promise.all([
          addHolderTransfer(newHolderTransfer),
          updateHolder(distributor.id, { books: booksSum }),
        ]);
      }

      // Продажа
      case HolderTransferType.sale: {
        // TODO: Списать со своего склада
        // TODO: Учитывать в статистике распростроненных
        return Promise.all([addHolderTransfer(newHolderTransfer)]);
      }

      // Возврат
      case HolderTransferType.return: {
        const distributor = getDistributor(newHolderTransfer.fromHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        const booksSum = calcObjectFields(distributor?.books || {}, "-", newHolderTransfer.books);

        // TODO: В свой склад добавлять
        return Promise.all([
          addHolderTransfer(newHolderTransfer),
          updateHolder(distributor.id, { books: booksSum }),
        ]);
      }

      // Принять отчет и платеж по выданным ранее книгам
      case HolderTransferType.report: {
        const distributor = getDistributor(newHolderTransfer.fromHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        const booksSum = calcObjectFields(distributor.books || {}, "-", newHolderTransfer.books);

        // TODO: В свой склад добавлять
        // TODO: Учитывать в статистике распростроненных
        return Promise.all([
          addHolderTransfer(newHolderTransfer),
          updateHolder(distributor.id, { books: booksSum }),
        ]);
      }
    }

    console.log("MultiAction successfully committed!");
  } catch (e) {
    console.log("MultiAction failed: ", e);
  }
};
