import { Elysia, t } from "elysia";
import { argue as bullArgue } from "./agents/bull.agent.js";
import { argue as bearArgue } from "./agents/bear.agent.js";
import { decide } from "./agents/judge.agent.js";

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
  });
