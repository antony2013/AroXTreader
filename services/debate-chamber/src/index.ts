import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { createLogger } from "@aroxtrader/shared";
import { debateChamberRoutes } from "./routes.js";
import { start as startBull } from "./agents/bull.agent.js";
import { start as startBear } from "./agents/bear.agent.js";
import { start as startJudge } from "./agents/judge.agent.js";

const log = createLogger("debate-chamber");

await startBull();
await startBear();
await startJudge();

const PORT = Number(process.env.PORT) || 3004;

const app = new Elysia()
  .use(cors())
  .use(debateChamberRoutes)
  .get("/health", () => ({ status: "ok", service: "debate-chamber" }))
  .listen(PORT);

log.info(`Debate Chamber service running on port ${PORT}`);

const shutdown = () => {
  log.info("Shutting down debate-chamber");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export type App = typeof app;
