<script>
  import TradeList from "$lib/components/TradeList.svelte";
</script>

<div class="p-6 space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-xl font-bold">Trade Journal</h1>
    <div class="flex gap-2 text-sm">
      <select class="rounded bg-gray-800 border border-gray-700 px-3 py-1 text-gray-300">
        <option>All Symbols</option>
      </select>
      <select class="rounded bg-gray-800 border border-gray-700 px-3 py-1 text-gray-300">
        <option>Last 30 Days</option>
      </select>
    </div>
  </div>

  <TradeList showDebate={true} />
</div>
