# AroXtrader — Autonomous Trading Company Design Spec

**Date:** 2026-05-28
**Status:** Approved
**Stack:** Bun.js, ElysiaJS, DeepAgents (TS), Mem0, JitRL, Upstox API, SvelteKit, Tailwind

---

## 1. Overview

AroXtrader is a fully autonomous trading company powered by 15 AI agents organized into 5 services. The system researches, debates, and executes trades on NSE/BSE Equities & F&O with adaptive risk management and test-time learning. Human involvement is limited to exception oversight.

**Core Principle:** The system trades autonomously. Humans watch, not operate. Intervention only on explicit exception triggers.

### 15 Agents

| # | Agent | Service | Role |
|---|-------|---------|------|
| 1 | DataAgent | data-pipeline | Real-time market data ingestion via Upstox WS V3 |
| 2 | NewsAgent | data-pipeline | Financial news, sentiment, corporate announcements |
| 3 | RegimeAgent | data-pipeline | Market regime classification (trending/ranging/volatile) |
| 4 | AnalystAgent | strategy-engine | Opportunity identification and trade idea generation |
| 5 | CoderAgent | strategy-engine | Autonomous strategy code generation, backtesting, optimization |
| 6 | QuantAgent | strategy-engine | Mathematical modeling, entry/exit/target/sl computation |
| 7 | RiskAgent | risk-execution | Adaptive risk validation with regime-aware limits |
| 8 | ExecutionAgent | risk-execution | Order placement via Upstox REST V3 (paper mode initially) |
| 9 | PositionMonitorAgent | risk-execution | Real-time position tracking, P&L, stop-loss monitoring |
| 10 | BullAgent | debate-chamber | Argues FOR every trade proposal |
| 11 | BearAgent | debate-chamber | Argues AGAINST every trade proposal |
| 12 | JudgeAgent | debate-chamber | Weighs both arguments, outputs APPROVE/REJECT/MODIFY |
| 13 | CEOAgent | governance | Cross-service coordination, deadlock resolution, pre-market briefing |
| 14 | EvaluatorAgent | governance | Post-trade scoring, agent attribution, JitRL weight updates |
| 15 | ReportingAgent | governance | Daily/weekly reports, exception alerts to human |

---

## 2. Architecture

### 2.1 Service Map (Approach B — Grouped ElysiaJS Services)

```
┌──────────────────────┐
│  ① Data Pipeline     │  DeepAgents Runtime
│  Port 3001           │
│  DataAgent           │  Upstox WS V3, News APIs, NSE/BSE feeds
│  NewsAgent           │  Produces: MarketTick, NewsEvent, Regime
│  RegimeAgent         │
└──────────┬───────────┘
           │  Eden type-safe HTTP
           ▼
┌──────────────────────┐
│  ② Strategy Engine   │  DeepAgents Runtime
│  Port 3002           │
│  AnalystAgent        │  AI reasoning for opportunity identification
│  CoderAgent          │  Code generation + sandboxed backtesting
│  QuantAgent          │  Mathematical modeling, Greeks, risk/reward
└──────────┬───────────┘
           │  TradeProposal
           ▼
┌──────────────────────┐
│  ③ Risk & Execution  │  DeepAgents Runtime
│  Port 3003           │
│  RiskAgent           │  Adaptive risk (regime-aware limits)
│  ExecutionAgent      │  Upstox REST V3 integration
│  PositionMonitorAgent│  Real-time P&L, stop-loss enforcement
└──────────┬───────────┘
           │  Risk-approved TradeProposal
           ▼
┌──────────────────────┐
│  ④ Debate Chamber    │  DeepAgents Runtime
│  Port 3004           │
│  BullAgent           │  Mandatory debate for EVERY trade
│  BearAgent           │  Output: APPROVE / REJECT / MODIFY
│  JudgeAgent          │  MODIFY → returns to RiskAgent for re-validation
└──────────┬───────────┘
           │  Verdict
           ▼
┌──────────────────────┐
│  ⑤ Governance        │  DeepAgents Runtime
│  Port 3005           │
│  CEOAgent            │  Cross-service coordination, pre-market bootstrap
│  EvaluatorAgent      │  Trade scoring → JitRL weight updates
│  ReportingAgent      │  Reports, human escalation alerts
└──────────────────────┘

Communication:
  ① ↔ ② : Mesh (Data pushes, Strategy pulls)
  ② → ③ : Trade proposals
  ③ → ④ : Risk-approved proposals
  ④ → ③ : Judge verdict → Execution
  ⑤ ↔ ALL: CEO coordinates, Evaluator collects outcomes
```

