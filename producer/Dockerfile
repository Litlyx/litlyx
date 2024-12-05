
FROM node:21-alpine as base

RUN npm i -g pnpm

WORKDIR /home/app

COPY --link ./package.json ./tsconfig.json ./pnpm-lock.yaml ./
COPY --link ./scripts/package.json ./scripts/pnpm-lock.yaml ./scripts/
COPY --link ./producer/package.json ./producer/pnpm-lock.yaml ./producer/

RUN pnpm install
RUN pnpm install --filter producer

WORKDIR /home/app/scripts
RUN pnpm install

WORKDIR /home/app

COPY --link ../scripts ./scripts
COPY --link ../shared ./shared
COPY --link ../producer ./producer

WORKDIR /home/app/producer

RUN pnpm run build

CMD ["node", "/home/app/producer/dist/producer/src/index.js"]