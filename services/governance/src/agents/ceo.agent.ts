import type { Directive } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("ceo-agent");

const SYSTEM_PROMPT = `You are the CEO Agent of AroXtrader, an autonomous trading company.
Your role: coordinate cross-service decisions, resolve deadlocks, and oversee the health of all 15 agents.
During pre-market bootstrap, load yesterday's context and brief all agents on the current portfolio state.`;

export async function start(): Promise<void> {
  log.info("CEOAgent initializing with DeepAgents runtime");
  log.info("CEOAgent started");
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
