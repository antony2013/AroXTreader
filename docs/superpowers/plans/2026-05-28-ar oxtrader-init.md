# AroXtrader — Project Initialization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize the AroXtrader monorepo with all 5 backend services, shared packages, SvelteKit dashboard, and infrastructure configuration as defined in the design spec.

**Architecture:** Bun monorepo with `packages/shared`, 5 ElysiaJS backend services (data-pipeline, strategy-engine, risk-execution, debate-chamber, governance), and a SvelteKit dashboard app. Services communicate via Eden type-safe HTTP. ALL 5 services and ALL 15 agents use DeepAgents TS runtime with subagent tool calling capabilities.

**Tech Stack:** Bun 1.x, TypeScript 5.x, ElysiaJS, DeepAgents TS (`deepagents` npm), Eden Treaty, SvelteKit, Tailwind CSS, Docker

---

### Task 1: Initialize Bun Monorepo Root

**Files:**
- Create: `D:\AroXtrader\package.json`
- Create: `D:\AroXtrader\tsconfig.base.json`
- Create: `D:\AroXtrader\.gitignore`

- [ ] **Step 1: Create root package.json with Bun workspaces**

```json
{
  "name": "ar oxtrader",
  "private": true,
  "workspaces": [
    "packages/*",
    "services/*",
    "apps/*"
  ],
  "devDependencies": {
    "typescript": "^5.7.0",
    "@types/bun": "latest"
  },
  "scripts": {
    "dev": "bun run scripts/dev.sh",
    "setup": "bun run scripts/setup.sh"
  }
}
```

- [ ] **Step 2: Create tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": ".",
    "types": ["bun-types"]
  },
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create .gitignore**

```gitignore
node_modules/
dist/
.env
.env.local
*.log
.superpowers/
.DS_Store
```

- [ ] **Step 4: Install dependencies**