### 2.2 Communication Pattern (Hybrid — Option C)

- **Input/Analysis layers:** Mesh communication. DataPipeline and StrategyEngine freely exchange data. Data pushes market events; Strategy pulls what it needs.
- **Decision pipeline:** Strict sequential. TradeProposal → Risk → Debate → Execution. No shortcuts.
- **Governance overlay:** CEOAgent monitors all services, coordinates on exceptions. Evaluator collects outcomes from Execution and PositionMonitor. Reporting pushes alerts to human.

### 2.3 Technology Assignments

| Technology | Where Used | Purpose |
|------------|-----------|---------|
| Bun.js | All services | Runtime, package manager, test runner |
| ElysiaJS | All services | HTTP framework, routing, middleware |
| Eden | Cross-service | Type-safe API contracts between all 5 services |
| DeepAgents TS | All 5 services, all 15 agents | AI agent runtime with tool definitions, subagent tool calling, state management, Mem0 backend |
| Mem0 (self-hosted) | All DeepAgents services | Long-term shared memory, trade history, patterns, agent weights |
| JitRL | Governance (Evaluator) | Test-time RL — adjusts agent decision weights per trade outcome |
| Upstox WS V3 | Data Pipeline | Real-time price ticks, order book |
| Upstox REST V3 | Risk & Execution | Order placement, portfolio, funds |
| SvelteKit + Tailwind | Frontend | Oversight dashboard, agent chat terminal |
| Docker | Infrastructure | Containerized services, docker-compose orchestration |

---

## 3. Trade Lifecycle

### 3.1 The 6-Stage Pipeline

```
STAGE 1: SIGNAL
  DataAgent detects: price breakout / volume spike / material news
  RegimeAgent provides: current market regime classification
  → Emits trigger event

STAGE 2: STRATEGY
  AnalystAgent: identifies trade opportunity, writes rationale
  QuantAgent: models entry/exit/target/stoploss mathematically
  CoderAgent: generates/selects strategy, provides backtest context
  → Outputs TradeProposal

STAGE 3: RISK 🔒 (Mandatory Gate)
  RiskAgent validates:
    - Position size ≤ adaptive max (regime-adjusted)
    - Stop-loss defined and within limits
    - Portfolio-level checks (VaR, sector exposure, margin, Greeks for F&O)
    - Daily loss limit not breached
  → REJECT (dies here, no appeal) or APPROVED (proceeds to debate)

STAGE 4: DEBATE 🔒 (Mandatory Gate)
  BullAgent: presents bullish thesis with evidence
  BearAgent: presents bearish counter-thesis with risks
  JudgeAgent: weighs both → APPROVE / REJECT / MODIFY
  MODIFY → returns to RiskAgent for re-validation
  REJECT → trade dies, logged to Mem0

STAGE 5: EXECUTION 🔒 (Mandatory Gate)
  ExecutionAgent: final pre-flight check
    - Price unchanged beyond slippage threshold?
    - Order parameters valid?
  → Places paper order via Upstox REST V3
  PositionMonitor: begins tracking

STAGE 6: EVALUATION
  On trade close:
    EvaluatorAgent scores each agent's contribution:
      - BullAgent: was direction right? magnitude?
      - BearAgent: were flagged risks valid?
      - JudgeAgent: was the verdict optimal?
    → JitRL adjusts agent decision weights
    → Mem0 stores trade record + extracted pattern
```

### 3.2 Trigger Events

| Event | Source | Action |
|-------|--------|--------|
| `price.breakout` | DataAgent (WS) | Price crosses key level → AnalystAgent wakes |
| `volume.spike` | DataAgent (WS) | Volume > 2x 20-period avg → QuantAgent checks |
| `news.material` | NewsAgent | High-impact headline → AnalystAgent re-evaluates |
| `regime.change` | RegimeAgent | Market regime shifts → RiskAgent adjusts limits |
| `strategy.signal` | CoderAgent | Generated strategy emits signal → full pipeline |
| `eod.scheduled` | System clock | End of day → ReportingAgent + EvaluatorAgent |

