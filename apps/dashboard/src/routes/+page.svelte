<script>
  let portfolioPnl = 0;
  let openPositions = 0;
  let winRate = 0;
  let agents = [
    "Data", "News", "Regime", "Analyst", "Coder", "Quant",
    "Risk", "Execution", "PosMon", "Bull", "Bear", "Judge",
    "CEO", "Eval", "Report",
  ];
</script>

<div class="grid grid-cols-2 gap-6 p-6">
  <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 class="text-lg font-semibold mb-4">PORTFOLIO</h2>
    <div class="space-y-3">
      <div class="flex justify-between">
        <span class="text-gray-400">P&L Today</span>
        <span class={portfolioPnl >= 0 ? "text-green-400" : "text-red-400"}>
          ₹{portfolioPnl.toLocaleString()}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Open</span>
        <span>{openPositions}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-gray-400">Win Rate</span>
        <span>{winRate}%</span>
      </div>
    </div>
  </section>

  <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 class="text-lg font-semibold mb-4">LIVE ACTIVITY</h2>
    <p class="text-gray-500 text-sm">No active trades. Service starting up...</p>
  </section>

  <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 class="text-lg font-semibold mb-4">STRATEGIES</h2>
    <p class="text-gray-500 text-sm">No strategies deployed yet.</p>
  </section>

  <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
    <h2 class="text-lg font-semibold mb-4">AGENT STATUS</h2>
    <div class="flex flex-wrap gap-2">
      {#each agents as agent}
        <span class="flex items-center gap-1 rounded bg-gray-800 px-2 py-1 text-xs">
          <span class="h-1.5 w-1.5 rounded-full bg-gray-500"></span>
          {agent}
        </span>
      {/each}
    </div>
  </section>
</div>
