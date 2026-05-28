import type { CreateDeepAgentParams } from "deepagents";
import { getLlmModel, getLlmBaseUrl } from "@aroxtrader/shared";

export async function createAgentConfig(
  name: string,
  systemPrompt: string,
  tools: CreateDeepAgentParams["tools"] = []
): Promise<any> {
  const { ChatOllama } = await import("@langchain/ollama");

  return {
    model: new ChatOllama({
      model: getLlmModel(),
      baseUrl: getLlmBaseUrl(),
      temperature: 0.1,
    }),
    systemPrompt,
    tools,
    name,
  };
}
