<script>
  import { governance } from "$lib/api/client.js";

  let mode = $state("paper");
  let dailyLossLimit = $state(50000);
  let maxPositionSize = $state(2);
  let llmModel = $state("granite4.1:3b");
  let tradingHours = $state({ start: "09:15", end: "15:30" });
  let saving = $state(false);
  let saveStatus = $state("");

  // Load current backend config on mount
  $effect(() => {
    governance.getConfig().then((c) => {
      llmModel = c.llmModel;
    }).catch(() => {
      // fallback to defaults
    });
  });

  async function save() {
    saving = true;
    saveStatus = "";
    try {
      await governance.setConfig(llmModel);
      saveStatus = "Saved. Restart backend services for model change to take effect.";
    } catch (err) {
      saveStatus = `Save failed: ${err instanceof Error ? err.message : String(err)}`;
    } finally {
      saving = false;
    }
  }
</script>

<div class="p-6 space-y-6">
  <h1 class="text-xl font-bold">Configuration</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <section class="rounded-lg border border-gray-800 bg-gray-900 p-6 space-y-4">
      <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Trading Mode</h2>
      <div class="flex items-center gap-4">
        <button
          class="rounded px-4 py-2 text-sm font-medium transition-colors"
          class:bg-green-700={mode === "paper"}
          class:bg-gray-700={mode !== "paper"}
          onclick={() => mode = "paper"}
        >
          Paper Trading
        </button>
        <button
          class="rounded px-4 py-2 text-sm font-medium transition-colors"
          class:bg-red-700={mode === "live"}
          class:bg-gray-700={mode !== "live"}
          onclick={() => mode = "live"}
        >
          Live Trading
        </button>
      </div>
      <p class="text-xs text-gray-500">Live mode requires manual approval and will execute real orders.</p>
    </section>

    <section class="rounded-lg border border-gray-800 bg-gray-900 p-6 space-y-4">
      <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Risk Limits</h2>
      <div class="space-y-3">
        <label class="flex justify-between items-center">
          <span class="text-sm text-gray-400">Daily Loss Limit (₹)</span>
          <input type="number" bind:value={dailyLossLimit} class="w-32 rounded bg-gray-800 border border-gray-700 px-3 py-1 text-right" />
        </label>
        <label class="flex justify-between items-center">
          <span class="text-sm text-gray-400">Max Position Size (%)</span>
          <input type="number" bind:value={maxPositionSize} class="w-32 rounded bg-gray-800 border border-gray-700 px-3 py-1 text-right" />
        </label>
      </div>
    </section>

    <section class="rounded-lg border border-gray-800 bg-gray-900 p-6 space-y-4">
      <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">LLM Configuration</h2>
      <div class="space-y-3">
        <label class="flex justify-between items-center">
          <span class="text-sm text-gray-400">Model</span>
          <select bind:value={llmModel} class="rounded bg-gray-800 border border-gray-700 px-3 py-1">
            <option>granite4.1:3b</option>
            <option>llama3</option>
            <option>qwen2.5:7b</option>
          </select>
        </label>
      </div>
      <p class="text-xs text-gray-500">{saveStatus}</p>
    </section>

    <section class="rounded-lg border border-gray-800 bg-gray-900 p-6 space-y-4">
      <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">Trading Hours</h2>
      <div class="space-y-3">
        <label class="flex justify-between items-center">
          <span class="text-sm text-gray-400">Start</span>
          <input type="time" bind:value={tradingHours.start} class="rounded bg-gray-800 border border-gray-700 px-3 py-1" />
        </label>
        <label class="flex justify-between items-center">
          <span class="text-sm text-gray-400">End</span>
          <input type="time" bind:value={tradingHours.end} class="rounded bg-gray-800 border border-gray-700 px-3 py-1" />
        </label>
      </div>
    </section>
  </div>

  <div class="flex justify-end">
    <button
      onclick={save}
      disabled={saving}
      class="rounded bg-blue-700 px-6 py-2 text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save Changes"}
    </button>
  </div>
</div>
