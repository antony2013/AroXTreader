import type { MarketTick } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

const log = createLogger("upstox-ws");

const WS_URL = "wss://api.upstox.com/v3/feed/market-data-feed";

let ws: WebSocket | null = null;
let reconnectTimer: any = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_BASE_DELAY_MS = 1000;

let handlers: ((tick: MarketTick) => void)[] = [];
let subscribedSymbols: string[] = [];

export function onTick(handler: (tick: MarketTick) => void) {
  handlers.push(handler);
}

export function offTick(handler: (tick: MarketTick) => void) {
  handlers = handlers.filter((h) => h !== handler);
}

function emitTick(tick: MarketTick) {
  for (const h of handlers) {
    try {
      h(tick);
    } catch (err) {
      log.error("Tick handler error", err);
    }
  }
}

function scheduleReconnect(accessToken: string) {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    log.error("Max WebSocket reconnect attempts reached. Giving up.");
    return;
  }

  const delay = Math.min(RECONNECT_BASE_DELAY_MS * 2 ** reconnectAttempts, 30000);
  reconnectAttempts++;
  log.warn(`Scheduling WebSocket reconnect in ${delay}ms (attempt ${reconnectAttempts})`);

  reconnectTimer = setTimeout(() => {
    connect(accessToken);
  }, delay);
}

export async function connect(accessToken: string): Promise<void> {
  if (!accessToken) {
    log.warn("No Upstox access token — WebSocket will not connect. Using stub mode.");
    return;
  }

  if (ws) {
    disconnect();
  }

  log.info("Connecting to Upstox WebSocket V3...");

  let socket: WebSocket;
  try {
    // Bun supports a 3rd argument with headers; TypeScript DOM types don't know this.
    // @ts-ignore
    socket = new WebSocket(WS_URL, [], {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    ws = socket;
  } catch (err) {
    log.error("WebSocket creation failed", err);
    scheduleReconnect(accessToken);
    return;
  }

  socket.onopen = () => {
    log.info("Upstox WebSocket connected");
    reconnectAttempts = 0;
    // TODO: Send protobuf subscription request for subscribedSymbols
  };

  socket.onmessage = (event) => {
    // TODO: Parse protobuf MarketDataFeedV3 message
    // Upstox V3 feed uses protobuf. Full parsing requires protobufjs + generated types.
    const buf = event.data as ArrayBuffer;
    log.debug("WebSocket message received", { bytes: buf.byteLength });
  };

  socket.onerror = (err) => {
    log.error("WebSocket error", err);
  };

  socket.onclose = () => {
    log.warn("WebSocket closed");
    ws = null;
    scheduleReconnect(accessToken);
  };
}

export function disconnect(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (ws) {
    try {
      ws.close();
    } catch {
      // ignore
    }
    ws = null;
  }
  reconnectAttempts = 0;
  log.info("Upstox WebSocket disconnected");
}

export function subscribe(symbols: string[]): void {
  subscribedSymbols = [...symbols];
  // TODO: Send subscription protobuf message if ws is open
}
