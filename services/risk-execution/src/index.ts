import { Elysia } from "elysia";
import { createLogger } from "@aroxtrader/shared";
import { riskExecutionRoutes } from "./routes.js";
import { start as startRisk } from "./agents/risk.agent.js";
import { start as startExecution } from "./agents/execution.agent.js";
import { start as startMonitor } from "./agents/position-monitor.agent.js";

const log = createLogger("risk-execution");

await startRisk();
await startExecution();
await startMonitor();

const PORT = Number(process.env.PORT) || 3003;

const app = new Elysia()
  .use(riskExecutionRoutes)
  .get("/health", () => ({ status: "ok", service: "risk-execution" }))
  .listen(PORT);

log.info(`Risk & Execution service running on port ${PORT}`);

const shutdown = () => {
  log.info("Shutting down risk-execution");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export type App = typeof app;
