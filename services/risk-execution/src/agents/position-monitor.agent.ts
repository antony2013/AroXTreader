import type { Order, PositionUpdate } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";
import { createRiskAgentConfig } from "../deepagents/config.js";

const log = createLogger("position-monitor");

export const POSITION_MONITOR_PROMPT = `You are the PositionMonitorAgent of AroXtrader. Your role is real-time position tracking and health monitoring.
You track every open position: unrealized P&L, mark-to-market, stop-loss distance, and health status (HEALTHY/WARNING/CRITICAL).
You have tools for: querying live position state, computing trailing stop-loss levels, detecting positions approaching stop-loss, and emitting alerts.
When a position hits its stop-loss or target, you notify ExecutionAgent to close it.
You are always on — circuit breakers never apply to your stop-loss enforcement.`;

let agent: any = null;

const positions = new Map<string, PositionUpdate>();

export async function start(): Promise<void> {
  log.info("PositionMonitorAgent initializing");
  const { createDeepAgent } = await import("deepagents");
  const config = await createRiskAgentConfig("PositionMonitorAgent", POSITION_MONITOR_PROMPT);
  agent = createDeepAgent(config);
  log.info("PositionMonitorAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("PositionMonitorAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
}

export function trackPosition(order: Order): void {
  positions.set(order.trade_id, {
    order_id: order.id,
    symbol: order.symbol,
    pnl: 0,
    m2m: 0,
    unrealized: 0,
    health: "HEALTHY",
    timestamp: Date.now(),
  });
}

export function updatePosition(tradeId: string, update: Partial<PositionUpdate>): void {
  const existing = positions.get(tradeId);
  if (existing) {
    positions.set(tradeId, { ...existing, ...update, timestamp: Date.now() });
  }
}

export function getPositions(): PositionUpdate[] {
  return [...positions.values()];
}
