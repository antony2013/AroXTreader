import type { MarketTick, NewsEvent, Regime } from "../types/market.js";

/** Data Pipeline service API contract */
export interface DataPipelineRoutes {
  "market/ticks": {
    GET: { response: MarketTick[] };
  };
  "market/regime": {
    GET: { response: Regime };
  };
  "news/feed": {
    GET: {
      query: { symbol?: string };
      response: NewsEvent[];
    };
  };
}
