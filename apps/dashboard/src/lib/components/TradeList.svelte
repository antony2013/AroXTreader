<script>
  let { showDebate = false } = $props();

  let trades = $state([
    {
      id: "T001",
      symbol: "RELIANCE",
      direction: "LONG",
      entry: 2850,
      exit: 2895,
      pnl: 4500,
      status: "CLOSED",
      time: "09:47",
      debate: {
        bull_confidence: 0.72,
        bear_confidence: 0.38,
        verdict: "APPROVE",
      },
    },
    {
      id: "T002",
      symbol: "INFY",
      direction: "SHORT",
      entry: 1820,
      exit: null,
      pnl: -1200,
      status: "OPEN",
      time: "10:15",
      debate: {
        bull_confidence: 0.45,
        bear_confidence: 0.65,
        verdict: "APPROVE",
      },
    },
  ]);
</script>

<div class="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
  <table class="w-full text-sm">
    <thead class="border-b border-gray-800 bg-gray-800/50">
      <tr>
        <th class="px-4 py-3 text-left font-medium text-gray-400">ID</th>
        <th class="px-4 py-3 text-left font-medium text-gray-400">Symbol</th>
        <th class="px-4 py-3 text-left font-medium text-gray-400">Dir</th>
        <th class="px-4 py-3 text-right font-medium text-gray-400">Entry</th>
        <th class="px-4 py-3 text-right font-medium text-gray-400">P&L</th>
        <th class="px-4 py-3 text-left font-medium text-gray-400">Status</th>
        {#if showDebate}
          <th class="px-4 py-3 text-left font-medium text-gray-400">Debate</th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each trades as t}
        <tr class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
          <td class="px-4 py-3 text-gray-400 font-mono text-xs">{t.id}</td>
          <td class="px-4 py-3 font-medium">{t.symbol}</td>
          <td class="px-4 py-3">
            <span class={t.direction === "LONG" ? "text-green-400" : "text-red-400"}>
              {t.direction}
            </span>
          </td>
          <td class="px-4 py-3 text-right">₹{t.entry}</td>
          <td class="px-4 py-3 text-right">
            <span class={t.pnl >= 0 ? "text-green-400" : "text-red-400"}>
              {t.pnl >= 0 ? "+" : ""}₹{t.pnl.toLocaleString()}
            </span>
          </td>
          <td class="px-4 py-3">
            <span class="rounded bg-gray-800 px-2 py-0.5 text-xs">{t.status}</span>
          </td>
          {#if showDebate}
            <td class="px-4 py-3">
              <div class="text-xs text-gray-400">
                <span class="text-green-400">B{t.debate.bull_confidence}</span>
                <span class="mx-1">vs</span>
                <span class="text-red-400">R{t.debate.bear_confidence}</span>
                <span class="ml-1 text-gray-300">→ {t.debate.verdict}</span>
              </div>
            </td>
          {/if}
        </tr>
      {/each}
    </tbody>
  </table>
</div>
