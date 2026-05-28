#!/usr/bin/env bash
set -e

echo "=== AroXtrader Development ==="

# Start all 5 backend services in parallel
bun run --watch services/data-pipeline/src/index.ts &
PID1=$!
bun run --watch services/strategy-engine/src/index.ts &
PID2=$!
bun run --watch services/risk-execution/src/index.ts &
PID3=$!
bun run --watch services/debate-chamber/src/index.ts &
PID4=$!
bun run --watch services/governance/src/index.ts &
PID5=$!

# Start dashboard
bun run --cwd apps/dashboard dev &
PID6=$!

echo "All services started"
echo "  data-pipeline:  http://localhost:3001"
echo "  strategy-engine: http://localhost:3002"
echo "  risk-execution:  http://localhost:3003"
echo "  debate-chamber:  http://localhost:3004"
echo "  governance:      http://localhost:3005"
echo "  dashboard:       http://localhost:5173"

# Wait for all
trap "kill $PID1 $PID2 $PID3 $PID4 $PID5 $PID6 2>/dev/null" EXIT
wait
