
FROM node:21-alpine as base

RUN npm i -g pnpm

WORKDIR /home/app

COPY --link ./consumer/package.json ./consumer/pnpm-lock.yaml ./consumer/

WORKDIR /home/app/consumer
RUN pnpm install

COPY --link ../consumer ./

RUN pnpm run build

CMD ["node", "/home/app/consumer/dist/index.js"]