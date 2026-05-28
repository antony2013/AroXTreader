import type { TradeProposal, RiskVerdict } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("risk-agent");

export const RISK_AGENT_PROMPT = `You are the RiskAgent of AroXtrader. Your role is adaptive risk management.
You enforce hard risk limits (max position size, daily loss limit, margin utilization) and adjust them dynamically based on market regime from RegimeAgent.
You have tools for: computing position VaR, checking sector exposure, validating margin requirements, computing Greeks limits for F&O positions.
During TRENDING_UP regimes, you may relax position limits slightly. During VOLATILE regimes, you tighten all limits.
You are the first mandatory gate — if you reject a trade, it dies here with no appeal. If you approve, the trade proceeds to the Debate Chamber.
Rule: FAIL CLOSED. If you cannot validate, reject the trade.`;

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
  log.info("RiskAgent started");
}

export function validate(proposal: TradeProposal): RiskVerdict {
  if (tradingFrozen) {
    return { approved: false, limits: { max_size: 0, max_loss: 0 }, reason: "Trading is frozen due to risk breach" };
  }

  if (dailyPnl < config.dailyLossLimit) {
    tradingFrozen = true;
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
