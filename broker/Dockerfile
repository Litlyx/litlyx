FROM node:21-alpine
WORKDIR /home/app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile
COPY ./dist /home/app/dist
EXPOSE ${PORT}
CMD ["node", "dist/broker/src/index.js"]