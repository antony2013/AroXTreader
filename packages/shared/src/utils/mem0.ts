/**
 * Mem0 REST client for the self-hosted Mem0 server.
 * All agents use this to store and retrieve long-term memory.
 */

import { createLogger } from "./logger.js";

const log = createLogger("mem0");

const MEM0_URL = process.env.MEM0_API_URL ?? "http://localhost:8000";

export interface Mem0Entry {
  id?: string;
  memory: string;
  user_id?: string;
  agent_id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

async function mem0Fetch(path: string, init?: RequestInit): Promise<unknown> {
  const url = `${MEM0_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Mem0 ${path} failed: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Add a memory entry to Mem0.
 */
export async function addMemory(
  memory: string,
  options: { user_id?: string; agent_id?: string; metadata?: Record<string, unknown> } = {}
): Promise<Mem0Entry> {
  log.debug("Adding memory", { memory: memory.slice(0, 100), ...options });
  const result = await mem0Fetch("/v1/memories/", {
    method: "POST",
    body: JSON.stringify({
      messages: [{ role: "user", content: memory }],
      user_id: options.user_id ?? "aroxtrader",
      agent_id: options.agent_id,
      metadata: options.metadata,
    }),
  });
  return (result as any)?.results?.[0] ?? (result as Mem0Entry);
}

/**
 * Search memories by query.
 */
export async function searchMemory(
  query: string,
  options: { user_id?: string; agent_id?: string; limit?: number } = {}
): Promise<Mem0Entry[]> {
  log.debug("Searching memory", { query: query.slice(0, 100), ...options });
  const result = await mem0Fetch("/v1/memories/search/", {
    method: "POST",
    body: JSON.stringify({
      query,
      user_id: options.user_id ?? "aroxtrader",
      agent_id: options.agent_id,
      limit: options.limit ?? 5,
    }),
  });
  return ((result as any)?.results ?? []) as Mem0Entry[];
}

/**
 * Get all memories for a user.
 */
export async function getMemories(options: { user_id?: string; agent_id?: string } = {}): Promise<Mem0Entry[]> {
  const qs = new URLSearchParams();
  qs.set("user_id", options.user_id ?? "aroxtrader");
  if (options.agent_id) qs.set("agent_id", options.agent_id);
  const result = await mem0Fetch(`/v1/memories/?${qs.toString()}`);
  return ((result as any)?.results ?? []) as Mem0Entry[];
}

/**
 * Delete a memory by ID.
 */
export async function deleteMemory(memoryId: string): Promise<void> {
  await mem0Fetch(`/v1/memories/${memoryId}/`, { method: "DELETE" });
}
