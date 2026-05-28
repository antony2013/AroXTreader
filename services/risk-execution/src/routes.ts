import { Elysia, t } from "elysia";
import { formatAgentResponse } from "@aroxtrader/shared";
import { validate, invokeAgent as invokeRisk } from "./agents/risk.agent.js";
import { executeTrade, invokeAgent as invokeExecution } from "./agents/execution.agent.js";
import { getPositions, invokeAgent as invokePosMon } from "./agents/position-monitor.agent.js";

const chatHandlers: Record<string, (input: string) => Promise<unknown>> = {
  risk: invokeRisk,
  execution: invokeExecution,
  positionmonitor: invokePosMon,
  "position-monitor": invokePosMon,
};

export const riskExecutionRoutes = new Elysia()
  .post("/risk/validate", ({ body }) => validate(body.proposal as any), {
    body: t.Object({ proposal: t.Any() }),
    response: t.Any(),
  })
  .post("/orders/place", async ({ body }) => {
    const order = await executeTrade(body.verdict as any, body.proposal as any);
    return order;
  }, {
    body: t.Object({ verdict: t.Any(), proposal: t.Any() }),
    response: t.Any(),
  })
  .get("/positions", () => getPositions(), {
    response: t.Array(t.Any()),
  })
  .post("/chat/:agent", async ({ params, body }) => {
    const handler = chatHandlers[params.agent.toLowerCase()];
    if (!handler) return new Response("Agent not found", { status: 404 });
    try {
      const result = await handler(body.message);
      return new Response(formatAgentResponse(result), {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    } catch (err) {
      return new Response(`Agent error: ${err instanceof Error ? err.message : String(err)}`, {
        status: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }, {
    params: t.Object({ agent: t.String() }),
    body: t.Object({ message: t.String() }),
  });
