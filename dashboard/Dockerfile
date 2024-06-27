ARG NODE_VERSION=21

FROM node:${NODE_VERSION}-alpine as base

ENV NODE_ENV=production

# Build stage

WORKDIR /home/app

FROM base as build

COPY --link dashboard/package.json dashboard/pnpm-lock.yaml ./
RUN npm install --production=false

COPY --link dashboard/ ./

COPY --link shared/ /home/shared

ARG GOOGLE_AUTH_CLIENT_ID
ENV GOOGLE_AUTH_CLIENT_ID=$GOOGLE_AUTH_CLIENT_ID

RUN npm run build
RUN npm prune

# Final stage

FROM base

COPY --from=build /home/app /home/app

EXPOSE ${PORT}

CMD [ "node", "/home/app/.output/server/index.mjs" ]