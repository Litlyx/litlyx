FROM node:21-alpine
WORKDIR /home/app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile
COPY ./.output /home/app/dist
EXPOSE ${PORT}
CMD ["node", "dist/server/index.mjs"]