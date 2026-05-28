import type { MarketTick } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("data-agent");

export const DATA_AGENT_PROMPT = `You are the DataAgent of AroXtrader. Your role is real-time market data ingestion from Upstox WebSocket V3.
You receive raw price ticks and order book data, validate it, and route it to the appropriate consumers.
You have tools for: subscribing/unsubscribing to symbols, querying latest ticks, detecting price anomalies and volume spikes.
When you detect a breakout (price crossing key level) or volume spike (>2x 20-period avg), emit a trigger event.`;

const tickCache: MarketTick[] = [];
const MAX_CACHE = 1000;

export async function start(): Promise<void> {
  log.info("DataAgent initializing with DeepAgents runtime");
  log.info("DataAgent started");
}

export function cacheTick(tick: MarketTick): void {
  tickCache.push(tick);
  if (tickCache.length > MAX_CACHE) {
    tickCache.splice(0, tickCache.length - MAX_CACHE);
  }
}

export function getTicks(): MarketTick[] {
  return [...tickCache];
}

export function getTicksForSymbol(symbol: string): MarketTick[] {
  return tickCache.filter((t) => t.symbol === symbol);
}
