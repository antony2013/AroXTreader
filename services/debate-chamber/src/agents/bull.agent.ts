import type { TradeProposal, RiskVerdict, Argument } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("bull-agent");

const SYSTEM_PROMPT = `You are the Bull Agent. Your role is to build the strongest possible bullish thesis for every trade proposal.
Analyze: momentum, institutional flows, technical patterns, macro tailwinds, and sentiment.
Output a structured Argument with thesis, evidence list, confidence score, and price target.`;

export async function start(): Promise<void> {
  log.info("BullAgent initializing with DeepAgents runtime");
  log.info("BullAgent started");
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
