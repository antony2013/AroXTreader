import { Elysia } from "elysia";
import { createLogger } from "@aroxtrader/shared";
import { dataPipelineRoutes } from "./routes.js";
import { start as startDataAgent, cacheTick } from "./agents/data.agent.js";
import { start as startNewsAgent, cacheNews } from "./agents/news.agent.js";
import { start as startRegimeAgent } from "./agents/regime.agent.js";
import { connect as connectWs, onTick, disconnect as disconnectWs } from "./integrations/upstox.ws.js";
import { startPolling as startNewsPolling, onNews, stop as stopNews } from "./integrations/news.providers.js";

const log = createLogger("data-pipeline");

startDataAgent();
startNewsAgent();
startRegimeAgent();

onTick((tick) => {
  cacheTick(tick);
});

onNews((event) => {
  cacheNews(event);
});

const app = new Elysia()
  .use(dataPipelineRoutes)
  .get("/health", () => ({ status: "ok", service: "data-pipeline" }))
  .listen(3001);

log.info("Data Pipeline service running on port 3001");

// Connect to external data sources
connectWs(process.env.UPSTOX_ACCESS_TOKEN ?? "");
startNewsPolling();

process.on("SIGTERM", () => {
  disconnectWs();
  stopNews();
  process.exit(0);
});

export type App = typeof app;
