FROM node:21-alpine as base

FROM base as build

RUN npm i -g pnpm
RUN npm i -g pm2

# COPY --link dashboard/package.json dashboard/pnpm-lock.yaml ./
# RUN npm install --production=false

WORKDIR /home/app

COPY --link dashboard ./dashboard
COPY --link lyx-ui ./lyx-ui
COPY --link consumer ./consumer
COPY --link producer ./producer
COPY --link shared ./shared

WORKDIR /home/app/producer
RUN pnpm install

WORKDIR /home/app/consumer
RUN pnpm install

WORKDIR /home/app/dashboard
RUN pnpm install
RUN pnpm run dev


# CMD [ "node", "/home/app/.output/server/index.mjs" ]