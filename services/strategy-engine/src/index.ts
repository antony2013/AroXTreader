import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { createLogger } from "@aroxtrader/shared";
import { strategyEngineRoutes } from "./routes.js";
import { start as startAnalyst } from "./agents/analyst.agent.js";
import { start as startQuant } from "./agents/quant.agent.js";
import { start as startCoder } from "./agents/coder.agent.js";

const log = createLogger("strategy-engine");

await startAnalyst();
await startQuant();
await startCoder();

const PORT = Number(process.env.PORT) || 3002;

const app = new Elysia()
  .use(cors())
  .use(strategyEngineRoutes)
  .get("/health", () => ({ status: "ok", service: "strategy-engine" }))
  .listen(PORT);

log.info(`Strategy Engine service running on port ${PORT}`);

const shutdown = () => {
  log.info("Shutting down strategy-engine");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export type App = typeof app;
