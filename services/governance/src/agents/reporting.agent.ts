import type { Report, TradeScore, PositionUpdate } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("reporting-agent");

const tradeScores: TradeScore[] = [];
const positionUpdates: PositionUpdate[] = [];

export async function start(): Promise<void> {
  log.info("ReportingAgent initializing with DeepAgents runtime");
  log.info("ReportingAgent started");
}

export function recordTradeScore(score: TradeScore): void {
  tradeScores.push(score);
}

export function recordPositionUpdate(update: PositionUpdate): void {
  positionUpdates.push(update);
}

export function generateReport(period: "DAILY" | "WEEKLY"): Report {
  const totalPnl = tradeScores.reduce((sum, s) => sum + s.pnl, 0);
  const alerts: string[] = [];

  if (totalPnl < 0) {
    alerts.push("Daily loss detected");
  }

  return {
    period,
    pnl: totalPnl,
    trades: tradeScores.length,
    metrics: { winRate: tradeScores.length > 0 ? tradeScores.filter((s) => s.pnl > 0).length / tradeScores.length : 0 },
    alerts,
  };
}
