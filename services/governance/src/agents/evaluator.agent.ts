import type { TradeScore } from "@aroxtrader/shared";
import { createLogger, addMemory } from "@aroxtrader/shared";
import { createGovernanceAgentConfig } from "../deepagents/config.js";
import { updateWeights } from "../jitrl/optimizer.js";

const log = createLogger("evaluator-agent");

const SYSTEM_PROMPT = `You are the Evaluator Agent. Your role is to score every closed trade.
Attribute the P&L outcome to each agent's contribution: BullAgent (directional accuracy), BearAgent (risk flagging accuracy), JudgeAgent (verdict optimality).
Feed scores to JitRL for weight adjustment. Store lessons in Mem0.`;

let agent: any = null;

export async function start(): Promise<void> {
  log.info("EvaluatorAgent initializing with DeepAgents runtime + JitRL integration");
  const { createDeepAgent } = await import("deepagents");
  const config = await createGovernanceAgentConfig("EvaluatorAgent", SYSTEM_PROMPT);
  agent = createDeepAgent(config);
  log.info("EvaluatorAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("EvaluatorAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
}

export async function scoreTrade(
  tradeId: string,
  pnl: number,
  verdictId: string
): Promise<TradeScore> {
  const score: TradeScore = {
    trade_id: tradeId,
    pnl,
    attribution: {
      bull: pnl > 0 ? 0.4 : -0.2,
      bear: 0.3,
      judge: 0.1,
    },
    lessons: "Stub evaluation — pending DeepAgent integration",
  };

  updateWeights({
    bull: score.attribution.bull * 0.01,
    bear: score.attribution.bear * 0.01,
    judge: score.attribution.judge * 0.01,
  });

  // Persist to Mem0 for cross-agent learning
  addMemory(
    `Trade ${tradeId} closed with PnL ${pnl}. Attribution: Bull ${score.attribution.bull}, Bear ${score.attribution.bear}, Judge ${score.attribution.judge}.`,
    { agent_id: "EvaluatorAgent", metadata: { tradeId, pnl, attribution: score.attribution } }
  ).catch((err) => log.error("Mem0 store failed", err));

  log.info("Trade scored", { tradeId, pnl });
  return score;
}
