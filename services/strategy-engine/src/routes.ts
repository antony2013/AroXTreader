import { Elysia, t } from "elysia";
import { analyze } from "./agents/analyst.agent.js";
import { model } from "./agents/quant.agent.js";
import { generate, listStrategies } from "./agents/coder.agent.js";

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
  });
