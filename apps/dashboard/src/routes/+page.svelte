<script>
  import PortfolioCard from "$lib/components/PortfolioCard.svelte";
  import AgentStatus from "$lib/components/AgentStatus.svelte";
  import LiveFeed from "$lib/components/LiveFeed.svelte";
  import StrategyList from "$lib/components/StrategyList.svelte";
</script>

<div class="p-6 space-y-6">
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    <PortfolioCard />

    <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <h2 class="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Live Activity</h2>
      <LiveFeed />
    </section>

    <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <h2 class="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Strategies</h2>
      <StrategyList compact={true} />
    </section>

    <section class="rounded-lg border border-gray-800 bg-gray-900 p-6">
      <h2 class="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Agent Health</h2>
      <AgentStatus />
    </section>
  </div>
</div>
