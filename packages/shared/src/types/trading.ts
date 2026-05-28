export interface TradeIdea {
  symbol: string;
  direction: "LONG" | "SHORT";
  rationale: string;
  confidence: number;
  timeframe: string;
}

export interface QuantModel {
  entry_price: number;
  targets: number[];
  stoploss: number;
  risk_reward: number;
  probability: number;
}

export interface Strategy {
  id: string;
  name: string;
  code: string;
  params: Record<string, unknown>;
  backtest_result: Record<string, unknown>;
  status: "ACTIVE" | "PAUSED" | "DISABLED";
}

export interface TradeProposal {
  id: string;
  idea: TradeIdea;
  model: QuantModel;
  strategy_id: string;
  timestamp: number;
}

export interface RiskVerdict {
  approved: boolean;
  limits: {
    max_size: number;
    max_loss: number;
  };
  reason: string;
}
