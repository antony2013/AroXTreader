<script>
  import { onMount } from "svelte";

  const agents = [
    { name: "Data", port: 3001 },
    { name: "News", port: 3001 },
    { name: "Regime", port: 3001 },
    { name: "Analyst", port: 3002 },
    { name: "Coder", port: 3002 },
    { name: "Quant", port: 3002 },
    { name: "Risk", port: 3003 },
    { name: "Execution", port: 3003 },
    { name: "PosMon", port: 3003 },
    { name: "Bull", port: 3004 },
    { name: "Bear", port: 3004 },
    { name: "Judge", port: 3004 },
    { name: "CEO", port: 3005 },
    { name: "Eval", port: 3005 },
    { name: "Report", port: 3005 },
  ];

  let health = $state(
    Object.fromEntries(agents.map((a) => [a.name, "unknown"]))
  );

  onMount(async () => {
    for (const a of agents) {
      try {
        const res = await fetch(`http://localhost:${a.port}/health`, { signal: AbortSignal.timeout(2000) });
        health[a.name] = res.ok ? "healthy" : "warning";
      } catch {
        health[a.name] = "critical";
      }
    }
  });

  const statusColor = {
    healthy: "bg-green-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
    unknown: "bg-gray-500",
  };
</script>

<div class="flex flex-wrap gap-2">
  {#each agents as agent}
    <span class="flex items-center gap-1.5 rounded bg-gray-800 px-2 py-1 text-xs">
      <span class="h-1.5 w-1.5 rounded-full {statusColor[health[agent.name]]}"></span>
      {agent.name}
    </span>
  {/each}
</div>
