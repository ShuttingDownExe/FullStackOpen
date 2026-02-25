# ---- Stage 1: install dependencies ----
FROM node:20 AS builder

WORKDIR /app

COPY ./phonebook/package*.json ./
RUN npm ci --omit=dev

# ---- Stage 2: runtime ----
FROM node:20-slim

WORKDIR /app

# copy only production node_modules
COPY --from=builder /app/node_modules ./node_modules

# copy ONLY runtime files
COPY ./phonebook-backend/index.js .

ENV NODE_ENV=production

CMD ["node", "index.js"]