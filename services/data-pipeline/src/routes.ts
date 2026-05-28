import { Elysia, t } from "elysia";
import { getTicks } from "./agents/data.agent.js";
import { getCurrentRegime } from "./agents/regime.agent.js";
import { getNews, getNewsForSymbol } from "./agents/news.agent.js";

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
  });
