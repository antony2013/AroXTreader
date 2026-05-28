import type { MarketTick } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("upstox-ws");

type TickHandler = (tick: MarketTick) => void;

let handlers: TickHandler[] = [];

export function onTick(handler: TickHandler) {
  handlers.push(handler);
}

export async function connect(accessToken: string): Promise<void> {
  log.info("Connecting to Upstox WebSocket V3...");
  // TODO: Implement actual WebSocket connection to wss://api.upstox.com/v3/market-feed
  log.info("Upstox WebSocket connection established (stub)");
}

export function disconnect(): void {
  handlers = [];
  log.info("Upstox WebSocket disconnected");
}
