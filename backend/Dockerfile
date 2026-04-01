FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY /shared/ ./shared/
RUN npm run build
RUN npx prisma generate

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/backend/server.js"]
