import type { Directive } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";
import { createGovernanceAgentConfig } from "../deepagents/config.js";

const log = createLogger("ceo-agent");

const SYSTEM_PROMPT = `You are the CEO Agent of AroXtrader, an autonomous trading company.
Your role: coordinate cross-service decisions, resolve deadlocks, and oversee the health of all 15 agents.
During pre-market bootstrap, load yesterday's context and brief all agents on the current portfolio state.`;

let agent: any = null;

export async function start(): Promise<void> {
  log.info("CEOAgent initializing with DeepAgents runtime");
  const { createDeepAgent } = await import("deepagents");
  const config = await createGovernanceAgentConfig("CEOAgent", SYSTEM_PROMPT);
  agent = createDeepAgent(config);
  log.info("CEOAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("CEOAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
}

export async function bootstrap(): Promise<void> {
  log.info("CEOAgent running pre-market bootstrap");
}

export async function issueDirective(target_agent: string, action: string, reason: string): Promise<Directive> {
  return {
    target_agent,
    action: action as Directive["action"],
    reason,
    timestamp: Date.now(),
  };
}
