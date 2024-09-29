FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY postinstall.js ./

RUN npm install --omit=dev

COPY . .

RUN npm run build

FROM node:18-alpine as runner

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/postinstall.js /postinstall.js

ENV NODE_ENV production

EXPOSE 1228

CMD ["npm", "start"]
