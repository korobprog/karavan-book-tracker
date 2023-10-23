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
  active: boolean;
  avatar: string;
};
