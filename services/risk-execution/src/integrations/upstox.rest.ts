import type { Order } from "@aroxtrader/shared";
import { createLogger, retry, createCircuitBreaker } from "@aroxtrader/shared";

const log = createLogger("upstox-rest");

const BASE_URL = "https://api.upstox.com/v3";
const ACCESS_TOKEN = process.env.UPSTOX_ACCESS_TOKEN ?? "";

/** Circuit breaker for Upstox API — opens after 5 failures, recovers in 30s. */
const cb = createCircuitBreaker({ failureThreshold: 5, recoveryTimeoutMs: 30000 });

async function upstoxFetch(path: string, init?: RequestInit): Promise<unknown> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstox ${path} failed: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Place an order via Upstox REST V3 with retry + circuit breaker.
 */
export async function placeOrder(params: {
  symbol: string;
  quantity: number;
  price: number;
  orderType: "LIMIT" | "MARKET";
  product: "DELIVERY" | "INTRADAY";
  transactionType: "BUY" | "SELL";
}): Promise<Order> {
  log.info("Placing order via Upstox REST V3", params);

  const body = {
    symbol: params.symbol,
    quantity: params.quantity,
    price: params.price,
    order_type: params.orderType,
    product: params.product,
    transaction_type: params.transactionType,
    instrument_token: params.symbol,
  };

  const result = (await cb.execute(() =>
    retry(() =>
      upstoxFetch("/order/place", {
        method: "POST",
        body: JSON.stringify(body),
      })
    )
  )) as any;

  const orderId = result?.data?.order_id ?? crypto.randomUUID();

  return {
    id: orderId,
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
  try {
    return await cb.execute(() => retry(() => upstoxFetch("/portfolio/short-term")));
  } catch (err) {
    log.error("Portfolio fetch failed", err);
    return {};
  }
}

export async function getFunds(): Promise<unknown> {
  try {
    return await cb.execute(() => retry(() => upstoxFetch("/user/get-funds-and-margin")));
  } catch (err) {
    log.error("Funds fetch failed", err);
    return {};
  }
}

export async function getOrderHistory(): Promise<unknown> {
  try {
    return await cb.execute(() => retry(() => upstoxFetch("/order/history")));
  } catch (err) {
    log.error("Order history fetch failed", err);
    return [];
  }
}
