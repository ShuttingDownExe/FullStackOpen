# ---- Stage 1: build frontend ----
FROM node:20 AS frontend-builder
WORKDIR /app
COPY phonebook-frontend/package*.json ./
RUN npm ci
COPY phonebook-frontend/ ./
RUN npm run build

# ---- Stage 2: backend deps ----
FROM node:20-slim AS backend-deps
WORKDIR /app
COPY phonebook-backend/package*.json ./
RUN npm ci --omit=dev

# ---- Stage 3: runtime ----
FROM node:20-slim
WORKDIR /app
COPY --from=backend-deps /app/node_modules ./node_modules
COPY phonebook-backend/index.js ./
COPY phonebook-backend/modules ./modules
COPY --from=frontend-builder /app/dist ./dist

ENV PORT=3001
ENV NODE_ENV=production
CMD ["node", "index.js"]