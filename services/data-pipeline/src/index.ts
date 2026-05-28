import { Elysia } from "elysia";
import { createLogger } from "@aroxtrader/shared";
import { dataPipelineRoutes } from "./routes.js";
import { start as startDataAgent, cacheTick } from "./agents/data.agent.js";
import { start as startNewsAgent, cacheNews } from "./agents/news.agent.js";
import { start as startRegimeAgent } from "./agents/regime.agent.js";
import { connect as connectWs, onTick, disconnect as disconnectWs } from "./integrations/upstox.ws.js";
import { startPolling as startNewsPolling, onNews, stop as stopNews } from "./integrations/news.providers.js";

const log = createLogger("data-pipeline");

await startDataAgent();
await startNewsAgent();
await startRegimeAgent();

onTick((tick) => {
  cacheTick(tick);
});

onNews((event) => {
  cacheNews(event);
});

const PORT = Number(process.env.PORT) || 3001;

const app = new Elysia()
  .use(dataPipelineRoutes)
  .get("/health", () => ({ status: "ok", service: "data-pipeline" }))
  .listen(PORT);

log.info(`Data Pipeline service running on port ${PORT}`);

// Connect to external data sources
connectWs(process.env.UPSTOX_ACCESS_TOKEN ?? "").catch((err) => log.error("WebSocket connect failed", err));
startNewsPolling().catch((err) => log.error("News polling start failed", err));

const shutdown = () => {
  disconnectWs();
  stopNews();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export type App = typeof app;