---

## 4. State & Memory

### 4.1 Data Contracts

Every agent has typed input/output contracts defined in `packages/shared/src/types/`. These serve as the Eden API boundaries between services.

| Agent | Produces | Consumes |
|-------|----------|----------|
| DataAgent | `MarketTick { symbol, ltp, volume, oi, bid, ask }` | Upstox WS |
| NewsAgent | `NewsEvent { source, headline, sentiment, symbols[], impact }` | News APIs, NSE feeds |
| RegimeAgent | `Regime { type, confidence, vix, breadth }` | MarketTick[], FII/DII data |
| AnalystAgent | `TradeIdea { symbol, direction, rationale, confidence, timeframe }` | MarketTick, NewsEvent, Regime |
| QuantAgent | `QuantModel { entry_price, targets[], stoploss, risk_reward, probability }` | TradeIdea, MarketTick |
| CoderAgent | `Strategy { id, code, backtest_result, params, status }` | TradeIdea, QuantModel, Evaluator feedback |
| RiskAgent | `RiskVerdict { approved, limits, reason }` | TradeProposal, Regime, Portfolio |
| BullAgent | `Argument { thesis, evidence[], confidence, target }` | TradeProposal (risk-approved) |
| BearAgent | `Argument { counter_thesis, risks[], confidence, worst_case }` | TradeProposal (risk-approved) |
| JudgeAgent | `Verdict { action, modifications?, reasoning }` | Bull.Argument + Bear.Argument |
| ExecutionAgent | `Order { id, symbol, qty, type, price, status }` | Verdict (APPROVED), Upstox API |
| PositionMonitor | `PositionUpdate { order_id, pnl, m2m, unrealized, health }` | Order[], MarketTick |
| EvaluatorAgent | `TradeScore { trade_id, pnl, attribution, lessons }` | PositionUpdate (closed), Verdict |
| ReportingAgent | `Report { period, pnl, trades[], metrics, alerts[] }` | TradeScore[], PositionUpdate[] |
| CEOAgent | `Directive { target_agent, action, reason }` | All system state, exception events |

### 4.2 Mem0 Schema

Mem0 runs self-hosted. DeepAgents services connect to it for persistent memory.

| Memory Type | Key Pattern | Content | Consumers |
|------------|-------------|---------|-----------|
| Trade History | `trade:{id}` | Full trade: signal→debate→execution→pnl | Evaluator, Analyst, JitRL |
| Market Patterns | `pattern:{hash}` | Price/volume/regime pattern + outcome | Analyst, Quant |
| Agent Weights | `weights:{agent}` | JitRL-adjusted decision weights per agent | JitRL, Judge |
| Strategy Library | `strategy:{id}` | Code, backtest, live performance | Coder, Evaluator |
| Market Regimes | `regime:{date}` | Daily/weekly classification + stats | Regime, Risk |
| News Corpus | `news:{hash}` | Processed news + sentiment + impact | News, Analyst |
| Exception Log | `exception:{id}` | Alert + resolution record | CEO, Reporting |

### 4.3 JitRL Feedback Loop

```
Trade Closed → Evaluator scores attribution per agent
  → JitRL adjusts decision weights (no full retrain)
  → Weights applied to next debate
  → Mem0 persists updated weights

Attribution Example:
  BullAgent: +0.4 (right direction, wrong magnitude)
  BearAgent: +0.6 (correctly flagged RSI risk)
  JudgeAgent: +0.2 (reasonable compromise)
  → Next similar setup: Bear's RSI concerns get more weight
```

---

## 5. Project Structure

