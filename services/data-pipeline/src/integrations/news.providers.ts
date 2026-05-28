import type { NewsEvent } from "@aroxtrader/shared";
import { createLogger } from "@aroxtrader/shared";

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
