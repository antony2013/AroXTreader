export interface MarketTick {
  symbol: string;
  ltp: number;
  volume: number;
  oi: number;
  bid: number;
  ask: number;
  timestamp: number;
}

export interface NewsEvent {
  source: string;
  headline: string;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  symbols: string[];
  impact: "HIGH" | "MED" | "LOW";
  timestamp: number;
}

export type RegimeType = "TRENDING_UP" | "TRENDING_DOWN" | "RANGING" | "VOLATILE";

export interface Regime {
  type: RegimeType;
  confidence: number;
  vix: number;
  breadth: number;
  timestamp: number;
}
