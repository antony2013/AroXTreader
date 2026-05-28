#!/usr/bin/env bash
set -e

echo "=== AroXtrader Setup ==="

echo "Installing dependencies..."
bun install

echo "Running type checks..."
cd packages/shared && bun run typecheck
cd ../../services/data-pipeline && bun run typecheck
cd ../../services/strategy-engine && bun run typecheck
cd ../../services/risk-execution && bun run typecheck
cd ../../services/debate-chamber && bun run typecheck
cd ../../services/governance && bun run typecheck
cd ../../apps/dashboard && bun run typecheck
cd ../..

echo ""
echo "Setup complete!"
echo "Run 'bun run dev' to start all services."
