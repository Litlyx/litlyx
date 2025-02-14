
FROM node:21-alpine as base

RUN npm i -g pnpm

WORKDIR /home/app

COPY --link ./producer/package.json ./producer/pnpm-lock.yaml ./producer/

WORKDIR /home/app/producer
RUN pnpm install

COPY --link ../producer ./

RUN pnpm run build

CMD ["node", "/home/app/producer/dist/producer/src/index.js"]