Run: `cd D:\AroXtrader && bun install`
Expected: Creates `bun.lock` and `node_modules/`. No errors.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.base.json .gitignore bun.lock
git commit -m "feat: initialize Bun monorepo root with workspace configuration"
```

---

### Task 2: Create Shared Types Package

**Files:**
- Create: `D:\AroXtrader\packages\shared\package.json`
- Create: `D:\AroXtrader\packages\shared\tsconfig.json`
- Create: `D:\AroXtrader\packages\shared\src\types\market.ts`
- Create: `D:\AroXtrader\packages\shared\src\types\trading.ts`
- Create: `D:\AroXtrader\packages\shared\src\types\debate.ts`
- Create: `D:\AroXtrader\packages\shared\src\types\governance.ts`
- Create: `D:\AroXtrader\packages\shared\src\types\index.ts`
- Create: `D:\AroXtrader\packages\shared\src\index.ts`

- [ ] **Step 1: Create packages/shared/package.json**

```json
{
  "name": "@ar oxtrader/shared",
  "version": "0.0.1",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

- [ ] **Step 2: Create packages/shared/tsconfig.json**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create market types (MarketTick, NewsEvent, Regime)**

Write to `packages/shared/src/types/market.ts`:

```typescript
export interface MarketTick {
  symbol: string;
  ltp: number;
  volume: number;
  oi: number;
  bid: number;
  ask: number;
  timestamp: number;
}

export interface NewsEvent {
  source: string;
  headline: string;
  sentiment: "POSITIVE" | "NEGATIVE" | "NEUTRAL";
  symbols: string[];
  impact: "HIGH" | "MED" | "LOW";
  timestamp: number;
}

export type RegimeType = "TRENDING_UP" | "TRENDING_DOWN" | "RANGING" | "VOLATILE";

export interface Regime {
  type: RegimeType;
  confidence: number;
  vix: number;
  breadth: number;
  timestamp: number;
}
```

- [ ] **Step 4: Create trading types (TradeIdea, QuantModel, Strategy, TradeProposal, RiskVerdict)**

Write to `packages/shared/src/types/trading.ts`:

```typescript
export interface TradeIdea {
  symbol: string;
  direction: "LONG" | "SHORT";
  rationale: string;
  confidence: number;
  timeframe: string;
}

export interface QuantModel {
  entry_price: number;
  targets: number[];
  stoploss: number;
  risk_reward: number;
  probability: number;
}

export interface Strategy {
  id: string;
  name: string;
  code: string;
  params: Record<string, unknown>;
  backtest_result: Record<string, unknown>;
  status: "ACTIVE" | "PAUSED" | "DISABLED";
}

export interface TradeProposal {
  id: string;
  idea: TradeIdea;
  model: QuantModel;
  strategy_id: string;
  timestamp: number;
}

export interface RiskVerdict {
  approved: boolean;
  limits: {
    max_size: number;
    max_loss: number;
  };
  reason: string;
}
```

- [ ] **Step 5: Create debate types (Argument, Verdict)**

Write to `packages/shared/src/types/debate.ts`:

```typescript
export interface Argument {
  agent: "BULL" | "BEAR";
  thesis: string;
  evidence: string[];
  confidence: number;
  target?: number;
  risks?: string[];
  worst_case?: number;
}

export interface Verdict {
  id: string;
  trade_id: string;
  action: "APPROVE" | "REJECT" | "MODIFY";
  modifications?: {
    size?: number;
    stoploss?: number;
    target?: number;
  };
  reasoning: string;
  confidence: number;
  timestamp: number;
}
```

- [ ] **Step 6: Create governance types (Order, PositionUpdate, TradeScore, Report, Directive)**

Write to `packages/shared/src/types/governance.ts`:

```typescript
export interface Order {
  id: string;
  trade_id: string;
  symbol: string;
  quantity: number;
  price: number;
  type: "LIMIT" | "MARKET";
  product: "DELIVERY" | "INTRADAY";
  status: "PENDING" | "EXECUTED" | "CANCELLED" | "REJECTED";
  timestamp: number;
}

export interface PositionUpdate {
  order_id: string;
  pnl: number;
  m2m: number;
  unrealized: number;
  health: "HEALTHY" | "WARNING" | "CRITICAL";
  timestamp: number;
}

export interface TradeScore {
  trade_id: string;
  pnl: number;
  attribution: {
    bull: number;
    bear: number;
    judge: number;
  };
  lessons: string;
}

export interface Report {
  period: "DAILY" | "WEEKLY";
  pnl: number;
  trades: number;
  metrics: Record<string, number>;
  alerts: string[];
}

export interface Directive {
  target_agent: string;
  action: string;
  reason: string;
  timestamp: number;
}
```

- [ ] **Step 7: Create barrel exports**

Write to `packages/shared/src/types/index.ts`:

```typescript
export * from "./market.js";
export * from "./trading.js";
export * from "./debate.js";
export * from "./governance.js";
```

Write to `packages/shared/src/index.ts`:

```typescript
export * from "./types/index.js";
```

- [ ] **Step 8: Verify types compile**

Run: `cd D:\AroXtrader\packages\shared && bun run typecheck`
Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add packages/shared/
git commit -m "feat: add shared types package with market, trading, debate, and governance contracts"
```

---

### Task 3: Create Shared Eden Contracts

**Files:**
- Create: `D:\AroXtrader\packages\shared\src\contracts\data-pipeline.ts`
- Create: `D:\AroXtrader\packages\shared\src\contracts\strategy-engine.ts`
- Create: `D:\AroXtrader\packages\shared\src\contracts\risk-execution.ts`
- Create: `D:\AroXtrader\packages\shared\src\contracts\debate-chamber.ts`
- Create: `D:\AroXtrader\packages\shared\src\contracts\governance.ts`
- Create: `D:\AroXtrader\packages\shared\src\contracts\index.ts`
- Modify: `D:\AroXtrader\packages\shared\src\index.ts`

- [ ] **Step 1: Install Elysia and Eden as shared devDependencies**

Run: `cd D:\AroXtrader && bun add -D elysia @elysiajs/eden`
Then: `cd D:\AroXtrader\packages\shared && bun add elysia @elysiajs/eden`

- [ ] **Step 2: Create data-pipeline contract**

Write to `packages/shared/src/contracts/data-pipeline.ts`:

```typescript
import type { MarketTick, NewsEvent, Regime } from "../types/market.js";

/** Data Pipeline service API contract — all types used in route definitions */
export interface DataPipelineRoutes {
  "market/ticks": {
    GET: { response: MarketTick[] };
  };
  "market/regime": {
    GET: { response: Regime };
  };
  "news/feed": {
    GET: {
      query: { symbol?: string };
      response: NewsEvent[];
    };
  };
}
```

- [ ] **Step 3: Create strategy-engine contract**

Write to `packages/shared/src/contracts/strategy-engine.ts`:

```typescript
import type { TradeIdea, QuantModel, Strategy, TradeProposal } from "../types/trading.js";

export interface StrategyEngineRoutes {
  "ideas/generate": {
    POST: {
      body: { symbol: string };
      response: TradeIdea;
    };
  };
  "quant/model": {
    POST: {
      body: { idea: TradeIdea };
      response: QuantModel;
    };
  };
  "strategies": {
    GET: { response: Strategy[] };
  };
  "proposals": {
    POST: {
      body: { symbol: string };
      response: TradeProposal;
    };
  };
}
```

- [ ] **Step 4: Create risk-execution contract**

Write to `packages/shared/src/contracts/risk-execution.ts`:

```typescript
import type { TradeProposal, RiskVerdict } from "../types/trading.js";
import type { Order, PositionUpdate } from "../types/governance.js";
import type { Verdict } from "../types/debate.js";

export interface RiskExecutionRoutes {
  "risk/validate": {
    POST: {
      body: { proposal: TradeProposal };
      response: RiskVerdict;
    };
  };
  "orders/place": {
    POST: {
      body: { verdict: Verdict; proposal: TradeProposal };
      response: Order;
    };
  };
  "positions": {
    GET: { response: PositionUpdate[] };
  };
}
```

- [ ] **Step 5: Create debate-chamber contract**

Write to `packages/shared/src/contracts/debate-chamber.ts`:

```typescript
import type { TradeProposal, RiskVerdict } from "../types/trading.js";
import type { Argument, Verdict } from "../types/debate.js";

export interface DebateChamberRoutes {
  "debate/bull": {
    POST: {
      body: { proposal: TradeProposal; risk: RiskVerdict };
      response: Argument;
    };
  };
  "debate/bear": {
    POST: {
      body: { proposal: TradeProposal; risk: RiskVerdict };
      response: Argument;
    };
  };
  "debate/judge": {
    POST: {
      body: { bull: Argument; bear: Argument; proposal: TradeProposal };
      response: Verdict;
    };
  };
}
```

- [ ] **Step 6: Create governance contract**

Write to `packages/shared/src/contracts/governance.ts`:

```typescript
import type { Directive, Report, TradeScore } from "../types/governance.js";

export interface GovernanceRoutes {
  "evaluate/score": {
    POST: {
      body: { trade_id: string; pnl: number; verdict_id: string };
      response: TradeScore;
    };
  };
  "report/generate": {
    POST: {
      body: { period: "DAILY" | "WEEKLY" };
      response: Report;
    };
  };
  "ceo/directive": {
    POST: {
      body: { target_agent: string; action: string; reason: string };
      response: Directive;
    };
  };
  "chat/:agent": {
    POST: {
      body: { message: string };
      params: { agent: string };
      response: ReadableStream;
    };
  };
}
```

- [ ] **Step 7: Create contracts barrel export and update shared index**

Write to `packages/shared/src/contracts/index.ts`:

```typescript
export type { DataPipelineRoutes } from "./data-pipeline.js";
export type { StrategyEngineRoutes } from "./strategy-engine.js";
export type { RiskExecutionRoutes } from "./risk-execution.js";
export type { DebateChamberRoutes } from "./debate-chamber.js";
export type { GovernanceRoutes } from "./governance.js";
```

Prepend to `packages/shared/src/index.ts`:

```typescript
export * from "./contracts/index.js";
```

- [ ] **Step 8: Verify types compile**

Run: `cd D:\AroXtrader\packages\shared && bun run typecheck`
Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add packages/shared/
git commit -m "feat: add Eden API contracts for all 5 services"
```

---

### Task 4: Create Shared Utils

**Files:**
- Create: `D:\AroXtrader\packages\shared\src\utils\logger.ts`
- Create: `D:\AroXtrader\packages\shared\src\utils\validation.ts`
- Create: `D:\AroXtrader\packages\shared\src\utils\index.ts`
- Modify: `D:\AroXtrader\packages\shared\src\index.ts`

- [ ] **Step 1: Create structured logger**

Write to `packages/shared/src/utils/logger.ts`:

```typescript
const LOG_LEVELS = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 } as const;

type LogLevel = keyof typeof LOG_LEVELS;

function formatLog(level: LogLevel, service: string, message: string, data?: unknown): string {
  const ts = new Date().toISOString();
  const base = `[${ts}] [${level}] [${service}] ${message}`;
  if (data !== undefined) {
    return `${base} ${JSON.stringify(data)}`;
  }
  return base;
}

export function createLogger(service: string) {
  return {
    debug: (msg: string, data?: unknown) => console.log(formatLog("DEBUG", service, msg, data)),
    info: (msg: string, data?: unknown) => console.log(formatLog("INFO", service, msg, data)),
    warn: (msg: string, data?: unknown) => console.warn(formatLog("WARN", service, msg, data)),
    error: (msg: string, data?: unknown) => console.error(formatLog("ERROR", service, msg, data)),
  };
}

export type Logger = ReturnType<typeof createLogger>;
```

- [ ] **Step 2: Create validation helpers**

Write to `packages/shared/src/utils/validation.ts`:

```typescript
export function isValidPrice(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

export function isValidQuantity(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

export function isValidSymbol(symbol: string): boolean {
  return /^[A-Z0-9_-]+$/.test(symbol);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function assertNever(value: never, message: string): never {
  throw new Error(`${message}: ${JSON.stringify(value)}`);
}
```

- [ ] **Step 3: Create utils barrel export and update shared index**

Write to `packages/shared/src/utils/index.ts`:

```typescript
export { createLogger, type Logger } from "./logger.js";
export { isValidPrice, isValidQuantity, isValidSymbol, clamp, assertNever } from "./validation.js";
```

Append to `packages/shared/src/index.ts`:

```typescript
export * from "./utils/index.js";
```

- [ ] **Step 4: Verify types compile**

Run: `cd D:\AroXtrader\packages\shared && bun run typecheck`
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add packages/shared/
git commit -m "feat: add shared utilities — structured logger and validation helpers"
```

---

### Task 5: Create Data Pipeline Service Skeleton

**Files:**
- Create: `D:\AroXtrader\services\data-pipeline\package.json`
- Create: `D:\AroXtrader\services\data-pipeline\tsconfig.json`
- Create: `D:\AroXtrader\services\data-pipeline\src\index.ts`
- Create: `D:\AroXtrader\services\data-pipeline\src\routes.ts`
- Create: `D:\AroXtrader\services\data-pipeline\src\deepagents\config.ts`
- Create: `D:\AroXtrader\services\data-pipeline\src\agents\data.agent.ts`
- Create: `D:\AroXtrader\services\data-pipeline\src\agents\news.agent.ts`
- Create: `D:\AroXtrader\services\data-pipeline\src\agents\regime.agent.ts`
- Create: `D:\AroXtrader\services\data-pipeline\src\integrations\upstox.ws.ts`
- Create: `D:\AroXtrader\services\data-pipeline\src\integrations\news.providers.ts`

- [ ] **Step 1: Create service package.json**

Write to `services/data-pipeline/package.json`:

```json
{
  "name": "@ar oxtrader/data-pipeline",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "elysia": "latest",
    "deepagents": "latest",
    "@langchain/openai": "latest",
    "@ar oxtrader/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

- [ ] **Step 2: Create service tsconfig.json**

Write to `services/data-pipeline/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create DeepAgents configuration for data-pipeline agents**

Write to `services/data-pipeline/src/deepagents/config.ts`:

```typescript
import type { DeepAgentConfig } from "deepagents";

export async function createPipelineAgentConfig(
  systemPrompt: string,
  tools: DeepAgentConfig["tools"] = []
): Promise<DeepAgentConfig> {
  const { ChatOpenAI } = await import("@langchain/openai");

  return {
    model: new ChatOpenAI({
      model: process.env.LLM_MODEL ?? "gpt-4o",
      temperature: 0.1,
    }),
    systemPrompt,
    tools,
  };
}
```

- [ ] **Step 4: Create Upstox WebSocket integration stub**

Write to `services/data-pipeline/src/integrations/upstox.ws.ts`:

```typescript
import type { MarketTick } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("upstox-ws");

type TickHandler = (tick: MarketTick) => void;

let handlers: TickHandler[] = [];

export function onTick(handler: TickHandler) {
  handlers.push(handler);
}

export async function connect(accessToken: string): Promise<void> {
  log.info("Connecting to Upstox WebSocket V3...");
  // TODO: Implement actual WebSocket connection to wss://api.upstox.com/v3/market-feed
  // On message parse -> convert to MarketTick -> call handlers
  log.info("Upstox WebSocket connection established (stub)");
}

export function disconnect(): void {
  handlers = [];
  log.info("Upstox WebSocket disconnected");
}
```

- [ ] **Step 5: Create news providers integration stub**

Write to `services/data-pipeline/src/integrations/news.providers.ts`:

```typescript
import type { NewsEvent } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("news-providers");

type NewsHandler = (event: NewsEvent) => void;

let handlers: NewsHandler[] = [];

export function onNews(handler: NewsHandler) {
  handlers.push(handler);
}

export async function startPolling(): Promise<void> {
  log.info("Starting news feed polling...");
  // TODO: Implement actual RSS/API polling for financial news
  log.info("News feed polling started (stub)");
}

export function stop(): void {
  handlers = [];
  log.info("News feed polling stopped");
}
```

- [ ] **Step 6: Create DataAgent with DeepAgents system prompt**

Write to `services/data-pipeline/src/agents/data.agent.ts`:

```typescript
import type { MarketTick } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";
import { createPipelineAgentConfig } from "../deepagents/config.js";

const log = createLogger("data-agent");

export const DATA_AGENT_PROMPT = `You are the DataAgent of AroXtrader. Your role is real-time market data ingestion from Upstox WebSocket V3.
You receive raw price ticks and order book data, validate it, and route it to the appropriate consumers.
You have tools for: subscribing/unsubscribing to symbols, querying latest ticks, detecting price anomalies and volume spikes.
When you detect a breakout (price crossing key level) or volume spike (>2x 20-period avg), emit a trigger event.`;

const tickCache: MarketTick[] = [];
const MAX_CACHE = 1000;

export async function start(): Promise<void> {
  log.info("DataAgent initializing with DeepAgents runtime");
  // DeepAgent instance will be created with DATA_AGENT_PROMPT + market data tools
  log.info("DataAgent started");
}

export function cacheTick(tick: MarketTick): void {
  tickCache.push(tick);
  if (tickCache.length > MAX_CACHE) {
    tickCache.splice(0, tickCache.length - MAX_CACHE);
  }
}

export function getTicks(): MarketTick[] {
  return [...tickCache];
}

export function getTicksForSymbol(symbol: string): MarketTick[] {
  return tickCache.filter((t) => t.symbol === symbol);
}
```

- [ ] **Step 7: Create NewsAgent with DeepAgents system prompt**

Write to `services/data-pipeline/src/agents/news.agent.ts`:

```typescript
import type { NewsEvent } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("news-agent");

export const NEWS_AGENT_PROMPT = `You are the NewsAgent of AroXtrader. Your role is financial news aggregation and sentiment analysis.
You monitor RSS feeds, corporate announcements (NSE/BSE), FII/DII data, and economic calendars.
You have tools for: fetching news by symbol, classifying sentiment (POSITIVE/NEGATIVE/NEUTRAL), assessing impact (HIGH/MED/LOW).
When you detect material news (high impact on a tracked symbol), emit a trigger event to AnalystAgent.`;

const newsCache: NewsEvent[] = [];
const MAX_CACHE = 200;

export function start(): void {
  log.info("NewsAgent initialized with DeepAgents runtime");
}

export function cacheNews(event: NewsEvent): void {
  newsCache.push(event);
  if (newsCache.length > MAX_CACHE) {
    newsCache.splice(0, newsCache.length - MAX_CACHE);
  }
}

export function getNews(): NewsEvent[] {
  return [...newsCache];
}

export function getNewsForSymbol(symbol: string): NewsEvent[] {
  return newsCache.filter((n) => n.symbols.includes(symbol));
}
```

- [ ] **Step 8: Create RegimeAgent with DeepAgents system prompt**

Write to `services/data-pipeline/src/agents/regime.agent.ts`:

```typescript
import type { Regime } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("regime-agent");

export const REGIME_AGENT_PROMPT = `You are the RegimeAgent of AroXtrader. Your role is market regime classification.
You analyze VIX levels, market breadth (advance/decline), FII/DII flow data, and price action to classify the current regime as: TRENDING_UP, TRENDING_DOWN, RANGING, or VOLATILE.
You have tools for: computing breadth indicators, tracking VIX changes, monitoring institutional flow data.
When you detect a regime change, emit a trigger event — RiskAgent will adjust position limits accordingly.`;

let currentRegime: Regime = {
  type: "RANGING",
  confidence: 0.5,
  vix: 0,
  breadth: 0,
  timestamp: Date.now(),
};

export function start(): void {
  log.info("RegimeAgent initialized with DeepAgents runtime");
}

export function getCurrentRegime(): Regime {
  return { ...currentRegime };
}

export function updateRegime(update: Partial<Regime>): void {
  currentRegime = { ...currentRegime, ...update, timestamp: Date.now() };
  log.info("Regime updated", currentRegime);
}
```

- [ ] **Step 9: Create routes**

Write to `services/data-pipeline/src/routes.ts`:

```typescript
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
```

- [ ] **Step 10: Create service entry point**

Write to `services/data-pipeline/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { createLogger } from "@ar oxtrader/shared";
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
```

- [ ] **Step 11: Install dependencies and verify**

Run: `cd D:\AroXtrader && bun install`
Run: `cd D:\AroXtrader\services\data-pipeline && bun run typecheck`
Expected: No errors.

- [ ] **Step 12: Commit**

```bash
git add services/data-pipeline/
git commit -m "feat: add data-pipeline service with DeepAgents-powered DataAgent, NewsAgent, RegimeAgent, and Upstox WS stub"
```

---

### Task 6: Create Strategy Engine Service Skeleton

**Files:**
- Create: `D:\AroXtrader\services\strategy-engine\package.json`
- Create: `D:\AroXtrader\services\strategy-engine\tsconfig.json`
- Create: `D:\AroXtrader\services\strategy-engine\src\index.ts`
- Create: `D:\AroXtrader\services\strategy-engine\src\routes.ts`
- Create: `D:\AroXtrader\services\strategy-engine\src\agents\analyst.agent.ts`
- Create: `D:\AroXtrader\services\strategy-engine\src\agents\coder.agent.ts`
- Create: `D:\AroXtrader\services\strategy-engine\src\agents\quant.agent.ts`
- Create: `D:\AroXtrader\services\strategy-engine\src\deepagents\config.ts`

- [ ] **Step 1: Create service package.json**

Write to `services/strategy-engine/package.json`:

```json
{
  "name": "@ar oxtrader/strategy-engine",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "elysia": "latest",
    "deepagents": "latest",
    "@langchain/openai": "latest",
    "@ar oxtrader/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

- [ ] **Step 2: Create service tsconfig.json**

Write to `services/strategy-engine/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create DeepAgents configuration**

Write to `services/strategy-engine/src/deepagents/config.ts`:

```typescript
import type { DeepAgentConfig } from "deepagents";

/**
 * Shared DeepAgents configuration for strategy engine agents.
 * Each agent uses the same base model, then customizes tools and prompts.
 */
export function createAgentConfig(
  systemPrompt: string,
  tools: DeepAgentConfig["tools"] = []
): DeepAgentConfig {
  return {
    model: new (await import("@langchain/openai").then((m) => m.ChatOpenAI))({
      model: process.env.LLM_MODEL ?? "gpt-4o",
      temperature: 0.1,
    }),
    systemPrompt,
    tools,
  };
}
```

- [ ] **Step 4: Create AnalystAgent**

Write to `services/strategy-engine/src/agents/analyst.agent.ts`:

```typescript
import type { TradeIdea } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("analyst-agent");

const SYSTEM_PROMPT = `You are an expert market analyst for Indian equities and F&O.
Your role: analyze market data, news, and regime to identify high-probability trade opportunities.
Output structured TradeIdea objects with symbol, direction, rationale, confidence, and timeframe.`;

export function start(): void {
  log.info("AnalystAgent initialized with DeepAgents runtime");
}

export async function analyze(symbol: string): Promise<TradeIdea> {
  // TODO: Wire to DeepAgents `createDeepAgent(config)` with systemPrompt and market data tools
  // For now, return a stub for service skeleton
  log.info("Analyzing", { symbol });
  return {
    symbol,
    direction: "LONG",
    rationale: `Stub analysis for ${symbol} — pending DeepAgent integration`,
    confidence: 0.5,
    timeframe: "1D",
  };
}
```

- [ ] **Step 5: Create QuantAgent**

Write to `services/strategy-engine/src/agents/quant.agent.ts`:

```typescript
import type { QuantModel, TradeIdea } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("quant-agent");

export function start(): void {
  log.info("QuantAgent initialized with DeepAgents runtime");
}

export async function model(idea: TradeIdea): Promise<QuantModel> {
  log.info("Modeling", { idea });
  return {
    entry_price: 0,
    targets: [],
    stoploss: 0,
    risk_reward: 0,
    probability: 0.5,
  };
}
```

- [ ] **Step 6: Create CoderAgent**

Write to `services/strategy-engine/src/agents/coder.agent.ts`:

```typescript
import type { Strategy } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("coder-agent");

const strategies: Strategy[] = [];

export function start(): void {
  log.info("CoderAgent initialized with DeepAgents runtime + sandbox");
}

export async function generate(name: string, params: Record<string, unknown>): Promise<Strategy> {
  log.info("Generating strategy", { name, params });
  const strategy: Strategy = {
    id: crypto.randomUUID(),
    name,
    code: "// TODO: Generated strategy code",
    params,
    backtest_result: {},
    status: "PAUSED",
  };
  strategies.push(strategy);
  return strategy;
}

export function listStrategies(): Strategy[] {
  return [...strategies];
}
```

- [ ] **Step 7: Create routes**

Write to `services/strategy-engine/src/routes.ts`:

```typescript
import { Elysia, t } from "elysia";
import { analyze } from "./agents/analyst.agent.js";
import { model } from "./agents/quant.agent.js";
import { generate, listStrategies } from "./agents/coder.agent.js";

export const strategyEngineRoutes = new Elysia()
  .post("/ideas/generate", async ({ body }) => analyze(body.symbol), {
    body: t.Object({ symbol: t.String() }),
    response: t.Any(),
  })
  .post("/quant/model", async ({ body }) => model(body.idea as any), {
    body: t.Object({ idea: t.Any() }),
    response: t.Any(),
  })
  .get("/strategies", () => listStrategies(), {
    response: t.Array(t.Any()),
  })
  .post("/proposals", async ({ body }) => {
    const idea = await analyze(body.symbol);
    const quant = await model(idea);
    return { id: crypto.randomUUID(), idea, model: quant, strategy_id: "stub", timestamp: Date.now() };
  }, {
    body: t.Object({ symbol: t.String() }),
    response: t.Any(),
  });
```

- [ ] **Step 8: Create service entry point**

Write to `services/strategy-engine/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { createLogger } from "@ar oxtrader/shared";
import { strategyEngineRoutes } from "./routes.js";
import { start as startAnalyst } from "./agents/analyst.agent.js";
import { start as startQuant } from "./agents/quant.agent.js";
import { start as startCoder } from "./agents/coder.agent.js";

const log = createLogger("strategy-engine");

startAnalyst();
startQuant();
startCoder();

const app = new Elysia()
  .use(strategyEngineRoutes)
  .get("/health", () => ({ status: "ok", service: "strategy-engine" }))
  .listen(3002);

log.info("Strategy Engine service running on port 3002");

export type App = typeof app;
```

- [ ] **Step 9: Install dependencies and verify**

Run: `cd D:\AroXtrader && bun install`
Run: `cd D:\AroXtrader\services\strategy-engine && bun run typecheck`
Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add services/strategy-engine/
git commit -m "feat: add strategy-engine service with AnalystAgent, QuantAgent, CoderAgent and DeepAgents config"
```

---

### Task 7: Create Risk & Execution Service Skeleton

**Files:**
- Create: `D:\AroXtrader\services\risk-execution\package.json`
- Create: `D:\AroXtrader\services\risk-execution\tsconfig.json`
- Create: `D:\AroXtrader\services\risk-execution\src\index.ts`
- Create: `D:\AroXtrader\services\risk-execution\src\routes.ts`
- Create: `D:\AroXtrader\services\risk-execution\src\deepagents\config.ts`
- Create: `D:\AroXtrader\services\risk-execution\src\agents\risk.agent.ts`
- Create: `D:\AroXtrader\services\risk-execution\src\agents\execution.agent.ts`
- Create: `D:\AroXtrader\services\risk-execution\src\agents\position-monitor.agent.ts`
- Create: `D:\AroXtrader\services\risk-execution\src\integrations\upstox.rest.ts`

- [ ] **Step 1: Create service package.json**

Write to `services/risk-execution/package.json`:

```json
{
  "name": "@ar oxtrader/risk-execution",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "elysia": "latest",
    "deepagents": "latest",
    "@langchain/openai": "latest",
    "@ar oxtrader/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

- [ ] **Step 2: Create service tsconfig.json**

Write to `services/risk-execution/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create DeepAgents configuration for risk-execution agents**

Write to `services/risk-execution/src/deepagents/config.ts`:

```typescript
import type { DeepAgentConfig } from "deepagents";

export async function createRiskAgentConfig(
  systemPrompt: string,
  tools: DeepAgentConfig["tools"] = []
): Promise<DeepAgentConfig> {
  const { ChatOpenAI } = await import("@langchain/openai");

  return {
    model: new ChatOpenAI({
      model: process.env.LLM_MODEL ?? "gpt-4o",
      temperature: 0.0,
    }),
    systemPrompt,
    tools,
  };
}
```

- [ ] **Step 4: Create Upstox REST integration stub**

Write to `services/risk-execution/src/integrations/upstox.rest.ts`:

```typescript
import type { Order } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("upstox-rest");

export async function placeOrder(params: {
  symbol: string;
  quantity: number;
  price: number;
  orderType: "LIMIT" | "MARKET";
  product: "DELIVERY" | "INTRADAY";
}): Promise<Order> {
  log.info("Placing order via Upstox REST V3", params);
  // TODO: Implement actual Upstox REST API call to POST /v3/order/place
  return {
    id: crypto.randomUUID(),
    trade_id: crypto.randomUUID(),
    symbol: params.symbol,
    quantity: params.quantity,
    price: params.price,
    type: params.orderType,
    product: params.product,
    status: "PENDING",
    timestamp: Date.now(),
  };
}

export async function getPortfolio(): Promise<unknown> {
  // TODO: GET /v3/portfolio/short-term and /v3/portfolio/long-term
  return {};
}

export async function getFunds(): Promise<unknown> {
  // TODO: GET /v3/user/funds-margin
  return {};
}
```

- [ ] **Step 5: Create RiskAgent with DeepAgents system prompt**

Write to `services/risk-execution/src/agents/risk.agent.ts`:

```typescript
import type { TradeProposal, RiskVerdict } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("risk-agent");

export const RISK_AGENT_PROMPT = `You are the RiskAgent of AroXtrader. Your role is adaptive risk management.
You enforce hard risk limits (max position size, daily loss limit, margin utilization) and adjust them dynamically based on market regime from RegimeAgent.
You have tools for: computing position VaR, checking sector exposure, validating margin requirements, computing Greeks limits for F&O positions.
During TRENDING_UP regimes, you may relax position limits slightly. During VOLATILE regimes, you tighten all limits.
You are the first mandatory gate — if you reject a trade, it dies here with no appeal. If you approve, the trade proceeds to the Debate Chamber.
Rule: FAIL CLOSED. If you cannot validate, reject the trade.`;

interface RiskConfig {
  maxPositionSizePct: number;
  dailyLossLimit: number;
  maxSectorExposurePct: number;
}

const config: RiskConfig = {
  maxPositionSizePct: 2,
  dailyLossLimit: -50000,
  maxSectorExposurePct: 30,
};

let dailyPnl = 0;
let tradingFrozen = false;

export function start(): void {
  log.info("RiskAgent initialized with DeepAgents runtime for adaptive risk");
}

export function validate(proposal: TradeProposal): RiskVerdict {
  if (tradingFrozen) {
    return { approved: false, limits: { max_size: 0, max_loss: 0 }, reason: "Trading is frozen due to risk breach" };
  }

  if (dailyPnl < config.dailyLossLimit) {
    tradingFrozen = true;
    return { approved: false, limits: { max_size: config.maxPositionSizePct, max_loss: Math.abs(config.dailyLossLimit) }, reason: "Daily loss limit breached — trading frozen" };
  }

  return {
    approved: true,
    limits: { max_size: config.maxPositionSizePct, max_loss: Math.abs(config.dailyLossLimit) },
    reason: "All risk checks passed",
  };
}

export function isTradingFrozen(): boolean {
  return tradingFrozen;
}

export function unfreezeTrading(): void {
  tradingFrozen = false;
  dailyPnl = 0;
  log.info("Trading unfrozen by human override");
}

export function updateDailyPnl(pnl: number): void {
  dailyPnl += pnl;
}
```

- [ ] **Step 6: Create ExecutionAgent with DeepAgents system prompt**

Write to `services/risk-execution/src/agents/execution.agent.ts`:

```typescript
import type { TradeProposal, Verdict, Order } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";
import { placeOrder } from "../integrations/upstox.rest.js";

const log = createLogger("execution-agent");

export const EXECUTION_AGENT_PROMPT = `You are the ExecutionAgent of AroXtrader. Your role is order execution via Upstox REST V3 (paper mode initially).
You receive approved trade verdicts from the Debate Chamber and place orders with precise parameters.
You have tools for: placing orders (LIMIT/MARKET), checking order status, pre-flight validation (slippage, price staleness), and managing order lifecycle.
You are the final mandatory gate — you perform a last pre-flight check before any order reaches the exchange.
In paper mode, you simulate fills at market prices without real capital at risk.`;

export function start(): void {
  log.info("ExecutionAgent initialized with DeepAgents runtime (paper mode)");
}

export async function executeTrade(verdict: Verdict, proposal: TradeProposal): Promise<Order> {
  if (verdict.action === "REJECT") {
    throw new Error("Cannot execute rejected trade");
  }

  const quantity = verdict.modifications?.size ?? 100;
  const price = verdict.modifications?.target ?? proposal.model.entry_price;

  log.info("Executing trade", { verdict_id: verdict.id, proposal_id: proposal.id });

  return placeOrder({
    symbol: proposal.idea.symbol,
    quantity,
    price,
    orderType: "LIMIT",
    product: "INTRADAY",
  });
}
```

- [ ] **Step 7: Create PositionMonitorAgent with DeepAgents system prompt**

Write to `services/risk-execution/src/agents/position-monitor.agent.ts`:

```typescript
import type { Order, PositionUpdate } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("position-monitor");

export const POSITION_MONITOR_PROMPT = `You are the PositionMonitorAgent of AroXtrader. Your role is real-time position tracking and health monitoring.
You track every open position: unrealized P&L, mark-to-market, stop-loss distance, and health status (HEALTHY/WARNING/CRITICAL).
You have tools for: querying live position state, computing trailing stop-loss levels, detecting positions approaching stop-loss, and emitting alerts.
When a position hits its stop-loss or target, you notify ExecutionAgent to close it.
You are always on — circuit breakers never apply to your stop-loss enforcement.`;

const positions = new Map<string, PositionUpdate>();

export function start(): void {
  log.info("PositionMonitorAgent started");
}

export function trackPosition(order: Order): void {
  positions.set(order.trade_id, {
    order_id: order.id,
    pnl: 0,
    m2m: 0,
    unrealized: 0,
    health: "HEALTHY",
    timestamp: Date.now(),
  });
}

export function updatePosition(tradeId: string, update: Partial<PositionUpdate>): void {
  const existing = positions.get(tradeId);
  if (existing) {
    positions.set(tradeId, { ...existing, ...update, timestamp: Date.now() });
  }
}

export function getPositions(): PositionUpdate[] {
  return [...positions.values()];
}
```

- [ ] **Step 8: Create routes**

Write to `services/risk-execution/src/routes.ts`:

```typescript
import { Elysia, t } from "elysia";
import { validate } from "./agents/risk.agent.js";
import { executeTrade } from "./agents/execution.agent.js";
import { getPositions } from "./agents/position-monitor.agent.js";

export const riskExecutionRoutes = new Elysia()
  .post("/risk/validate", ({ body }) => validate(body.proposal as any), {
    body: t.Object({ proposal: t.Any() }),
    response: t.Any(),
  })
  .post("/orders/place", async ({ body }) => {
    const order = await executeTrade(body.verdict as any, body.proposal as any);
    return order;
  }, {
    body: t.Object({ verdict: t.Any(), proposal: t.Any() }),
    response: t.Any(),
  })
  .get("/positions", () => getPositions(), {
    response: t.Array(t.Any()),
  });
```

- [ ] **Step 9: Create service entry point**

Write to `services/risk-execution/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { createLogger } from "@ar oxtrader/shared";
import { riskExecutionRoutes } from "./routes.js";
import { start as startRisk } from "./agents/risk.agent.js";
import { start as startExecution } from "./agents/execution.agent.js";
import { start as startMonitor } from "./agents/position-monitor.agent.js";

const log = createLogger("risk-execution");

startRisk();
startExecution();
startMonitor();

const app = new Elysia()
  .use(riskExecutionRoutes)
  .get("/health", () => ({ status: "ok", service: "risk-execution" }))
  .listen(3003);

log.info("Risk & Execution service running on port 3003");

export type App = typeof app;
```

- [ ] **Step 10: Install dependencies and verify**

Run: `cd D:\AroXtrader && bun install`
Run: `cd D:\AroXtrader\services\risk-execution && bun run typecheck`
Expected: No errors.

- [ ] **Step 11: Commit**

```bash
git add services/risk-execution/
git commit -m "feat: add risk-execution service with DeepAgents-powered RiskAgent, ExecutionAgent, PositionMonitorAgent, and Upstox REST stub"
```

---

### Task 8: Create Debate Chamber Service Skeleton

**Files:**
- Create: `D:\AroXtrader\services\debate-chamber\package.json`
- Create: `D:\AroXtrader\services\debate-chamber\tsconfig.json`
- Create: `D:\AroXtrader\services\debate-chamber\src\index.ts`
- Create: `D:\AroXtrader\services\debate-chamber\src\routes.ts`
- Create: `D:\AroXtrader\services\debate-chamber\src\agents\bull.agent.ts`
- Create: `D:\AroXtrader\services\debate-chamber\src\agents\bear.agent.ts`
- Create: `D:\AroXtrader\services\debate-chamber\src\agents\judge.agent.ts`
- Create: `D:\AroXtrader\services\debate-chamber\src\deepagents\config.ts`

- [ ] **Step 1: Create service package.json**

Write to `services/debate-chamber/package.json`:

```json
{
  "name": "@ar oxtrader/debate-chamber",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "elysia": "latest",
    "deepagents": "latest",
    "@langchain/openai": "latest",
    "@ar oxtrader/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

- [ ] **Step 2: Create service tsconfig.json**

Write to `services/debate-chamber/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create DeepAgents configuration**

Write to `services/debate-chamber/src/deepagents/config.ts`:

```typescript
import type { DeepAgentConfig } from "deepagents";

export async function createDebateAgentConfig(
  systemPrompt: string
): Promise<DeepAgentConfig> {
  const { ChatOpenAI } = await import("@langchain/openai");

  return {
    model: new ChatOpenAI({
      model: process.env.LLM_MODEL ?? "gpt-4o",
      temperature: 0.3,
    }),
    systemPrompt,
    tools: [],
  };
}
```

- [ ] **Step 4: Create BullAgent**

Write to `services/debate-chamber/src/agents/bull.agent.ts`:

```typescript
import type { TradeProposal, RiskVerdict, Argument } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("bull-agent");

const SYSTEM_PROMPT = `You are the Bull Agent. Your role is to build the strongest possible bullish thesis for every trade proposal.
Analyze: momentum, institutional flows, technical patterns, macro tailwinds, and sentiment.
Output a structured Argument with thesis, evidence list, confidence score, and price target.`;

export function start(): void {
  log.info("BullAgent initialized with DeepAgents runtime");
}

export async function argue(proposal: TradeProposal, risk: RiskVerdict): Promise<Argument> {
  log.info("BullAgent analyzing", { proposal_id: proposal.id });
  // TODO: Wire to DeepAgent with SYSTEM_PROMPT
  return {
    agent: "BULL",
    thesis: `Stub bullish thesis for ${proposal.idea.symbol}`,
    evidence: ["Stub evidence item"],
    confidence: 0.6,
    target: proposal.model.entry_price * 1.02,
  };
}
```

- [ ] **Step 5: Create BearAgent**

Write to `services/debate-chamber/src/agents/bear.agent.ts`:

```typescript
import type { TradeProposal, RiskVerdict, Argument } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("bear-agent");

const SYSTEM_PROMPT = `You are the Bear Agent. Your role is to find every flaw, risk, and counter-argument against a trade proposal.
Analyze: overbought signals, resistance levels, macro headwinds, sector weakness, poor risk/reward.
Output a structured Argument with counter-thesis, risk list, confidence score, and worst-case scenario.`;

export function start(): void {
  log.info("BearAgent initialized with DeepAgents runtime");
}

export async function argue(proposal: TradeProposal, risk: RiskVerdict): Promise<Argument> {
  log.info("BearAgent analyzing", { proposal_id: proposal.id });
  return {
    agent: "BEAR",
    thesis: `Stub bearish thesis for ${proposal.idea.symbol}`,
    evidence: ["Stub risk item"],
    confidence: 0.4,
    risks: ["Overbought RSI", "Resistance cluster nearby"],
    worst_case: proposal.model.entry_price * 0.98,
  };
}
```

- [ ] **Step 6: Create JudgeAgent**

Write to `services/debate-chamber/src/agents/judge.agent.ts`:

```typescript
import type { TradeProposal, Argument, Verdict } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("judge-agent");

const SYSTEM_PROMPT = `You are the Judge Agent. Your role is to weigh the Bull and Bear arguments impartially and deliver a verdict.
Consider: argument quality, evidence strength, risk/reward, market context, and agent track records.
Output: APPROVE (trade proceeds), REJECT (trade dies), or MODIFY (adjust size/SL/target and resubmit to RiskAgent).`;

export function start(): void {
  log.info("JudgeAgent initialized with DeepAgents runtime");
}

export async function decide(
  bull: Argument,
  bear: Argument,
  proposal: TradeProposal
): Promise<Verdict> {
  log.info("JudgeAgent deliberating", { proposal_id: proposal.id });

  // Stub: approve if bull confidence > bear confidence
  const action = bull.confidence > bear.confidence ? "APPROVE" : "REJECT";

  return {
    id: crypto.randomUUID(),
    trade_id: proposal.id,
    action,
    reasoning: `Stub verdict: Bull(${bull.confidence}) vs Bear(${bear.confidence})`,
    confidence: Math.abs(bull.confidence - bear.confidence),
    timestamp: Date.now(),
  };
}
```

- [ ] **Step 7: Create routes**

Write to `services/debate-chamber/src/routes.ts`:

```typescript
import { Elysia, t } from "elysia";
import { argue as bullArgue } from "./agents/bull.agent.js";
import { argue as bearArgue } from "./agents/bear.agent.js";
import { decide } from "./agents/judge.agent.js";

export const debateChamberRoutes = new Elysia()
  .post("/debate/bull", async ({ body }) => bullArgue(body.proposal as any, body.risk as any), {
    body: t.Object({ proposal: t.Any(), risk: t.Any() }),
    response: t.Any(),
  })
  .post("/debate/bear", async ({ body }) => bearArgue(body.proposal as any, body.risk as any), {
    body: t.Object({ proposal: t.Any(), risk: t.Any() }),
    response: t.Any(),
  })
  .post("/debate/judge", async ({ body }) => decide(body.bull as any, body.bear as any, body.proposal as any), {
    body: t.Object({ bull: t.Any(), bear: t.Any(), proposal: t.Any() }),
    response: t.Any(),
  });
```

- [ ] **Step 8: Create service entry point**

Write to `services/debate-chamber/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { createLogger } from "@ar oxtrader/shared";
import { debateChamberRoutes } from "./routes.js";
import { start as startBull } from "./agents/bull.agent.js";
import { start as startBear } from "./agents/bear.agent.js";
import { start as startJudge } from "./agents/judge.agent.js";

const log = createLogger("debate-chamber");

startBull();
startBear();
startJudge();

const app = new Elysia()
  .use(debateChamberRoutes)
  .get("/health", () => ({ status: "ok", service: "debate-chamber" }))
  .listen(3004);

log.info("Debate Chamber service running on port 3004");

export type App = typeof app;
```

- [ ] **Step 9: Install dependencies and verify**

Run: `cd D:\AroXtrader && bun install`
Run: `cd D:\AroXtrader\services\debate-chamber && bun run typecheck`
Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add services/debate-chamber/
git commit -m "feat: add debate-chamber service with BullAgent, BearAgent, JudgeAgent and DeepAgents config"
```

---

### Task 9: Create Governance Service Skeleton

**Files:**
- Create: `D:\AroXtrader\services\governance\package.json`
- Create: `D:\AroXtrader\services\governance\tsconfig.json`
- Create: `D:\AroXtrader\services\governance\src\index.ts`
- Create: `D:\AroXtrader\services\governance\src\routes.ts`
- Create: `D:\AroXtrader\services\governance\src\agents\ceo.agent.ts`
- Create: `D:\AroXtrader\services\governance\src\agents\evaluator.agent.ts`
- Create: `D:\AroXtrader\services\governance\src\agents\reporting.agent.ts`
- Create: `D:\AroXtrader\services\governance\src\deepagents\config.ts`
- Create: `D:\AroXtrader\services\governance\src\jitrl\optimizer.ts`

- [ ] **Step 1: Create service package.json**

Write to `services/governance/package.json`:

```json
{
  "name": "@ar oxtrader/governance",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "elysia": "latest",
    "deepagents": "latest",
    "@langchain/openai": "latest",
    "@ar oxtrader/shared": "workspace:*"
  },
  "devDependencies": {
    "typescript": "workspace:*"
  }
}
```

- [ ] **Step 2: Create service tsconfig.json**

Write to `services/governance/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create DeepAgents configuration**

Write to `services/governance/src/deepagents/config.ts`:

```typescript
import type { DeepAgentConfig } from "deepagents";

export async function createGovernanceAgentConfig(
  systemPrompt: string,
  tools: DeepAgentConfig["tools"] = []
): Promise<DeepAgentConfig> {
  const { ChatOpenAI } = await import("@langchain/openai");

  return {
    model: new ChatOpenAI({
      model: process.env.LLM_MODEL ?? "gpt-4o",
      temperature: 0.1,
    }),
    systemPrompt,
    tools,
  };
}
```

- [ ] **Step 4: Create JitRL optimizer stub**

Write to `services/governance/src/jitrl/optimizer.ts`:

```typescript
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("jitrl");

interface AgentWeights {
  [agentName: string]: number;
}

const weights: AgentWeights = {
  bull: 1.0,
  bear: 1.0,
  judge: 1.0,
  analyst: 1.0,
  quant: 1.0,
};

export function getWeights(): AgentWeights {
  return { ...weights };
}

export function updateWeights(updates: Partial<AgentWeights>): void {
  for (const [agent, delta] of Object.entries(updates)) {
    if (weights[agent] !== undefined) {
      weights[agent] = Math.max(0.5, Math.min(2.0, weights[agent] + delta));
    }
  }
  log.info("JitRL weights updated", weights);
}

export function start(): void {
  log.info("JitRL optimizer initialized", weights);
}
```

- [ ] **Step 5: Create CEOAgent**

Write to `services/governance/src/agents/ceo.agent.ts`:

```typescript
import type { Directive } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("ceo-agent");

const SYSTEM_PROMPT = `You are the CEO Agent of AroXtrader, an autonomous trading company.
Your role: coordinate cross-service decisions, resolve deadlocks, and oversee the health of all 15 agents.
During pre-market bootstrap, load yesterday's context and brief all agents on the current portfolio state.`;

export function start(): void {
  log.info("CEOAgent initialized with DeepAgents runtime");
}

export async function bootstrap(): Promise<void> {
  log.info("CEOAgent running pre-market bootstrap");
  // TODO: Load Mem0 context, yesterday's Regime, Evaluator data, portfolio state
  // Brief all agents
}

export async function issueDirective(target_agent: string, action: string, reason: string): Promise<Directive> {
  return {
    target_agent,
    action,
    reason,
    timestamp: Date.now(),
  };
}
```

- [ ] **Step 6: Create EvaluatorAgent**

Write to `services/governance/src/agents/evaluator.agent.ts`:

```typescript
import type { TradeScore } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";
import { updateWeights } from "../jitrl/optimizer.js";

const log = createLogger("evaluator-agent");

const SYSTEM_PROMPT = `You are the Evaluator Agent. Your role is to score every closed trade.
Attribute the P&L outcome to each agent's contribution: BullAgent (directional accuracy), BearAgent (risk flagging accuracy), JudgeAgent (verdict optimality).
Feed scores to JitRL for weight adjustment. Store lessons in Mem0.`;

export function start(): void {
  log.info("EvaluatorAgent initialized with DeepAgents runtime + JitRL integration");
}

export async function scoreTrade(
  tradeId: string,
  pnl: number,
  verdictId: string
): Promise<TradeScore> {
  // Stub scoring with random attribution
  const score: TradeScore = {
    trade_id: tradeId,
    pnl,
    attribution: {
      bull: pnl > 0 ? 0.4 : -0.2,
      bear: 0.3,
      judge: 0.1,
    },
    lessons: "Stub evaluation — pending DeepAgent integration",
  };

  // Update JitRL weights based on attribution
  updateWeights({
    bull: score.attribution.bull * 0.01,
    bear: score.attribution.bear * 0.01,
    judge: score.attribution.judge * 0.01,
  });

  log.info("Trade scored", { tradeId, pnl });
  return score;
}
```

- [ ] **Step 7: Create ReportingAgent**

Write to `services/governance/src/agents/reporting.agent.ts`:

```typescript
import type { Report, TradeScore, PositionUpdate } from "@ar oxtrader/shared";
import { createLogger } from "@ar oxtrader/shared";

const log = createLogger("reporting-agent");

const tradeScores: TradeScore[] = [];
const positionUpdates: PositionUpdate[] = [];

export function start(): void {
  log.info("ReportingAgent initialized with DeepAgents runtime");
}

export function recordTradeScore(score: TradeScore): void {
  tradeScores.push(score);
}

export function recordPositionUpdate(update: PositionUpdate): void {
  positionUpdates.push(update);
}

export function generateReport(period: "DAILY" | "WEEKLY"): Report {
  const totalPnl = tradeScores.reduce((sum, s) => sum + s.pnl, 0);
  const alerts: string[] = [];

  if (totalPnl < 0) {
    alerts.push("Daily loss detected");
  }

  return {
    period,
    pnl: totalPnl,
    trades: tradeScores.length,
    metrics: { winRate: tradeScores.length > 0 ? tradeScores.filter((s) => s.pnl > 0).length / tradeScores.length : 0 },
    alerts,
  };
}
```

- [ ] **Step 8: Create routes (including agent chat endpoint)**

Write to `services/governance/src/routes.ts`:

```typescript
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
    // Stub: stream back a text response for the requested agent
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
```

- [ ] **Step 9: Create service entry point**

Write to `services/governance/src/index.ts`:

```typescript
import { Elysia } from "elysia";
import { createLogger } from "@ar oxtrader/shared";
import { governanceRoutes } from "./routes.js";
import { start as startCeo } from "./agents/ceo.agent.js";
import { start as startEvaluator } from "./agents/evaluator.agent.js";
import { start as startReporting } from "./agents/reporting.agent.js";
import { start as startJitrl } from "./jitrl/optimizer.js";

const log = createLogger("governance");

startCeo();
startEvaluator();
startReporting();
startJitrl();

const app = new Elysia()
  .use(governanceRoutes)
  .get("/health", () => ({ status: "ok", service: "governance" }))
  .listen(3005);

log.info("Governance service running on port 3005");

export type App = typeof app;
```

- [ ] **Step 10: Install dependencies and verify**

Run: `cd D:\AroXtrader && bun install`
Run: `cd D:\AroXtrader\services\governance && bun run typecheck`
Expected: No errors.

- [ ] **Step 11: Commit**

```bash
git add services/governance/
git commit -m "feat: add governance service with CEOAgent, EvaluatorAgent, ReportingAgent, JitRL optimizer, and agent chat endpoint"
```

---

### Task 10: Create SvelteKit Dashboard

**Files:**
- Create: `D:\AroXtrader\apps\dashboard\package.json`
- Create: `D:\AroXtrader\apps\dashboard\svelte.config.js`
- Create: `D:\AroXtrader\apps\dashboard\vite.config.ts`
- Create: `D:\AroXtrader\apps\dashboard\tsconfig.json`
- Create: `D:\AroXtrader\apps\dashboard\tailwind.config.ts`
- Create: `D:\AroXtrader\apps\dashboard\src\app.html`
- Create: `D:\AroXtrader\apps\dashboard\src\app.css`
- Create: `D:\AroXtrader\apps\dashboard\src\routes\+layout.svelte`
- Create: `D:\AroXtrader\apps\dashboard\src\routes\+page.svelte`
- Create: `D:\AroXtrader\apps\dashboard\src\lib\api\client.ts`
- Create: `D:\AroXtrader\apps\dashboard\src\lib\stores\market.svelte.ts`

- [ ] **Step 1: Create dashboard package.json**

Write to `apps/dashboard/package.json`:

```json
{
  "name": "@ar oxtrader/dashboard",
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite dev --port 5173",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "devDependencies": {
    "@sveltejs/kit": "latest",
    "@sveltejs/vite-plugin-svelte": "latest",
    "svelte": "latest",
    "svelte-check": "latest",
    "vite": "latest",
    "tailwindcss": "latest",
    "@tailwindcss/vite": "latest",
    "typescript": "workspace:*"
  },
  "dependencies": {
    "@ar oxtrader/shared": "workspace:*",
    "@elysiajs/eden": "latest"
  }
}
```

- [ ] **Step 2: Create SvelteKit config**

Write to `apps/dashboard/svelte.config.js`:

```javascript
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
};

