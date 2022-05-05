export interface PaymentsCardsAttributes {
  customer_id: string;
  user_id: string;
}

export type PaymentsTypes = 'cash' | 'card' | 'transfer';
export type PaymentsStatus = 'paied' | 'unpaied';

export const paymentsTypes: { id: number; name: PaymentsTypes }[] = [
  { id: 1, name: 'cash' },
  { id: 2, name: 'card' },
  { id: 3, name: 'transfer' },
];

export type ICreditCard = {
  id: string;
  date_created: Date;
  date_last_updated: Date;
  customer_id: string;
  expiration_month: number; // 1 - 12
  expiration_year: number; // 2020
  first_six_digits: string;
  last_four_digits: string;
  payment_method: {
    id: string;
    name: string;
    payment_type_id: string;
    thumbnail: string;
    secure_thumbnail: string;
  };
  security_code: {
    length: number;
    card_location: string;
  };
  issuer: {
    id: number;
    name: string;
  };
  cardholder: {
    name: string;
    identification: {
      number: string;
      type: string;
    };
  };
  user_id: string;
  live_mode: boolean;
};

export type ITransfer = {
  from_cbu: string; // cbu
  from_name: string; // nombre de la cuenta
  from_bank: string; // nombre del banco
};