```
ar oxtrader/
├── package.json                 # Bun workspace root
├── tsconfig.base.json
├── bun.lock
│
├── packages/
│   └── shared/                  # Shared types, utils, Eden contracts
│       ├── src/
│       │   ├── types/           # All data contracts
│       │   ├── contracts/       # Eden Treaty type-safe API contracts
│       │   ├── utils/
│       │   └── index.ts
│       └── package.json
│
├── services/
│   ├── data-pipeline/           # ① Plain ElysiaJS — port 3001
│   │   ├── src/
│   │   │   ├── agents/          # data.agent.ts, news.agent.ts, regime.agent.ts
│   │   │   ├── integrations/    # upstox.ws.ts, news.providers.ts
│   │   │   ├── index.ts
│   │   │   └── routes.ts
│   │   └── package.json
│   │
│   ├── strategy-engine/         # ② DeepAgents — port 3002
│   │   ├── src/
│   │   │   ├── agents/          # analyst.agent.ts, coder.agent.ts, quant.agent.ts
│   │   │   ├── deepagents/      # config.ts (agent definitions, tools, prompts)
│   │   │   ├── sandbox/         # Isolated backtest execution for CoderAgent
│   │   │   ├── index.ts
│   │   │   └── routes.ts
│   │   └── package.json
│   │
│   ├── risk-execution/          # ③ Plain ElysiaJS — port 3003
│   │   ├── src/
│   │   │   ├── agents/          # risk.agent.ts, execution.agent.ts, position-monitor.agent.ts
│   │   │   ├── integrations/    # upstox.rest.ts
│   │   │   ├── index.ts
│   │   │   └── routes.ts
│   │   └── package.json
│   │
│   ├── debate-chamber/          # ④ DeepAgents — port 3004
│   │   ├── src/
│   │   │   ├── agents/          # bull.agent.ts, bear.agent.ts, judge.agent.ts
│   │   │   ├── deepagents/      # config.ts
│   │   │   ├── index.ts
│   │   │   └── routes.ts
│   │   └── package.json
│   │
│   └── governance/              # ⑤ DeepAgents — port 3005
│       ├── src/
│       │   ├── agents/          # ceo.agent.ts, evaluator.agent.ts, reporting.agent.ts
│       │   ├── deepagents/      # config.ts
│       │   ├── jitrl/           # optimizer.ts
│       │   ├── index.ts
│       │   └── routes.ts
│       └── package.json
│
├── apps/
│   └── dashboard/               # SvelteKit + Tailwind — port 5173 (dev)
│       ├── src/
│       │   ├── routes/          # Dashboard, Trade Journal, Strategy Lab, Exceptions, Config
│       │   ├── lib/
│       │   │   ├── components/  # AgentChat, LiveFeed, PortfolioCard, etc.
│       │   │   ├── stores/      # Svelte stores for real-time state
│       │   │   └── api/         # Eden type-safe client for backend
│       │   └── app.html
│       ├── tailwind.config.ts
│       └── package.json
│
├── infrastructure/
│   ├── docker/
│   │   ├── docker-compose.yml
│   │   └── Dockerfile
│   └── mem0/
│       └── config.yaml
│
├── docs/
│   └── superpowers/
│       └── specs/
│
└── scripts/
    ├── dev.sh
    └── setup.sh
```

---

## 6. Error Handling & Resilience

### 6.1 Failure Categories

| Category | Example | Response | Escalate to Human? |
|----------|---------|----------|--------------------|
| Transient | API timeout, WS disconnect | Retry with exponential backoff (3x). Circuit-break after 5 failures. | No |
| Service Down | Strategy engine crash | Health check every 10s. Docker restart. Queue pending events. | After 3 restarts in 5 min |
| Data Corruption | Malformed tick, NaN values | Validate at boundary. Reject bad data. Log, continue. | After 10 rejections in 1 min |
| Agent Failure | Hallucinated trade, token limit | Output validation layer rejects invalid responses. Retry with fresh context. | After 3 invalid outputs |
| Risk Breach | Position limit, daily loss hit, margin violation | HARD STOP. Cancel all pending orders. Freeze trading. | IMMEDIATE — always |
| Debate Deadlock | Judge confidence below threshold | Auto-reject trade. Flag for CEO review. Log pattern. | After 3 deadlocks in 1 hour |

### 6.2 Circuit Breakers

- **What gets circuit-broken:** Upstox WS reconnect loop, cross-service HTTP calls, news API rate limits
- **What NEVER gets circuit-broken:** RiskAgent validation, PositionMonitor stop-loss checks, human escalation notifications
- **Principle:** Fail closed. If RiskAgent can't validate → trade dies. If Judge can't decide → trade dies.

