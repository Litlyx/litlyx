
FROM node:21-alpine as base

RUN npm i -g pnpm

WORKDIR /home/app

COPY --link ./package.json ./tsconfig.json ./pnpm-lock.yaml ./
COPY --link ./scripts/package.json ./scripts/pnpm-lock.yaml ./scripts/
COPY --link ./consumer/package.json ./consumer/pnpm-lock.yaml ./consumer/

RUN pnpm install
RUN pnpm install --filter consumer

WORKDIR /home/app/scripts
RUN pnpm install

WORKDIR /home/app

COPY --link ../scripts ./scripts
COPY --link ../shared ./shared
COPY --link ../consumer ./consumer

WORKDIR /home/app/consumer

RUN pnpm run build

CMD ["node", "/home/app/consumer/dist/consumer/src/index.js"]