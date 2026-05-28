<script>
  import "../app.css";
</script>

<div class="min-h-screen bg-gray-950 text-gray-100">
  <header class="border-b border-gray-800 px-6 py-3 flex items-center justify-between">
    <h1 class="text-xl font-bold tracking-tight">AROXTRADER</h1>
    <div class="flex items-center gap-4 text-sm">
      <span class="flex items-center gap-1">
        <span class="h-2 w-2 rounded-full bg-green-500"></span>
        PAPER MODE
      </span>
      <span class="text-gray-400">Regime: TRENDING ▲</span>
      <span class="text-gray-400">VIX: --</span>
    </div>
  </header>

  <main>
    {@render children?.()}
  </main>
</div>
