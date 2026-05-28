import type { Directive, Report, TradeScore } from "../types/governance.js";

export interface GovernanceRoutes {
  "evaluate/score": {
    POST: {
      body: { trade_id: string; pnl: number; verdict_id: string };
      response: TradeScore;
    };
  };
  "report/generate": {
    POST: {
      body: { period: "DAILY" | "WEEKLY" };
      response: Report;
    };
  };
  "ceo/directive": {
    POST: {
      body: { target_agent: string; action: string; reason: string };
      response: Directive;
    };
  };
  "chat/:agent": {
    POST: {
      body: { message: string };
      params: { agent: string };
      response: ReadableStream;
    };
  };
}
