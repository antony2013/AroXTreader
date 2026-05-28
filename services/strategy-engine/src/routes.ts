import { Elysia, t } from "elysia";
import { formatAgentResponse } from "@aroxtrader/shared";
import { analyze, invokeAgent as invokeAnalyst } from "./agents/analyst.agent.js";
import { model, invokeAgent as invokeQuant } from "./agents/quant.agent.js";
import { generate, listStrategies, invokeAgent as invokeCoder } from "./agents/coder.agent.js";

const chatHandlers: Record<string, (input: string) => Promise<unknown>> = {
  analyst: invokeAnalyst,
  quant: invokeQuant,
  coder: invokeCoder,
};

export const strategyEngineRoutes = new Elysia()
  .post("/ideas/generate", async ({ body }) => analyze(body.symbol), {
    body: t.Object({ symbol: t.String() }),
    response: t.Any(),
  })
  .post("/quant/model", async ({ body }) => model(body.idea as any), {
    body: t.Object({ idea: t.Any() }),
    response: t.Any(),
  })
  .get("/strategies", () => listStrategies(), {
    response: t.Array(t.Any()),
  })
  .post("/proposals", async ({ body }) => {
    const idea = await analyze(body.symbol);
    const quant = await model(idea);
    return { id: crypto.randomUUID(), idea, model: quant, strategy_id: "stub", timestamp: Date.now() };
  }, {
    body: t.Object({ symbol: t.String() }),
    response: t.Any(),
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
