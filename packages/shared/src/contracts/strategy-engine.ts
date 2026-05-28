import type { TradeIdea, QuantModel, Strategy, TradeProposal } from "../types/trading.js";

export interface StrategyEngineRoutes {
  "ideas/generate": {
    POST: {
      body: { symbol: string };
      response: TradeIdea;
    };
  };
  "quant/model": {
    POST: {
      body: { idea: TradeIdea };
      response: QuantModel;
    };
  };
  "strategies": {
    GET: { response: Strategy[] };
  };
  "proposals": {
    POST: {
      body: { symbol: string };
      response: TradeProposal;
    };
  };
}
