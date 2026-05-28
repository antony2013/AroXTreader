/**
 * Typed API clients for all 5 backend services.
 * Uses the shared Eden contracts for type-safe request/response shapes.
 */

import type {
  DataPipelineRoutes,
  StrategyEngineRoutes,
  RiskExecutionRoutes,
  DebateChamberRoutes,
  GovernanceRoutes,
} from "@aroxtrader/shared";

const DATA_URL = "http://localhost:3001";
const STRATEGY_URL = "http://localhost:3002";
const RISK_URL = "http://localhost:3003";
const DEBATE_URL = "http://localhost:3004";
const GOVERNANCE_URL = "http://localhost:3005";

async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} failed: ${res.status}`);
  return res.json();
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${url} failed: ${res.status}`);
  return res.json();
}

/* ---------- Data Pipeline ---------- */

export const dataPipeline = {
  ticks: () =>
    get<DataPipelineRoutes["market/ticks"]["GET"]["response"]>(`${DATA_URL}/market/ticks`),

  regime: () =>
    get<DataPipelineRoutes["market/regime"]["GET"]["response"]>(`${DATA_URL}/market/regime`),

  news: (symbol?: string) =>
    get<DataPipelineRoutes["news/feed"]["GET"]["response"]>(
      `${DATA_URL}/news/feed${symbol ? `?symbol=${symbol}` : ""}`
    ),
};

/* ---------- Strategy Engine ---------- */

export const strategyEngine = {
  ideas: (symbol: string) =>
    post<StrategyEngineRoutes["ideas/generate"]["POST"]["response"]>(`${STRATEGY_URL}/ideas/generate`, { symbol }),

  quant: (idea: unknown) =>
    post<StrategyEngineRoutes["quant/model"]["POST"]["response"]>(`${STRATEGY_URL}/quant/model`, { idea }),

  strategies: () =>
    get<StrategyEngineRoutes["strategies"]["GET"]["response"]>(`${STRATEGY_URL}/strategies`),

  propose: (symbol: string) =>
    post<StrategyEngineRoutes["proposals"]["POST"]["response"]>(`${STRATEGY_URL}/proposals`, { symbol }),
};

/* ---------- Risk & Execution ---------- */

export const riskExecution = {
  validate: (proposal: unknown) =>
    post<RiskExecutionRoutes["risk/validate"]["POST"]["response"]>(`${RISK_URL}/risk/validate`, { proposal }),

  placeOrder: (verdict: unknown, proposal: unknown) =>
    post<RiskExecutionRoutes["orders/place"]["POST"]["response"]>(`${RISK_URL}/orders/place`, { verdict, proposal }),

  positions: () =>
    get<RiskExecutionRoutes["positions"]["GET"]["response"]>(`${RISK_URL}/positions`),
};

/* ---------- Debate Chamber ---------- */

export const debateChamber = {
  bull: (proposal: unknown, risk: unknown) =>
    post<DebateChamberRoutes["debate/bull"]["POST"]["response"]>(`${DEBATE_URL}/debate/bull`, { proposal, risk }),

  bear: (proposal: unknown, risk: unknown) =>
    post<DebateChamberRoutes["debate/bear"]["POST"]["response"]>(`${DEBATE_URL}/debate/bear`, { proposal, risk }),

  judge: (bull: unknown, bear: unknown, proposal: unknown) =>
    post<DebateChamberRoutes["debate/judge"]["POST"]["response"]>(`${DEBATE_URL}/debate/judge`, { bull, bear, proposal }),
};

/* ---------- Governance ---------- */

export const governance = {
  score: (trade_id: string, pnl: number, verdict_id: string) =>
    post<GovernanceRoutes["evaluate/score"]["POST"]["response"]>(`${GOVERNANCE_URL}/evaluate/score`, { trade_id, pnl, verdict_id }),

  report: (period: "DAILY" | "WEEKLY") =>
    post<GovernanceRoutes["report/generate"]["POST"]["response"]>(`${GOVERNANCE_URL}/report/generate`, { period }),

  directive: (target_agent: string, action: string, reason: string) =>
    post<GovernanceRoutes["ceo/directive"]["POST"]["response"]>(`${GOVERNANCE_URL}/ceo/directive`, { target_agent, action, reason }),

  chat: (agent: string, message: string) =>
    fetch(`${GOVERNANCE_URL}/chat/${agent}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    }),

  getConfig: () =>
    get<{ llmModel: string; llmBaseUrl: string }>(`${GOVERNANCE_URL}/config`),

  setConfig: (llmModel: string) =>
    post<{ ok: boolean; llmModel: string }>(`${GOVERNANCE_URL}/config`, { llmModel }),
};
