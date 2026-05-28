import type { TradeProposal, Argument, Verdict } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";
import { createDebateAgentConfig } from "../deepagents/config.js";

const log = createLogger("judge-agent");

const SYSTEM_PROMPT = `You are the Judge Agent. Your role is to weigh the Bull and Bear arguments impartially and deliver a verdict.
Consider: argument quality, evidence strength, risk/reward, market context, and agent track records.
Output: APPROVE (trade proceeds), REJECT (trade dies), or MODIFY (adjust size/SL/target and resubmit to RiskAgent).`;

let agent: any = null;

export async function start(): Promise<void> {
  log.info("JudgeAgent initializing with DeepAgents runtime");
  const { createDeepAgent } = await import("deepagents");
  const config = await createDebateAgentConfig("JudgeAgent", SYSTEM_PROMPT);
  agent = createDeepAgent(config);
  log.info("JudgeAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("JudgeAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
}

export async function decide(
  bull: Argument,
  bear: Argument,
  proposal: TradeProposal
): Promise<Verdict> {
  log.info("JudgeAgent deliberating", { proposal_id: proposal.id });

  const action = bull.confidence > bear.confidence ? "APPROVE" : "REJECT";

  return {
    id: crypto.randomUUID(),
    trade_id: proposal.id,
    action,
    reasoning: `Stub verdict: Bull(${bull.confidence}) vs Bear(${bear.confidence})`,
    confidence: Math.abs(bull.confidence - bear.confidence),
    timestamp: Date.now(),
  };
}
