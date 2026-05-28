import type { Order } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("upstox-rest");

export async function placeOrder(params: {
  symbol: string;
  quantity: number;
  price: number;
  orderType: "LIMIT" | "MARKET";
  product: "DELIVERY" | "INTRADAY";
  transactionType: "BUY" | "SELL";
}): Promise<Order> {
  log.info("Placing order via Upstox REST V3", params);
  return {
    id: crypto.randomUUID(),
    trade_id: crypto.randomUUID(),
    symbol: params.symbol,
    transaction_type: params.transactionType,
    quantity: params.quantity,
    price: params.price,
    type: params.orderType,
    product: params.product,
    status: "PENDING",
    timestamp: Date.now(),
  };
}

export async function getPortfolio(): Promise<unknown> {
  return {};
}

export async function getFunds(): Promise<unknown> {
  return {};
}
