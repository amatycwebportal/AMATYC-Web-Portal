FROM node:22-alpine

WORKDIR /app

# Copy from project root context
COPY shared/ ./shared/
COPY backend/package*.json ./backend/
COPY backend/ ./backend/

WORKDIR /app/backend

RUN npm ci
RUN npx prisma generate
RUN npm run build

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/backend/server.js"]
