import type { TradeProposal, RiskVerdict, Argument } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";
import { createDebateAgentConfig } from "../deepagents/config.js";

const log = createLogger("bull-agent");

const SYSTEM_PROMPT = `You are the Bull Agent. Your role is to build the strongest possible bullish thesis for every trade proposal.
Analyze: momentum, institutional flows, technical patterns, macro tailwinds, and sentiment.
Output a structured Argument with thesis, evidence list, confidence score, and price target.`;

let agent: any = null;

export async function start(): Promise<void> {
  log.info("BullAgent initializing with DeepAgents runtime");
  const { createDeepAgent } = await import("deepagents");
  const config = await createDebateAgentConfig("BullAgent", SYSTEM_PROMPT);
  agent = createDeepAgent(config);
  log.info("BullAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("BullAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
}

export async function argue(proposal: TradeProposal, risk: RiskVerdict): Promise<Argument> {
  log.info("BullAgent analyzing", { proposal_id: proposal.id });
  return {
    agent: "BULL",
    trade_id: proposal.id,
    thesis: `Stub bullish thesis for ${proposal.idea.symbol}`,
    evidence: ["Stub evidence item"],
    confidence: 0.6,
    target: proposal.model.entry_price * 1.02,
  };
}
