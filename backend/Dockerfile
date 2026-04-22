FROM node:22-alpine AS builder

WORKDIR /app

COPY shared/ ./shared/
COPY backend/package*.json ./backend/
COPY backend/ ./backend/

WORKDIR /app/backend

RUN npm ci
RUN npx prisma generate
RUN npm run build

# ---- Production image ----
FROM node:22-alpine AS runner

WORKDIR /app

COPY shared/ ./shared/
COPY backend/package*.json ./backend/

WORKDIR /app/backend

# Install production deps only
RUN npm ci --omit=dev

# Copy built output and prisma from builder
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma
COPY --from=builder /app/backend/generated ./generated
COPY --from=builder /app/backend/prisma.config.ts ./prisma.config.ts

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.cjs"]
