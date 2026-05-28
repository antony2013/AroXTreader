import { Elysia, t } from "elysia";
import { validate } from "./agents/risk.agent.js";
import { executeTrade } from "./agents/execution.agent.js";
import { getPositions } from "./agents/position-monitor.agent.js";

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
  });
