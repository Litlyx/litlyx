ARG NODE_VERSION=21

FROM node:${NODE_VERSION}-alpine as base

ENV NODE_ENV=development

# Build stage

FROM base as build

RUN npm install -g pnpm

COPY --link broker/package.json broker/pnpm-lock.yaml home/app/

COPY --link shared/package.json shared/pnpm-lock.yaml /home/shared/

WORKDIR /home/app
RUN pnpm install --frozen-lockfile

WORKDIR /home/shared
RUN pnpm install --frozen-lockfile

COPY --link ../broker /home/app

COPY --link ../shared /home/shared

WORKDIR /home/app

RUN pnpm run build_all

RUN pnpm prune

# Final stage

FROM base

COPY --from=build /home/app /home/app

WORKDIR /home/app

EXPOSE ${PORT}

CMD ["node", "dist/app/src/index.js"]