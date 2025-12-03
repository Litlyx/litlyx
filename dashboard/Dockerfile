
FROM node:22-alpine as builder

RUN npm i -g pnpm
WORKDIR /home/app
COPY ./package*.json .
RUN pnpm install
COPY . .
RUN pnpm run build


FROM node:22-alpine

WORKDIR /home/app
COPY --from=builder  /home/app/.output .

CMD ["node", "/home/app/server/index.mjs"]