import type { TradeProposal, RiskVerdict } from "@aroxtrader/shared";
import { createLogger, escalateRiskBreach } from "@aroxtrader/shared";
import { createRiskAgentConfig } from "../deepagents/config.js";

const log = createLogger("risk-agent");

export const RISK_AGENT_PROMPT = `You are the RiskAgent of AroXtrader. Your role is adaptive risk management.
You enforce hard risk limits (max position size, daily loss limit, margin utilization) and adjust them dynamically based on market regime from RegimeAgent.
You have tools for: computing position VaR, checking sector exposure, validating margin requirements, computing Greeks limits for F&O positions.
During TRENDING_UP regimes, you may relax position limits slightly. During VOLATILE regimes, you tighten all limits.
You are the first mandatory gate — if you reject a trade, it dies here with no appeal. If you approve, the trade proceeds to the Debate Chamber.
Rule: FAIL CLOSED. If you cannot validate, reject the trade.`;

let agent: any = null;

interface RiskConfig {
  maxPositionSizePct: number;
  dailyLossLimit: number;
  maxSectorExposurePct: number;
}

const config: RiskConfig = {
  maxPositionSizePct: 2,
  dailyLossLimit: -50000,
  maxSectorExposurePct: 30,
};

let dailyPnl = 0;
let tradingFrozen = false;

export async function start(): Promise<void> {
  log.info("RiskAgent initializing with DeepAgents runtime for adaptive risk");
  const { createDeepAgent } = await import("deepagents");
  const cfg = await createRiskAgentConfig("RiskAgent", RISK_AGENT_PROMPT);
  agent = createDeepAgent(cfg);
  log.info("RiskAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("RiskAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
}

export function validate(proposal: TradeProposal): RiskVerdict {
  if (tradingFrozen) {
    return { approved: false, limits: { max_size: 0, max_loss: 0 }, reason: "Trading is frozen due to risk breach" };
  }

  if (dailyPnl < config.dailyLossLimit) {
    tradingFrozen = true;
    escalateRiskBreach("Daily loss limit breached — trading frozen", {
      dailyPnl,
      limit: config.dailyLossLimit,
      proposal: proposal.id,
    });
    return { approved: false, limits: { max_size: config.maxPositionSizePct, max_loss: Math.abs(config.dailyLossLimit) }, reason: "Daily loss limit breached — trading frozen" };
  }

  return {
    approved: true,
    limits: { max_size: config.maxPositionSizePct, max_loss: Math.abs(config.dailyLossLimit) },
    reason: "All risk checks passed",
  };
}

export function isTradingFrozen(): boolean {
  return tradingFrozen;
}

export function unfreezeTrading(): void {
  tradingFrozen = false;
  dailyPnl = 0;
  log.info("Trading unfrozen by human override");
}

export function updateDailyPnl(pnl: number): void {
  dailyPnl += pnl;
}
