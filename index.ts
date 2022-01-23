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
  }

  type CartItem {
    id: ID!
    name: String!
    quantity: Int!
    lineTotal: Money!
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
  currency: CurrencyCode;
  price: number;
};

const CARTS: CartModel[] = [
  {
    _id: "wtf",
    items: [
      {
        _id: "1",
        name: "T-Shirt",
        quantity: 3,
        price: 1000,
        currency: CurrencyCode.USD,
      },
      {
        _id: "2",
        name: "Stickers",
        quantity: 1,
        price: 500,
        currency: CurrencyCode.USD,
      },
    ],
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
      const amount = cart.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      return {
        amount,
        formatted: currencyFormatter.format(amount / 100, {
          code: cart.currency,
        }),
      };
    },
  },
  CartItem: {
    id: (item) => item._id,
    lineTotal: (item) => {
      const amount = item.quantity * item.price;

      return {
        amount,
        formatted: currencyFormatter.format(amount / 100, {
          code: item.currency,
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