export default config;
```

- [ ] **Step 3: Create Vite config with Tailwind**

Write to `apps/dashboard/vite.config.ts`:

```typescript
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

- [ ] **Step 4: Create dashboard tsconfig.json**

Write to `apps/dashboard/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "types": ["bun-types"]
  },
  "include": ["src"]
}
```

- [ ] **Step 5: Create Tailwind config**

Write to `apps/dashboard/tailwind.config.ts`:

```typescript
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        bull: "#16a34a",
        bear: "#dc2626",
        neutral: "#6b7280",
      },
    },
  },
} satisfies Config;
```

- [ ] **Step 6: Create app.html**

Write to `apps/dashboard/src/app.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AroXtrader</title>
    %sveltekit.head%
  </head>
  <body>
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

- [ ] **Step 7: Create app.css with Tailwind**

Write to `apps/dashboard/src/app.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 8: Create root layout**

Write to `apps/dashboard/src/routes/+layout.svelte`:

```svelte
<script>
  import "../app.css";
</script>

<div class="min-h-screen bg-gray-950 text-gray-100">
  <header class="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
    <h1 class="text-xl font-bold tracking-tight">AROXTR ADER</h1>
    <div class="flex items-center gap-4 text-sm">
      <span class="flex items-center gap-1">
        <span class="h-2 w-2 rounded-full bg-green-500"></span>
        PAPER MODE
      </span>
      <span class="text-gray-400">Regime: TRENDING ▲</span>
      <span class="text-gray-400">VIX: --</span>
    </div>
  </header>

  <main>
    {@render children?.()}
  </main>
</div>
```

