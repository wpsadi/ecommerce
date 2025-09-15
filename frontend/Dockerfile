# syntax=docker/dockerfile:1

# ---- Base ----
FROM oven/bun:1 AS base
WORKDIR /app

# ---- Codebase ----
FROM base AS codebase
COPY . /app

# ---- Dependencies ----
FROM base AS deps
# cache dev deps
RUN mkdir -p /temp/dev
COPY package.json bun.lockb* /temp/dev/
WORKDIR /temp/dev
RUN bun install --frozen-lockfile

# cache prod deps
RUN mkdir -p /temp/prod
COPY package.json bun.lockb* /temp/prod/
WORKDIR /temp/prod
RUN bun install --frozen-lockfile --production

# ---- Builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /temp/dev/node_modules ./node_modules
COPY --from=codebase /app/ /app/

# Disable telemetry (optional)
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js app with Bun
RUN bun run build

# ---- Release ----
FROM base AS release
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

# Copy only what’s needed
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=deps /temp/prod/node_modules ./node_modules
COPY --from=codebase /app/package.json ./


ENV NODE_ENV=production

# Use non-root user
USER bun

EXPOSE 3000

CMD ["bun", "run", "server.js"]
