import type { TradeIdea } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("analyst-agent");

const SYSTEM_PROMPT = `You are an expert market analyst for Indian equities and F&O.
Your role: analyze market data, news, and regime to identify high-probability trade opportunities.
Output structured TradeIdea objects with symbol, direction, rationale, confidence, and timeframe.`;

export async function start(): Promise<void> {
  log.info("AnalystAgent initializing with DeepAgents runtime");
  log.info("AnalystAgent started");
}

export async function analyze(symbol: string): Promise<TradeIdea> {
  log.info("Analyzing", { symbol });
  return {
    symbol,
    direction: "LONG",
    rationale: `Stub analysis for ${symbol} — pending DeepAgent integration`,
    confidence: 0.5,
    timeframe: "1D",
  };
}
