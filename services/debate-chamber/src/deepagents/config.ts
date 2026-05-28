import type { CreateDeepAgentParams } from "deepagents";

export async function createDebateAgentConfig(
  systemPrompt: string
): Promise<CreateDeepAgentParams> {
  const { ChatOllama } = await import("@langchain/ollama");

  return {
    model: new ChatOllama({
      model: process.env.OLLAMA_MODEL ?? "llama3",
      baseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
      temperature: 0.3,
    }),
    systemPrompt,
    tools: [],
  };
}