- [ ] **Step 9: Create dashboard homepage**

Write to `apps/dashboard/src/routes/+page.svelte`:

```svelte
<script>
  let portfolioPnl = 0;
  let openPositions = 0;
  let winRate = 0;
  let agents = [
    "Data", "News", "Regime", "Analyst", "Coder", "Quant",
    "Risk", "Execution", "PosMon", "Bull", "Bear", "Judge",
    "CEO", "Eval", "Report",
  ];
</script>

<div class="grid grid-cols-2 gap-6 p-6">
  <!-- Portfolio Panel -->
  <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 class="text-lg font-semibold mb-4">PORTFOLIO</h2>
    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-gray-400">P&L Today</span>
        <span class={portfolioPnl >= 0 ? "text-green-400" : "text-red-400"}>
          ₹{portfolioPnl.toLocaleString()}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Open</span>
        <span>{openPositions}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Win Rate</span>
        <span>{winRate}%</span>
      </div>
    </div>
  </section>

  <!-- Live Activity -->
  <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 class="text-lg font-semibold mb-4">LIVE ACTIVITY</h2>
    <p class="text-gray-500 text-sm">No active trades. Service starting up...</p>
  </section>

  <!-- Strategies -->
  <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 class="text-lg font-semibold mb-4">STRATEGIES</h2>
    <p class="text-gray-500 text-sm">No strategies deployed yet.</p>
  </section>

  <!-- Agent Health -->
  <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 class="text-lg font-semibold mb-4">AGENT STATUS</h2>
    <div class="flex flex-wrap gap-2">
      {#each agents as agent}
        <span class="flex items-center gap-1 rounded bg-gray-800 px-2 py-1 text-xs">
          <span class="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
          {agent}
        </span>
      {/each}
    </div>
  </section>
</div>
```

