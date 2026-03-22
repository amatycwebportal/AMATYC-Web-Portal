FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY /shared/ ./shared/
RUN npm run build
RUN npx prisma generate

EXPOSE 4000

CMD ["node", "dist/backend/server.js"]
