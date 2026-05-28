import { Elysia, t } from "elysia";
import { formatAgentResponse, getLlmModel, setLlmConfig } from "@aroxtrader/shared";
import { issueDirective, invokeAgent as invokeCeo } from "./agents/ceo.agent.js";
import { scoreTrade, invokeAgent as invokeEvaluator } from "./agents/evaluator.agent.js";
import { generateReport, invokeAgent as invokeReporting } from "./agents/reporting.agent.js";

const localChatHandlers: Record<string, (input: string) => Promise<unknown>> = {
  ceo: invokeCeo,
  evaluator: invokeEvaluator,
  reporting: invokeReporting,
};

const AGENT_PORTS: Record<string, number> = {
  data: 3001, news: 3001, regime: 3001,
  analyst: 3002, quant: 3002, coder: 3002,
  risk: 3003, execution: 3003, positionmonitor: 3003, "position-monitor": 3003,
  bull: 3004, bear: 3004, judge: 3004,
};

export const governanceRoutes = new Elysia()
  .get("/config", () => ({ llmModel: getLlmModel(), llmBaseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434" }))
  .post("/config", ({ body }) => {
    if (body.llmModel) setLlmConfig({ llmModel: body.llmModel });
    return { ok: true, llmModel: getLlmModel() };
  }, {
    body: t.Object({ llmModel: t.Optional(t.String()) }),
    response: t.Any(),
  })
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
  .post("/chat/:agent", async ({ params, body }) => {
    const agentKey = params.agent.toLowerCase();
    // Local governance agents
    const localHandler = localChatHandlers[agentKey];
    if (localHandler) {
      try {
        const result = await localHandler(body.message);
        return new Response(formatAgentResponse(result), {
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      } catch (err) {
        return new Response(`Agent error: ${err instanceof Error ? err.message : String(err)}`, {
          status: 502,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    }
    // Proxy to other services
    const port = AGENT_PORTS[agentKey];
    if (!port) return new Response("Unknown agent", { status: 404 });
    try {
      const res = await fetch(`http://localhost:${port}/chat/${params.agent}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      return new Response(res.body, { status: res.status, headers: res.headers });
    } catch (err) {
      return new Response(`Proxy error: ${err instanceof Error ? err.message : String(err)}`, {
        status: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  }, {
    params: t.Object({ agent: t.String() }),
    body: t.Object({ message: t.String() }),
  });
