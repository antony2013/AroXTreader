import type { TradeProposal, RiskVerdict, Argument } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("bear-agent");

const SYSTEM_PROMPT = `You are the Bear Agent. Your role is to find every flaw, risk, and counter-argument against a trade proposal.
Analyze: overbought signals, resistance levels, macro headwinds, sector weakness, poor risk/reward.
Output a structured Argument with counter-thesis, risk list, confidence score, and worst-case scenario.`;

export async function start(): Promise<void> {
  log.info("BearAgent initializing with DeepAgents runtime");
  log.info("BearAgent started");
}

export async function argue(proposal: TradeProposal, risk: RiskVerdict): Promise<Argument> {
  log.info("BearAgent analyzing", { proposal_id: proposal.id });
  return {
    agent: "BEAR",
    trade_id: proposal.id,
    thesis: `Stub bearish thesis for ${proposal.idea.symbol}`,
    evidence: ["Stub risk item"],
    confidence: 0.4,
    risks: ["Overbought RSI", "Resistance cluster nearby"],
    worst_case: proposal.model.entry_price * 0.98,
  };
}
