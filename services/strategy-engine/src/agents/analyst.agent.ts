import type { TradeIdea } from "@aroxtrader/shared";
import { createLogger, addMemory } from "@aroxtrader/shared";
import { createAgentConfig } from "../deepagents/config.js";

const log = createLogger("analyst-agent");

const SYSTEM_PROMPT = `You are an expert market analyst for Indian equities and F&O.
Your role: analyze market data, news, and regime to identify high-probability trade opportunities.
Output structured TradeIdea objects with symbol, direction, rationale, confidence, and timeframe.`;

let agent: any = null;

export async function start(): Promise<void> {
  log.info("AnalystAgent initializing with DeepAgents runtime");
  const { createDeepAgent } = await import("deepagents");
  const config = await createAgentConfig("AnalystAgent", SYSTEM_PROMPT);
  agent = createDeepAgent(config);
  log.info("AnalystAgent started");
}

export async function invokeAgent(input: string): Promise<unknown> {
  if (!agent) throw new Error("AnalystAgent not initialized");
  return agent.invoke({ messages: [{ role: "user", content: input }] });
}

export async function analyze(symbol: string): Promise<TradeIdea> {
  const idea: TradeIdea = {
    symbol,
    direction: "LONG",
    rationale: `Stub analysis for ${symbol} — pending DeepAgent integration`,
    confidence: 0.5,
    timeframe: "1D",
  };

  addMemory(
    `Trade idea for ${symbol}: ${idea.direction} with confidence ${idea.confidence}.`,
    { agent_id: "AnalystAgent", metadata: { symbol, direction: idea.direction, confidence: idea.confidence } }
  ).catch((err) => log.error("Mem0 store failed", err));

  log.info("Analyzing", { symbol });
  return idea;
}
