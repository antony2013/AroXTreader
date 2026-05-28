<script lang="ts">
  let exceptions = $state([
    { id: "exc-1", type: "RISK_BREACH", message: "Daily loss limit approaching 80%", severity: "CRITICAL", time: "09:45", resolved: false },
    { id: "exc-2", type: "LOW_CONFIDENCE", message: "Judge confidence below threshold on RELIANCE proposal", severity: "WARNING", time: "10:12", resolved: true },
    { id: "exc-3", type: "SERVICE_INSTABILITY", message: "Strategy engine restarted 2x", severity: "WARNING", time: "10:30", resolved: false },
  ]);

  function resolve(id: string) {
    exceptions = exceptions.map(e => e.id === id ? { ...e, resolved: true } : e);
  }
</script>

<div class="p-6 space-y-6">
  <h1 class="text-xl font-bold">Exceptions</h1>

  <div class="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
    <table class="w-full text-sm">
      <thead class="border-b border-gray-800 bg-gray-800/50">
        <tr>
          <th class="px-4 py-3 text-left font-medium text-gray-400">Time</th>
          <th class="px-4 py-3 text-left font-medium text-gray-400">Type</th>
          <th class="px-4 py-3 text-left font-medium text-gray-400">Message</th>
          <th class="px-4 py-3 text-left font-medium text-gray-400">Severity</th>
          <th class="px-4 py-3 text-left font-medium text-gray-400">Status</th>
          <th class="px-4 py-3 text-right font-medium text-gray-400">Action</th>
        </tr>
      </thead>
      <tbody>
        {#each exceptions as exc}
          <tr class="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
            <td class="px-4 py-3 text-gray-400">{exc.time}</td>
            <td class="px-4 py-3">
              <span class="rounded bg-gray-800 px-2 py-0.5 text-xs">{exc.type}</span>
            </td>
            <td class="px-4 py-3">{exc.message}</td>
            <td class="px-4 py-3">
              <span class="text-xs font-medium"
                class:text-red-400={exc.severity === "CRITICAL"}
                class:text-yellow-400={exc.severity === "WARNING"}
                class:text-blue-400={exc.severity === "INFO"}
              >
                {exc.severity}
              </span>
            </td>
            <td class="px-4 py-3">
              {#if exc.resolved}
                <span class="text-green-400 text-xs">✓ Resolved</span>
              {:else}
                <span class="text-red-400 text-xs">● Open</span>
              {/if}
            </td>
            <td class="px-4 py-3 text-right">
              {#if !exc.resolved}
                <button
                  onclick={() => resolve(exc.id)}
                  class="rounded bg-gray-700 px-3 py-1 text-xs hover:bg-gray-600 transition-colors"
                >
                  Resolve
                </button>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
