import { Elysia, t } from "elysia";
import { issueDirective } from "./agents/ceo.agent.js";
import { scoreTrade } from "./agents/evaluator.agent.js";
import { generateReport } from "./agents/reporting.agent.js";

export const governanceRoutes = new Elysia()
  .post("/evaluate/score", async ({ body }) => scoreTrade(body.trade_id, body.pnl, body.verdict_id), {
    body: t.Object({ trade_id: t.String(), pnl: t.Number(), verdict_id: t.String() }),
    response: t.Any(),
  })
  .post("/report/generate", ({ body }) => generateReport(body.period as "DAILY" | "WEEKLY"), {
    body: t.Object({ period: t.Union([t.Literal("DAILY"), t.Literal("WEEKLY")]) }),
    response: t.Any(),
  })
  .post("/ceo/directive", async ({ body }) => issueDirective(body.target_agent, body.action, body.reason), {
    body: t.Object({ target_agent: t.String(), action: t.String(), reason: t.String() }),
    response: t.Any(),
  })
  .post("/chat/:agent", ({ params, body }) => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`[${params.agent}] Stub response. `));
        controller.enqueue(encoder.encode("Live agent chat will be available with DeepAgent + Mem0 integration."));
        controller.close();
      },
    });
    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }, {
    params: t.Object({ agent: t.String() }),
    body: t.Object({ message: t.String() }),
  });
