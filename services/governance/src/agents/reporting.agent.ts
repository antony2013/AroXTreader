import type { Report, TradeScore, PositionUpdate } from "@aroxtrader/shared";
import { createLogger, addMemory } from "@aroxtrader/shared";
import { createGovernanceAgentConfig } from "../deepagents/config.js";

const log = createLogger("reporting-agent");

const SYSTEM_PROMPT = `You are the ReportingAgent of AroXtrader. Your role is daily/weekly report generation and human escalation alerts.
You compile trade scores, position updates, P&L, metrics, and exception logs into structured reports.
When risk breaches or critical exceptions occur, you immediately alert the human overseer.`;

let agent: any = null;

const tradeScores: TradeScore[] = [];
const positionUpdates: PositionUpdate[] = [];

export async function start(): Promise<void> {
  log.info("ReportingAgent initializing with DeepAgents runtime");
  const { createDeepAgent } = await import("deepagents");
  const config = await createGovernanceAgentConfig("ReportingAgent", SYSTEM_PROMPT);
  agent = createDeepAgent(config);
  log.info("ReportingAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("ReportingAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
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

  const report: Report = {
    period,
    pnl: totalPnl,
    trades: tradeScores.length,
    metrics: { winRate: tradeScores.length > 0 ? tradeScores.filter((s) => s.pnl > 0).length / tradeScores.length : 0 },
    alerts,
  };

  addMemory(
    `${period} report: P&L ${totalPnl}, trades ${report.trades}, alerts: ${alerts.join("; ") || "none"}.`,
    { agent_id: "ReportingAgent", metadata: { period, pnl: totalPnl, trades: report.trades } }
  ).catch((err) => log.error("Mem0 store failed", err));

  return report;
}