- [ ] **Step 10: Create API client and market store**

Write to `apps/dashboard/src/lib/api/client.ts`:

```typescript
import { treaty } from "@elysiajs/eden";
import type { App as DataPipelineApp } from "../../../../services/data-pipeline/src/index";
import type { App as GovernanceApp } from "../../../../services/governance/src/index";

// Type-safe Eden clients — import server types directly in monorepo
// For production, use the shared contracts instead
const DATA_URL = "http://localhost:3001";
const GOVERNANCE_URL = "http://localhost:3005";

export const dataPipeline = { url: DATA_URL };
export const governance = { url: GOVERNANCE_URL };
```

Write to `apps/dashboard/src/lib/stores/market.svelte.ts`:

```typescript
import type { MarketTick, Regime } from "@ar oxtrader/shared";

export const marketState = $state<{
  ticks: MarketTick[];
  regime: Regime | null;
}>({
  ticks: [],
  regime: null,
});

export function updateTicks(ticks: MarketTick[]) {
  marketState.ticks = ticks;
}

export function updateRegime(regime: Regime) {
  marketState.regime = regime;
}
```

- [ ] **Step 11: Install dependencies and verify**

Run: `cd D:\AroXtrader && bun install`
Run: `cd D:\AroXtrader\apps\dashboard && bun run typecheck`
Expected: No errors. (May warn about adapter — acceptable for skeleton)

