import type { CreateDeepAgentParams } from "deepagents";

export async function createGovernanceAgentConfig(
  systemPrompt: string,
  tools: CreateDeepAgentParams["tools"] = []
): Promise<CreateDeepAgentParams> {
  const { ChatOllama } = await import("@langchain/ollama");

  return {
    model: new ChatOllama({
      model: process.env.OLLAMA_MODEL ?? "llama3",
      baseUrl: process.env.OLLAMA_BASE_URL ?? "http://localhost:11434",
      temperature: 0.1,
    }),
    systemPrompt,
    tools,
  };
}
