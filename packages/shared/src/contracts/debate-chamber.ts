import type { TradeProposal, RiskVerdict } from "../types/trading.js";
import type { Argument, Verdict } from "../types/debate.js";

export interface DebateChamberRoutes {
  "debate/bull": {
    POST: {
      body: { proposal: TradeProposal; risk: RiskVerdict };
      response: Argument;
    };
  };
  "debate/bear": {
    POST: {
      body: { proposal: TradeProposal; risk: RiskVerdict };
      response: Argument;
    };
  };
  "debate/judge": {
    POST: {
      body: { bull: Argument; bear: Argument; proposal: TradeProposal };
      response: Verdict;
    };
  };
}