- [ ] **Step 12: Commit**

```bash
git add apps/dashboard/
git commit -m "feat: add SvelteKit dashboard with Tailwind, Eden client, and market stores"
```

---

### Task 11: Create Infrastructure Configuration

**Files:**
- Create: `D:\AroXtrader\infrastructure\docker\Dockerfile`
- Create: `D:\AroXtrader\infrastructure\docker\docker-compose.yml`
- Create: `D:\AroXtrader\infrastructure\mem0\config.yaml`
- Create: `D:\AroXtrader\.env.example`

- [ ] **Step 1: Create Dockerfile**

Write to `infrastructure/docker/Dockerfile`:

```dockerfile
FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY services ./services
COPY apps ./apps

RUN bun install --frozen-lockfile

EXPOSE 3001 3002 3003 3004 3005 5173

CMD ["bun", "run", "services/data-pipeline/src/index.ts"]
```

- [ ] **Step 2: Create docker-compose.yml**

Write to `infrastructure/docker/docker-compose.yml`:

```yaml
version: "3.9"

services:
  mem0:
    image: mem0/mem0:latest
    ports:
      - "8000:8000"
    volumes:
      - ../mem0/config.yaml:/app/config.yaml
    restart: unless-stopped

  data-pipeline:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - UPSTOX_ACCESS_TOKEN=${UPSTOX_ACCESS_TOKEN}
    depends_on:
      - mem0

  strategy-engine:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile
    ports:
      - "3002:3002"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - LLM_MODEL=${LLM_MODEL:-gpt-4o}
    depends_on:
      - mem0

  risk-execution:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile
    ports:
      - "3003:3003"
    environment:
      - UPSTOX_ACCESS_TOKEN=${UPSTOX_ACCESS_TOKEN}

  debate-chamber:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile
    ports:
      - "3004:3004"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - LLM_MODEL=${LLM_MODEL:-gpt-4o}
    depends_on:
      - mem0

  governance:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile
    ports:
      - "3005:3005"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - LLM_MODEL=${LLM_MODEL:-gpt-4o}
    depends_on:
      - mem0

  dashboard:
    build:
      context: ../..
      dockerfile: infrastructure/docker/Dockerfile
    ports:
      - "5173:5173"
    command: ["bun", "run", "--cwd", "apps/dashboard", "dev", "--host", "0.0.0.0"]
```

