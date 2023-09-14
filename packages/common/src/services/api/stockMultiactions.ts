import { HolderTransferDoc, addHolderTransfer } from "./holderTransfer";

export const addHolderTransferMultiAction = async (newHolderTransfer: HolderTransferDoc) => {
  try {
    const holderTransferResponse = await addHolderTransfer(newHolderTransfer);
    const transferId = holderTransferResponse.id;
    console.log("🚀 ~ addHolderTransferMultiAction ~ transferId:", transferId);
    // TODO: change stock by type

    console.log("MultiAction successfully committed!");
  } catch (e) {
    console.log("MultiAction failed: ", e);
  }
};
