import type { QuantModel, TradeIdea } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("quant-agent");

export async function start(): Promise<void> {
  log.info("QuantAgent initializing with DeepAgents runtime");
  log.info("QuantAgent started");
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
