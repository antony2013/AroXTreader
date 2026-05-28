<script>
  import { strategyEngine } from "$lib/api/client.js";
  import { onMount } from "svelte";

  let { compact = false } = $props();

  let strategies = $state([]);
  let loading = $state(true);
  let error = $state("");

  onMount(async () => {
    try {
      strategies = await strategyEngine.strategies();
    } catch (e) {
      error = "Failed to load strategies";
    } finally {
      loading = false;
    }
  });

  const statusStyle = {
    ACTIVE: "text-green-400",
    PAUSED: "text-yellow-400",
    DISABLED: "text-gray-400",
  };
</script>

<div class="space-y-3">
  {#if loading}
    <p class="text-xs text-gray-500">Loading strategies...</p>
  {:else if error}
    <p class="text-xs text-red-400">{error}</p>
  {:else if strategies.length === 0}
    <p class="text-xs text-gray-500">No strategies deployed yet.</p>
  {:else}
    {#each strategies as s}
      <div class="rounded border border-gray-800 bg-gray-950 p-3 flex items-center justify-between">
        <div class="min-w-0">
          <div class="font-medium text-sm truncate">{s.name}</div>
          {#if !compact && s.backtest_result}
            <div class="text-xs text-gray-500 mt-1">
              Sharpe: {s.backtest_result.sharpe ?? "--"}
            </div>
          {/if}
        </div>
        <div class="text-right shrink-0 ml-3">
          <div class="text-xs font-medium {statusStyle[s.status] ?? 'text-gray-400'}">{s.status}</div>
        </div>
      </div>
    {/each}
  {/if}
</div>
