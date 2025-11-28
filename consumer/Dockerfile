
FROM node:22-alpine as builder
RUN npm i -g pnpm
WORKDIR /home/app
COPY ./package*.json .
RUN pnpm install
COPY . .
RUN pnpm run compile-only
RUN pnpm run create_db

FROM node:22-alpine
WORKDIR /home/app
RUN npm i -g pnpm
COPY package*.json ./
RUN pnpm install
COPY --from=builder  /home/app/dist .

CMD ["node", "/home/app/index.js"]