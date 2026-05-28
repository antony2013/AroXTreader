<script>
  import { dataPipeline } from "$lib/api/client.js";
  import { onMount } from "svelte";

  let events = $state([
    { time: "--", message: "System starting...", type: "info" },
  ]);

  onMount(async () => {
    try {
      const ticks = await dataPipeline.ticks();
      if (ticks.length > 0) {
        const latest = ticks[ticks.length - 1];
        events = [
          { time: new Date(latest.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), message: `${latest.symbol} @ ₹${latest.ltp}`, type: "trade" },
        ];
      } else {
        events = [{ time: "--", message: "Waiting for market data...", type: "info" }];
      }
    } catch {
      events = [{ time: "--", message: "Data pipeline unavailable", type: "error" }];
    }
  });
</script>

<div class="space-y-2 max-h-48 overflow-auto pr-1">
  {#each events as event}
    <div class="flex items-start gap-2 text-xs">
      <span class="text-gray-500 shrink-0 w-10">{event.time}</span>
      <span
        class="font-medium"
        class:text-gray-300={event.type === "info"}
        class:text-green-400={event.type === "success"}
        class:text-yellow-400={event.type === "signal"}
        class:text-blue-400={event.type === "trade"}
        class:text-red-400={event.type === "error"}
      >
        {event.message}
      </span>
    </div>
  {/each}
</div>
