FROM node:22-alpine

WORKDIR /app

# Copy from project root context
COPY shared/ ./shared/
COPY backend/package*.json ./backend/
COPY backend/ ./backend/

WORKDIR /app/backend

RUN npm install
RUN npm run build
RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/backend/server.js"]
