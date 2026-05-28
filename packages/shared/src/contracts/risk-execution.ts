import type { TradeProposal, RiskVerdict } from "../types/trading.js";
import type { Order, PositionUpdate } from "../types/governance.js";
import type { Verdict } from "../types/debate.js";

export interface RiskExecutionRoutes {
  "risk/validate": {
    POST: {
      body: { proposal: TradeProposal };
      response: RiskVerdict;
    };
  };
  "orders/place": {
    POST: {
      body: { verdict: Verdict; proposal: TradeProposal };
      response: Order;
    };
  };
  "positions": {
    GET: { response: PositionUpdate[] };
  };
}
