import {
  $distributors,
  $stock,
  HolderBookPrices,
  HolderDistributorDoc,
  HolderDoc,
} from "common/src/services/api/holders";
import { HolderTransferDoc, HolderTransferType, addHolderTransfer } from "./holderTransfer";
import { updateHolder } from "./holders";
import { calcObjectFields, removeEmptyFields } from "../../utils/objects";
import { addPrefixToKeys } from "../../components/forms/stock/helpers";
import { WithId } from "./refs";
import { calcHolderStat } from "../statistic/holder";

const getDistributor = (id?: string | null) => {
  const distributors = $distributors.getState();
  const distributor = distributors.find((value) => value.id === id);
  const distributorPath = `distributors.${distributor?.id}`;

  return { distributor, distributorPath };
};

export const addHolderTransferMultiAction = async (
  holderTransfer: HolderTransferDoc,
  bookPricesRaw: HolderBookPrices = {},
  priceMultiplier?: number
) => {
  try {
    const stock = $stock.getState();
    const newHolderTransfer: HolderTransferDoc = removeEmptyFields(holderTransfer);
    const { books, fromHolderId, toHolderId, changedAccount } = newHolderTransfer;

    if (!stock) {
      return console.error("holder not found");
    }

    const bookPrices = addPrefixToKeys(bookPricesRaw, "bookPrices.");

    const updateStock = (id: string, data: Partial<HolderDoc>) => {
      return updateHolder(id, {
        ...data,
        ...bookPrices,
      });
    };

    const calcStockDistributorBooks = (
      distributor: WithId<HolderDistributorDoc>,
      operator: "+" | "-"
    ) => calcObjectFields(stock.distributors?.[distributor.id].books, operator, books);

    const distributorPriceMultiplier =
      priceMultiplier === stock?.priceMultiplier ? null : priceMultiplier;

    switch (newHolderTransfer.type) {
      // Приход, Корректировка, Найденные, Пожертвования
      case HolderTransferType.bbtIncome:
      case HolderTransferType.adjustment:
      case HolderTransferType.found:
      case HolderTransferType.donations: {
        return Promise.all([
          updateStock(stock.id, {
            books: calcObjectFields(stock.books, "+", books),
            priceMultiplier: priceMultiplier || stock.priceMultiplier || 1,
          }),
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
          updateStock(stock.id, {
            books: calcObjectFields(stock.books, "-", books),
            [`${distributorPath}.books`]: calcStockDistributorBooks(distributor, "+"),
            [`${distributorPath}.priceMultiplier`]: distributorPriceMultiplier,
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
          updateStock(stock.id, {
            books: calcObjectFields(stock.books, "-", books),
            [`${distributorPath}.priceMultiplier`]: distributorPriceMultiplier,
            [`${distributorPath}.statistic`]: calcHolderStat(
              stock.distributors?.[distributor.id].statistic,
              "+",
              newHolderTransfer
            ),
            statistic: calcHolderStat(stock.statistic, "+", newHolderTransfer),
          }),
          updateHolder(distributor.id, {
            books: calcObjectFields(distributor.books, "+", books),
            statistic: calcHolderStat(distributor.statistic, "+", newHolderTransfer),
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
          updateStock(stock.id, {
            books: calcObjectFields(stock.books, "+", books),
            [`${distributorPath}.books`]: calcStockDistributorBooks(distributor, "-"),
            [`${distributorPath}.priceMultiplier`]: distributorPriceMultiplier,
          }),
          updateHolder(distributor.id, { books: calcObjectFields(distributor.books, "-", books) }),
        ]);
      }

      // Принять отчет и платеж по выданным ранее книгам
      case HolderTransferType.report:
      case HolderTransferType.reportByMoney: {
        const { distributor, distributorPath } = getDistributor(fromHolderId);
        if (!distributor) {
          return console.error("distributor not found");
        }

        const data = {
          [`${distributorPath}.books`]: calcStockDistributorBooks(distributor, "-"),
          [`${distributorPath}.priceMultiplier`]: distributorPriceMultiplier,
          [`${distributorPath}.statistic`]: calcHolderStat(
            stock.distributors?.[distributor.id].statistic,
            "+",
            newHolderTransfer
          ),
          statistic: calcHolderStat(stock.statistic, "+", newHolderTransfer),
        };

        if (changedAccount !== undefined) {
          data[`${distributorPath}.account`] = changedAccount;
        }

        return Promise.all([
          addHolderTransfer(newHolderTransfer),
          updateStock(stock.id, data),
          updateHolder(distributor.id, {
            books: calcObjectFields(distributor.books, "-", books),
            statistic: calcHolderStat(distributor.statistic, "+", newHolderTransfer),
          }),
        ]);
      }
    }

    console.log("MultiAction successfully committed!");
  } catch (e) {
    console.log("MultiAction failed: ", e);
  }
};
