import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Resolve config from project root (this file lives in packages/shared/src/utils)
const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
const CONFIG_PATH = process.env.AROX_CONFIG_PATH ?? resolve(PROJECT_ROOT, ".arox-config.json");

export function getLlmModel(): string {
  try {
    if (existsSync(CONFIG_PATH)) {
      const data = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
      if (typeof data.llmModel === "string") return data.llmModel;
    }
  } catch {}
  return process.env.OLLAMA_MODEL ?? "llama3";
}

export function getLlmBaseUrl(): string {
  return process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
}

export function setLlmConfig(config: { llmModel?: string }): void {
  let existing: Record<string, unknown> = {};
  try {
    if (existsSync(CONFIG_PATH)) {
      existing = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    }
  } catch {}
  const updated = { ...existing, ...config };
  writeFileSync(CONFIG_PATH, JSON.stringify(updated, null, 2));
}
