import type { Strategy } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("coder-agent");

const strategies: Strategy[] = [];

export async function start(): Promise<void> {
  log.info("CoderAgent initializing with DeepAgents runtime + sandbox");
  log.info("CoderAgent started");
}

export async function generate(name: string, params: Record<string, unknown>): Promise<Strategy> {
  log.info("Generating strategy", { name, params });
  const strategy: Strategy = {
    id: crypto.randomUUID(),
    name,
    code: "// TODO: Generated strategy code",
    params: params as Record<string, string | number | boolean>,
    backtest_result: { sharpe: 0, max_drawdown: 0, win_rate: 0, total_trades: 0, metrics: {} },
    status: "PAUSED",
  };
  strategies.push(strategy);
  return strategy;
}

export function listStrategies(): Strategy[] {
  return [...strategies];
}
