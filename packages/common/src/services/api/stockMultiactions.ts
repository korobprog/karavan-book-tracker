import { HolderTransferDoc, addHolderTransfer } from "./holderTransfer";
import { HolderTransferType } from "../../../../common/src/components/TransferTypeSelect";
import { getDocFromCache } from "firebase/firestore";
import { updateHolder } from "./holders";

export const addHolderTransferMultiAction = async (newHolderTransfer: HolderTransferDoc) => {
  try {
    const holderTransferResponse = await addHolderTransfer(newHolderTransfer);
    const bookId = "bookId";
    if (HolderTransferType.bbtIncome) {
      newHolderTransfer.books[bookId] = 25;
    }
    // await (updateHolder(holderId, {books: newBooks}))

    // TODO: change stock by type

    console.log("MultiAction successfully committed!");
  } catch (e) {
    console.log("MultiAction failed: ", e);
  }
};
