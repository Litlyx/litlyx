
FROM node:21-alpine AS base

FROM base AS build

RUN npm i -g pnpm

WORKDIR /home/app

COPY --link ./package.json ./tsconfig.json ./pnpm-lock.yaml ./
COPY --link ./dashboard/package.json ./dashboard/pnpm-lock.yaml ./dashboard/

RUN pnpm install
RUN pnpm install --filter dashboard

WORKDIR /home/app

COPY --link ./dashboard ./dashboard
COPY --link ./shared ./shared

WORKDIR /home/app/dashboard

RUN pnpm run build

FROM node:21-alpine AS production

WORKDIR /home/app

COPY --from=build /home/app/dashboard/.output /home/app/.output

CMD ["node", "/home/app/.output/server/index.mjs"]