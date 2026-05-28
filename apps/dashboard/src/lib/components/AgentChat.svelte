<script>
  let { agent = "Analyst", onMessage } = $props();
  let messages = $state([
    { role: "system", text: `Connected to ${agent}Agent. Type a message to interact.` },
  ]);
  let input = $state("");
  let loading = $state(false);

  async function send() {
    if (!input.trim() || loading) return;
    const text = input.trim();
    messages = [...messages, { role: "user", text }];
    input = "";
    loading = true;

    try {
      const res = await fetch(`http://localhost:3005/chat/${agent.toLowerCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const reply = await res.text();
      messages = [...messages, { role: "agent", text: reply }];
    } catch (err) {
      messages = [...messages, { role: "error", text: "Failed to reach agent." }];
    } finally {
      loading = false;
    }
  }
</script>

<div class="rounded-lg border border-gray-800 bg-gray-900 flex flex-col h-96">
  <div class="px-4 py-2 border-b border-gray-800 text-sm font-medium">
    Agent Chat: {agent}Agent
  </div>

  <div class="flex-1 overflow-auto p-3 space-y-2">
    {#each messages as m}
      <div
        class="text-sm rounded px-3 py-2"
        class:bg-gray-800={m.role === "system"}
        class:text-green-300={m.role === "agent"}
        class:text-gray-200={m.role === "user"}
        class:text-red-300={m.role === "error"}
      >
        {m.text}
      </div>
    {/each}
    {#if loading}
      <div class="text-xs text-gray-500 px-3">Agent is typing...</div>
    {/if}
  </div>

  <div class="px-3 py-2 border-t border-gray-800 flex gap-2">
    <input
      bind:value={input}
      onkeydown={(e) => e.key === "Enter" && send()}
      placeholder="Ask the agent..."
      class="flex-1 rounded bg-gray-800 border border-gray-700 px-3 py-1.5 text-sm focus:outline-none focus:border-gray-500"
    />
    <button
      onclick={send}
      class="rounded bg-gray-700 px-3 py-1.5 text-sm hover:bg-gray-600 transition-colors"
    >
      Send
    </button>
  </div>
</div>
