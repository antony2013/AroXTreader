import type { NewsEvent } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("news-agent");

export const NEWS_AGENT_PROMPT = `You are the NewsAgent of AroXtrader. Your role is financial news aggregation and sentiment analysis.
You monitor RSS feeds, corporate announcements (NSE/BSE), FII/DII data, and economic calendars.
You have tools for: fetching news by symbol, classifying sentiment (POSITIVE/NEGATIVE/NEUTRAL), assessing impact (HIGH/MED/LOW).
When you detect material news (high impact on a tracked symbol), emit a trigger event to AnalystAgent.`;

const newsCache: NewsEvent[] = [];
const MAX_CACHE = 200;

export function start(): void {
  log.info("NewsAgent initialized with DeepAgents runtime");
}

export function cacheNews(event: NewsEvent): void {
  newsCache.push(event);
  if (newsCache.length > MAX_CACHE) {
    newsCache.splice(0, newsCache.length - MAX_CACHE);
  }
}

export function getNews(): NewsEvent[] {
  return [...newsCache];
}

export function getNewsForSymbol(symbol: string): NewsEvent[] {
  return newsCache.filter((n) => n.symbols.includes(symbol));
}
