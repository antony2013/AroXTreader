export function formatAgentResponse(result: unknown): string {
  if (typeof result === "string") return result;
  if (result && typeof result === "object") {
    const r = result as Record<string, unknown>;
    if (typeof r.output === "string") return r.output;
    if (Array.isArray(r.messages) && r.messages.length > 0) {
      const last = r.messages[r.messages.length - 1] as Record<string, unknown>;
      if (typeof last.content === "string") return last.content;
      if (typeof last.text === "string") return last.text;
      const kw = (last as any).kwargs;
      if (kw && typeof kw.content === "string") return kw.content;
    }
    if (typeof r.content === "string") return r.content;
    if (typeof r.text === "string") return r.text;
  }
  return JSON.stringify(result, null, 2);
}
