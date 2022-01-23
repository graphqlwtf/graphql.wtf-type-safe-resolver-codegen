import { createServer } from "graphql-yoga";
import * as currencyFormatter from "currency-formatter";

import { Resolvers } from "./types";

export const schema = /* GraphQL */ `
  type Query {
    cart(id: ID!): Cart!
  }

  type Cart {
    id: ID!
    totalItems: Int!
    items: [CartItem!]!
    subTotal: Money!
    currency: Currency!
  }

  type CartItem {
    name: String!
    quantity: Int!
  }

  type Money {
    amount: Int!
    formatted: String!
  }

  enum Currency {
    USD
    GBP
    TRY
  }
`;

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
};

const CARTS: CartModel[] = [
  {
    _id: "wtf",
    items: [],
    currency: CurrencyCode.USD,
  },
];

const resolvers: Resolvers = {
  Query: {
    cart: (_, { id }) => {
      return CARTS.find((cart) => cart._id === id);
    },
  },
  Cart: {
    id: (cart) => cart._id,
    totalItems: (cart) => cart.items.length,
    subTotal: (cart) => {
      const amount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

      return {
        amount,
        formatted: currencyFormatter.format(amount / 100, {
          code: cart.currency,
        }),
      };
    },
  },
  Currency: {
    USD: CurrencyCode.USD,
    GBP: CurrencyCode.GBP,
    TRY: CurrencyCode.TRY,
  },
};

const server = createServer({
  typeDefs: schema,
  resolvers,
});

server.start(() => console.log("Server is running on localhost:4000"));
