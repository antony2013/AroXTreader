import { createLogger } from "@aroxtrader/shared";

const log = createLogger("jitrl");

interface AgentWeights {
  [agentName: string]: number;
}

const weights: AgentWeights = {
  bull: 1.0,
  bear: 1.0,
  judge: 1.0,
  analyst: 1.0,
  quant: 1.0,
};

export function getWeights(): AgentWeights {
  return { ...weights };
}

export function updateWeights(updates: Partial<AgentWeights>): void {
  for (const [agent, delta] of Object.entries(updates)) {
    if (delta !== undefined && weights[agent] !== undefined) {
      weights[agent] = Math.max(0.5, Math.min(2.0, weights[agent] + delta));
    }
  }
  log.info("JitRL weights updated", weights);
}

export async function start(): Promise<void> {
  log.info("JitRL optimizer initialized", weights);
}
