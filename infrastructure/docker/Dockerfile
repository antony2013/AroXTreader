FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY services ./services
COPY apps ./apps

RUN bun install --frozen-lockfile

EXPOSE 3001 3002 3003 3004 3005 5173

CMD ["bun", "run", "services/data-pipeline/src/index.ts"]
