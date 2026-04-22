FROM node:22-alpine AS build

WORKDIR /app/frontend

# Install deps first (better layer caching)
COPY frontend/package*.json ./
RUN npm ci

# Copy source
COPY shared/ ../shared/
COPY frontend/ ./

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

RUN npm run build

# ---- Production image ----
FROM nginx:alpine

COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