- [ ] **Step 3: Create Mem0 config**

Write to `infrastructure/mem0/config.yaml`:

```yaml
version: "0.1"

vector_store:
  provider: qdrant
  config:
    host: localhost
    port: 6333

llm:
  provider: openai
  config:
    model: gpt-4o

embedder:
  provider: openai
  config:
    model: text-embedding-3-small

history_db:
  provider: sqlite
  config:
    path: /data/mem0.db
```

- [ ] **Step 4: Create .env.example**

Write to `.env.example`:

```bash
# Upstox
UPSTOX_ACCESS_TOKEN=your_access_token_here
UPSTOX_API_KEY=your_api_key_here
UPSTOX_API_SECRET=your_api_secret_here

# LLM (OpenAI-compatible)
OPENAI_API_KEY=sk-...
LLM_MODEL=gpt-4o

# Mem0
MEM0_API_URL=http://localhost:8000

# Application
NODE_ENV=development
TRADING_MODE=paper
```

- [ ] **Step 5: Commit**

```bash
git add infrastructure/ .env.example
git commit -m "feat: add Docker, docker-compose, Mem0 config, and environment template"
```

---

### Task 12: Create Dev Scripts

**Files:**
- Create: `D:\AroXtrader\scripts\dev.sh`
- Create: `D:\AroXtrader\scripts\setup.sh`