### 6.3 Human Escalation Triggers

1. **Risk Breach:** Daily loss limit, margin violation. Trading auto-frozen. Must manually unfreeze.
2. **Low Judge Confidence:** Below threshold (default 60%). Trade auto-rejected, setup flagged for review.
3. **Strategy Degradation:** Win rate drops >20% below 30-day average. Report with cause analysis.
4. **Service Instability:** Any service restarts >3 times in 5 minutes. CEOAgent flags with crash logs.

### 6.4 Startup & Shutdown

**Startup:**
1. Mem0 service starts first (dependency for all DeepAgent services)
2. data-pipeline starts → WebSocket connects
3. Other 4 services start in parallel, health-check dependencies
4. CEOAgent runs pre-market bootstrap: loads yesterday's context, briefs all agents

**Shutdown (EOD or SIGTERM):**
1. Cancel all pending orders (paper)
2. PositionMonitor saves snapshot to Mem0
3. EvaluatorAgent runs EOD scoring
4. ReportingAgent generates daily summary
5. Mem0 persist + services drain connections → exit

---

## 7. UI — Oversight Dashboard

### 7.1 Design Philosophy

- **Watch, Don't Operate:** No manual trading buttons. Interaction only on exceptions.
- **Ambient Awareness:** Green = healthy. Dashboard is boring 95% of the time.
- **Deep When Needed:** Every number is drillable. Click P&L → see the debate. Click agent → see last 50 decisions.

### 7.2 Pages

| Page | Purpose |
|------|---------|
| Dashboard | Portfolio overview, live activity feed, strategy performance, agent health bar. Auto-refresh. |
| Trade Journal | Every trade with full debate transcript. Filter by symbol, date, outcome. |
| Strategy Lab | All CoderAgent strategies. Backtest charts, live metrics, enable/disable/pause. Code review. |
| Exceptions | Human inbox. Risk breaches, low-confidence debates, degradation alerts. Action buttons per alert. |
| Configuration | Risk limits, paper/live toggle, LLM model selection, trading hours, symbol universe. |

### 7.3 Interactive Agent Terminal

A free-text chat interface integrated into the dashboard sidebar. Users can select any of the 15 agents and type unrestricted questions or commands.

**Interaction Loop:**
1. **Select Agent:** Choose target agent (e.g., AnalystAgent) from dropdown
2. **Free-Text Input:** Type unrestricted question — no menus, no predefined prompts
3. **Context Injection:** System retrieves live market state, recent order book flows, Mem0 long-term context, injects into prompt
4. **Real-Time Streaming:** Agent streams response directly into chat UI via SSE/WebSocket

**Tech:** SvelteKit + Tailwind. Streaming via Server-Sent Events from governance service.

### 7.4 Technology

- **Framework:** SvelteKit (SSR + client-side hydration)
- **Styling:** Tailwind CSS
- **Real-time:** SSE for live feed + agent chat streaming; WebSocket for agent health/status
- **API Client:** Eden type-safe client consuming backend service contracts

---

## 8. Trading Configuration

| Parameter | Initial Value | Notes |
|-----------|--------------|-------|
| Mode | Paper | Live toggle in Configuration page |
| Market | NSE/BSE Equities + F&O | Tightly scoped |
| Trading Hours | 9:15 AM — 3:30 PM IST | System idle outside hours |
| Execution Cadence | Event-driven | No scheduled batch runs |
| Max Position Size | 2% of AUM (adaptive) | RegimeAgent can tighten/loosen |
| Daily Loss Limit | Configurable | Hard stop, human unfreeze required |
| Autonomy Level | Full auto, human on exception | 4 escalation triggers |
| Initial Capital (Paper) | Configurable | For simulation accuracy |

---

## 9. Constraints & Non-Goals

**Constraints:**
- Paper trading only until system validation is complete
- All DeepAgent outputs validated before reaching ExecutionAgent
- Mem0 must be available before any DeepAgent service starts
- No trade executes without passing Risk + Debate gates

**Non-Goals (v1):**
- Live trading (paper only initially)
- MCX commodities, currency derivatives
- Mobile app
- Multi-user support
- External API for third-party consumers
