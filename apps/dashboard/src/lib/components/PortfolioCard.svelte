<script>
  import { riskExecution } from "$lib/api/client.js";
  import { onMount } from "svelte";

  let positions = $state([]);
  let loading = $state(true);

  let totalPnl = $derived(
    positions.reduce((sum, p) => sum + (p.pnl ?? 0), 0)
  );
  let openCount = $derived(positions.length);

  onMount(async () => {
    try {
      positions = await riskExecution.positions();
    } catch {
      // ignore — will show zeros
    } finally {
      loading = false;
    }
  });
</script>

<section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
  <h2 class="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Portfolio</h2>
  <div class="space-y-3">
    <div class="flex justify-between">
      <span class="text-gray-400">P&L Today</span>
      <span class={totalPnl >= 0 ? "text-green-400" : "text-red-400"}>
        {totalPnl >= 0 ? "+" : ""}₹{totalPnl.toLocaleString()}
      </span>
    </div>
    <div class="flex justify-between">
      <span class="text-gray-400">Open Positions</span>
      <span>{openCount}</span>
    </div>
    <div class="flex justify-between">
      <span class="text-gray-400">Win Rate</span>
      <span>--%</span>
    </div>
  </div>
</section>
