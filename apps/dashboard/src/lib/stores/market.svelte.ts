import type { MarketTick, Regime } from "@aroxtrader/shared";

export const marketState = $state<{
  ticks: MarketTick[];
  regime: Regime | null;
}>({
  ticks: [],
  regime: null,
});

export function updateTicks(ticks: MarketTick[]) {
  marketState.ticks = ticks;
}

export function updateRegime(regime: Regime) {
  marketState.regime = regime;
}
