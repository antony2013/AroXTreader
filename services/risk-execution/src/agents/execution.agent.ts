import type { TradeProposal, Verdict, Order } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";
import { placeOrder } from "../integrations/upstox.rest.js";

const log = createLogger("execution-agent");

export const EXECUTION_AGENT_PROMPT = `You are the ExecutionAgent of AroXtrader. Your role is order execution via Upstox REST V3 (paper mode initially).
You receive approved trade verdicts from the Debate Chamber and place orders with precise parameters.
You have tools for: placing orders (LIMIT/MARKET), checking order status, pre-flight validation (slippage, price staleness), and managing order lifecycle.
You are the final mandatory gate — you perform a last pre-flight check before any order reaches the exchange.
In paper mode, you simulate fills at market prices without real capital at risk.`;

export async function start(): Promise<void> {
  log.info("ExecutionAgent initializing with DeepAgents runtime (paper mode)");
  log.info("ExecutionAgent started");
}

export async function executeTrade(verdict: Verdict, proposal: TradeProposal): Promise<Order> {
  if (verdict.action === "REJECT") {
    throw new Error("Cannot execute rejected trade");
  }

  const quantity = verdict.modifications?.size ?? 100;
  const price = verdict.modifications?.target ?? proposal.model.entry_price;

  log.info("Executing trade", { verdict_id: verdict.id, proposal_id: proposal.id });

  return placeOrder({
    symbol: proposal.idea.symbol,
    quantity,
    price,
    orderType: "LIMIT",
    product: "INTRADAY",
    transactionType: proposal.idea.direction === "LONG" ? "BUY" : "SELL",
  });
}
