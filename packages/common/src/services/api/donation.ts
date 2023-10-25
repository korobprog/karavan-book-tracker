import { setDoc } from "firebase/firestore";
import { apiRefs } from "./refs";

export type BankItem = {
  bankName: string;
  cardNumber: string;
  qrLink?: string;
};

export type DonationPageDoc = {
  banks: BankItem[];
  socialTelegram?: string;
  socialWhats?: string;
  socialLink?: string;
  active?: boolean;
};

export type DonationTransferDocWithId = DonationPageDoc & {
  id: string;
};

export const editDonationPageDoc = async (id: string, data: DonationPageDoc) => {
  setDoc(apiRefs.donationPage(id), data);
};
