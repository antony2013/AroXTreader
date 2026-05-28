<script>
  import StrategyList from "$lib/components/StrategyList.svelte";
  import { onMount } from "svelte";

  let code = $state("// Strategy code editor\nfunction strategy(data) {\n  return { signal: 'BUY', confidence: 0.7 };\n}");
  let selectedStrategy = $state(null);
</script>

<div class="p-6 space-y-6">
  <h1 class="text-xl font-bold">Strategy Lab</h1>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <h2 class="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Library</h2>
      <StrategyList />
    </section>

    <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <h2 class="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Editor</h2>
      <textarea
        bind:value={code}
        class="w-full h-64 rounded bg-gray-950 border border-gray-800 p-3 font-mono text-sm text-gray-300 focus:outline-none focus:border-gray-600"
        spellcheck="false"
      ></textarea>
      <div class="mt-4 flex gap-3">
        <button class="rounded bg-green-700 px-4 py-2 text-sm font-medium hover:bg-green-600 transition-colors">
          Backtest
        </button>
        <button class="rounded bg-gray-700 px-4 py-2 text-sm font-medium hover:bg-gray-600 transition-colors">
          Deploy
        </button>
      </div>
    </section>
  </div>
</div>
