import type { CreateDeepAgentParams } from "deepagents";

export async function createDebateAgentConfig(
  systemPrompt: string
): Promise<CreateDeepAgentParams> {
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
