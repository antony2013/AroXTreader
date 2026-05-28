import { Elysia, t } from "elysia";
import { formatAgentResponse } from "@aroxtrader/shared";
import { argue as bullArgue, invokeAgent as invokeBull } from "./agents/bull.agent.js";
import { argue as bearArgue, invokeAgent as invokeBear } from "./agents/bear.agent.js";
import { decide, invokeAgent as invokeJudge } from "./agents/judge.agent.js";

const chatHandlers: Record<string, (input: string) => Promise<unknown>> = {
  bull: invokeBull,
  bear: invokeBear,
  judge: invokeJudge,
};

export const debateChamberRoutes = new Elysia()
  .post("/debate/bull", async ({ body }) => bullArgue(body.proposal as any, body.risk as any), {
    body: t.Object({ proposal: t.Any(), risk: t.Any() }),
    response: t.Any(),
  })
  .post("/debate/bear", async ({ body }) => bearArgue(body.proposal as any, body.risk as any), {
    body: t.Object({ proposal: t.Any(), risk: t.Any() }),
    response: t.Any(),
  })
  .post("/debate/judge", async ({ body }) => decide(body.bull as any, body.bear as any, body.proposal as any), {
    body: t.Object({ bull: t.Any(), bear: t.Any(), proposal: t.Any() }),
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
