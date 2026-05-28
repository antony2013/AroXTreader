import { Elysia, t } from "elysia";
import { formatAgentResponse } from "@aroxtrader/shared";
import { getTicks, invokeAgent as invokeData } from "./agents/data.agent.js";
import { getCurrentRegime, invokeAgent as invokeRegime } from "./agents/regime.agent.js";
import { getNews, getNewsForSymbol, invokeAgent as invokeNews } from "./agents/news.agent.js";

const chatHandlers: Record<string, (input: string) => Promise<unknown>> = {
  data: invokeData,
  news: invokeNews,
  regime: invokeRegime,
};

export const dataPipelineRoutes = new Elysia()
  .get("/market/ticks", () => getTicks(), {
    response: t.Array(t.Any()),
  })
  .get("/market/regime", () => getCurrentRegime(), {
    response: t.Any(),
  })
  .get("/news/feed", ({ query }) => {
    const symbol = query.symbol as string | undefined;
    return symbol ? getNewsForSymbol(symbol) : getNews();
  }, {
    query: t.Object({ symbol: t.Optional(t.String()) }),
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
