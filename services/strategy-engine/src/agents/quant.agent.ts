import type { QuantModel, TradeIdea } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";
import { createAgentConfig } from "../deepagents/config.js";

const log = createLogger("quant-agent");

const SYSTEM_PROMPT = `You are the QuantAgent of AroXtrader. Your role is mathematical modeling, entry/exit/target/stoploss computation.
You compute risk/reward ratios, probability estimates, Greeks for F&O, and position sizing.
Output structured QuantModel objects with entry_price, targets[], stoploss, risk_reward, and probability.`;

let agent: any = null;

export async function start(): Promise<void> {
  log.info("QuantAgent initializing with DeepAgents runtime");
  const { createDeepAgent } = await import("deepagents");
  const config = await createAgentConfig("QuantAgent", SYSTEM_PROMPT);
  agent = createDeepAgent(config);
  log.info("QuantAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("QuantAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
}

export async function model(idea: TradeIdea): Promise<QuantModel> {
  log.info("Modeling", { idea });
  return {
    entry_price: 0,
    targets: [],
    stoploss: 0,
    risk_reward: 0,
    probability: 0.5,
  };
}