- [ ] **Step 1: Create dev script**

Write to `scripts/dev.sh`:

```bash
#!/usr/bin/env bash
set -e

echo "=== AroXtrader Development ==="

# Start all 5 backend services in parallel
bun run --watch services/data-pipeline/src/index.ts &
PID1=$!
bun run --watch services/strategy-engine/src/index.ts &
PID2=$!
bun run --watch services/risk-execution/src/index.ts &
PID3=$!
bun run --watch services/debate-chamber/src/index.ts &
PID4=$!
bun run --watch services/governance/src/index.ts &
PID5=$!

# Start dashboard
bun run --cwd apps/dashboard dev &
PID6=$!

echo "All services started"
echo "  data-pipeline:  http://localhost:3001"
echo "  strategy-engine: http://localhost:3002"
echo "  risk-execution:  http://localhost:3003"
echo "  debate-chamber:  http://localhost:3004"
echo "  governance:      http://localhost:3005"
echo "  dashboard:       http://localhost:5173"

# Wait for all
trap "kill $PID1 $PID2 $PID3 $PID4 $PID5 $PID6 2>/dev/null" EXIT
wait
```

- [ ] **Step 2: Create setup script**

Write to `scripts/setup.sh`:

```bash
#!/usr/bin/env bash
set -e

echo "=== AroXtrader Setup ==="

echo "Installing dependencies..."
bun install

echo "Running type checks..."
cd packages/shared && bun run typecheck
cd ../../services/data-pipeline && bun run typecheck
cd ../../services/strategy-engine && bun run typecheck
cd ../../services/risk-execution && bun run typecheck
cd ../../services/debate-chamber && bun run typecheck
cd ../../services/governance && bun run typecheck
cd ../../apps/dashboard && bun run typecheck
cd ../..

echo ""
echo "Setup complete!"
echo "Run 'bun run dev' to start all services."
```

- [ ] **Step 3: Make scripts executable (on Windows, git tracks permissions)**

Run: `chmod +x D:\AroXtrader\scripts\dev.sh D:\AroXtrader\scripts\setup.sh`

- [ ] **Step 4: Commit**

```bash
git add scripts/
git commit -m "feat: add dev and setup scripts for full-stack development"
```

---

### Final Verification

- [ ] **Step 1: Run full install**

Run: `cd D:\AroXtrader && bun install`
Expected: All workspace packages linked, no errors.

- [ ] **Step 2: Run all type checks**

Run: `cd D:\AroXtrader && bash scripts/setup.sh`
Expected: All 7 packages pass typecheck.

- [ ] **Step 3: Verify git status**

Run: `git status`
Expected: Clean working tree, all files committed.

---

**Plan complete.** All 12 tasks create a fully typed, compilable monorepo skeleton matching the design spec.
