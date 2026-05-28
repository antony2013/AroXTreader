import { Elysia } from "elysia";
import { createLogger } from "@aroxtrader/shared";
import { governanceRoutes } from "./routes.js";
import { start as startCeo } from "./agents/ceo.agent.js";
import { start as startEvaluator } from "./agents/evaluator.agent.js";
import { start as startReporting } from "./agents/reporting.agent.js";
import { start as startJitrl } from "./jitrl/optimizer.js";

const log = createLogger("governance");

await startCeo();
await startEvaluator();
await startReporting();
await startJitrl();

const PORT = Number(process.env.PORT) || 3005;

const app = new Elysia()
  .use(governanceRoutes)
  .get("/health", () => ({ status: "ok", service: "governance" }))
  .listen(PORT);

log.info(`Governance service running on port ${PORT}`);

const shutdown = () => {
  log.info("Shutting down governance");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export type App = typeof app;
