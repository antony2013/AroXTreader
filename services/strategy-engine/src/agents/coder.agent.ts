import type { Strategy } from "@aroxtrader/shared";
import { createLogger, addMemory } from "@aroxtrader/shared";
import { createAgentConfig } from "../deepagents/config.js";

const log = createLogger("coder-agent");

const SYSTEM_PROMPT = `You are the CoderAgent of AroXtrader. Your role is autonomous strategy code generation, backtesting, and optimization.
You generate executable TypeScript/JavaScript trading strategies based on analyst ideas and quant models.
You have tools for: generating strategy code, running sandboxed backtests, optimizing parameters, and storing strategies to the library.`;

let agent: any = null;

const strategies: Strategy[] = [];

export async function start(): Promise<void> {
  log.info("CoderAgent initializing with DeepAgents runtime + sandbox");
  const { createDeepAgent } = await import("deepagents");
  const config = await createAgentConfig("CoderAgent", SYSTEM_PROMPT);
  agent = createDeepAgent(config);
  log.info("CoderAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("CoderAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
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

  addMemory(
    `Strategy generated: ${strategy.name} (${strategy.id}) with params ${JSON.stringify(strategy.params)}.`,
    { agent_id: "CoderAgent", metadata: { strategyId: strategy.id, name: strategy.name } }
  ).catch((err) => log.error("Mem0 store failed", err));

  return strategy;
}

export function listStrategies(): Strategy[] {
  return [...strategies];
}
