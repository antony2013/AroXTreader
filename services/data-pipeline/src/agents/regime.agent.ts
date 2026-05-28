import type { Regime } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";
import { createPipelineAgentConfig } from "../deepagents/config.js";

const log = createLogger("regime-agent");

export const REGIME_AGENT_PROMPT = `You are the RegimeAgent of AroXtrader. Your role is market regime classification.
You analyze VIX levels, market breadth (advance/decline), FII/DII flow data, and price action to classify the current regime as: TRENDING_UP, TRENDING_DOWN, RANGING, or VOLATILE.
You have tools for: computing breadth indicators, tracking VIX changes, monitoring institutional flow data.
When you detect a regime change, emit a trigger event — RiskAgent will adjust position limits accordingly.`;

let agent: any = null;

let currentRegime: Regime = {
  type: "RANGING",
  confidence: 0.5,
  vix: 0,
  breadth: 0,
  timestamp: Date.now(),
};

export async function start(): Promise<void> {
  log.info("RegimeAgent initializing with DeepAgents runtime");
  const { createDeepAgent } = await import("deepagents");
  const config = await createPipelineAgentConfig("RegimeAgent", REGIME_AGENT_PROMPT);
  agent = createDeepAgent(config);
  log.info("RegimeAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("RegimeAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
}

export function getCurrentRegime(): Regime {
  return { ...currentRegime };
}

export function updateRegime(update: Partial<Regime>): void {
  currentRegime = { ...currentRegime, ...update, timestamp: Date.now() };
  log.info("Regime updated", currentRegime);
}
