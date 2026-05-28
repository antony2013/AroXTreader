<script>
  import "../app.css";
  import AgentChat from "$lib/components/AgentChat.svelte";
  let { children } = $props();
  let chatOpen = $state(false);

  const nav = [
    { href: "/", label: "Dashboard", icon: "◈" },
    { href: "/journal", label: "Trade Journal", icon: "◊" },
    { href: "/strategies", label: "Strategy Lab", icon: "◇" },
    { href: "/exceptions", label: "Exceptions", icon: "⚠" },
    { href: "/config", label: "Configuration", icon: "◉" },
  ];
</script>

<svelte:head>
  <title>AroXtrader</title>
</svelte:head>

<div class="min-h-screen bg-gray-950 text-gray-100 flex">
  <!-- Sidebar -->
  <aside class="w-56 border-r border-gray-800 flex flex-col">
    <div class="px-4 py-4 border-b border-gray-800">
      <h1 class="text-lg font-bold tracking-tight">AROXTRADER</h1>
      <p class="text-xs text-gray-500 mt-1">Autonomous Trading Co.</p>
    </div>

    <nav class="flex-1 px-2 py-3 space-y-1 overflow-auto">
      {#each nav as item}
        <a
          href={item.href}
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors"
          class:bg-gray-800={false}
          class:text-gray-100={false}
        >
          <span class="text-xs">{item.icon}</span>
          {item.label}
        </a>
      {/each}

      <div class="mt-4 border-t border-gray-800 pt-3 px-1">
        <button
          onclick={() => chatOpen = !chatOpen}
          class="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-100 transition-colors w-full"
        >
          <span class="text-xs">💬</span>
          {chatOpen ? "Close Chat" : "Agent Chat"}
        </button>
        {#if chatOpen}
          <div class="mt-2">
            <AgentChat agent="Analyst" />
          </div>
        {/if}
      </div>
    </nav>

    <div class="px-4 py-3 border-t border-gray-800 text-xs text-gray-500">
      <div class="flex items-center gap-2 mb-2">
        <span class="h-2 w-2 rounded-full bg-green-500"></span>
        PAPER MODE
      </div>
      <div>Regime: TRENDING ▲</div>
      <div>VIX: --</div>
    </div>
  </aside>

  <!-- Main -->
  <div class="flex-1 flex flex-col">
    <main class="flex-1 overflow-auto">
      {@render children?.()}
    </main>
  </div>
</div>
