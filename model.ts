export enum CurrencyCode {
  USD = "USD",
  GBP = "GBP",
  TRY = "TRY",
}

export type CartModel = {
  _id: string;
  items: CartItemModel[];
  currency: CurrencyCode;
};

export type CartItemModel = {
  _id: string;
  name: string;
  quantity: number;
  currency: CurrencyCode;
  price: number;
};
