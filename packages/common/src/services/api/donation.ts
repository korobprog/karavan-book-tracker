import { setDoc } from "firebase/firestore";
import { apiRefs } from "./refs";

export type BankItem = {
  bankName: string;
  cardNumber: string;
  qrLink?: string;
};

export type DonationPageDoc = {
  active: boolean;
  banks: BankItem[];
  socialTelegram?: string;
  socialWhats?: string;
  socialMail?: string;
  socialLink?: string;
  avatar?: string;
  userName?: string;
  greetingText?: string;
};

export type DonationTransferDocWithId = DonationPageDoc & {
  id: string;
};

export const editDonationPageDoc = async (id: string, data: DonationPageDoc) => {
  setDoc(apiRefs.donationPage(id), data);
};
