# Start with a minimal Node.js base image
FROM node:21-alpine as base

# Install pnpm globally with caching to avoid reinstalling if nothing has changed
RUN npm i -g pnpm

# Set the working directory
WORKDIR /home/app

# Copy only package-related files to leverage caching
COPY --link ./scripts/package.json ./scripts/pnpm-lock.yaml ./scripts/
COPY --link ./shared/package.json ./shared/pnpm-lock.yaml ./shared/
COPY --link ./producer/package.json ./producer/pnpm-lock.yaml ./producer/

# Install dependencies for each package
WORKDIR /home/app/scripts
RUN pnpm install --frozen-lockfile

WORKDIR /home/app/shared
RUN pnpm install --frozen-lockfile

WORKDIR /home/app/producer
RUN pnpm install --frozen-lockfile

# Now copy the rest of the source files
WORKDIR /home/app

COPY --link ../scripts ./scripts
COPY --link ../shared ./shared
COPY --link ../producer ./producer

# Build the producer
WORKDIR /home/app/producer

RUN pnpm run build_all

# Start the application
CMD ["node", "/home/app/producer/dist/producer/src/index.js"]