# ==== STAGE 1: Build ====
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходники
COPY . .

# Собираем NestJS (dist/)
RUN npm run build

# ==== STAGE 2: Runtime ====
FROM node:20-alpine AS runner

WORKDIR /usr/src/app

ENV NODE_ENV=production

# Копируем только package*.json и ставим prod-зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# Копируем собранный код
COPY --from=builder /usr/src/app/dist ./dist

# Порт HTTP-сервиса (Swagger тоже там же)
EXPOSE 3000

# Переменные по умолчанию (можно переопределить в docker-compose/.env)
ENV PORT=3000 \
    RABBITMQ_URL=amqp://rabbitmq:5672 \
    RABBITMQ_QUEUE=delivery_pricing

CMD ["node", "dist/main.js"]
