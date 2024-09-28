# Start with a minimal Node.js base image
FROM node:21-alpine AS base

# Create a distinct build environment
FROM base AS build

# Install pnpm globally with caching to avoid reinstalling if nothing has changed
RUN npm i -g pnpm

# Set the working directory
WORKDIR /home/app

# Copy only package-related files to leverage caching
COPY --link ./dashboard/package.json ./dashboard/pnpm-lock.yaml ./dashboard/
COPY --link ./lyx-ui/package.json ./lyx-ui/pnpm-lock.yaml ./lyx-ui/
COPY --link ./shared/package.json ./shared/pnpm-lock.yaml ./shared/

# Install dependencies for each package
WORKDIR /home/app/lyx-ui
RUN pnpm install --frozen-lockfile

# WORKDIR /home/app/shared
# RUN pnpm install --frozen-lockfile

WORKDIR /home/app/dashboard
RUN pnpm install --frozen-lockfile

# Now copy the rest of the source files
WORKDIR /home/app

COPY --link ./dashboard ./dashboard
COPY --link ./lyx-ui ./lyx-ui
COPY --link ./shared ./shared

# Build the dashboard
WORKDIR /home/app/dashboard

RUN pnpm run build

# Use a smaller base image for the final production build
FROM node:21-alpine AS production

# Set the working directory for the production container
WORKDIR /home/app

# Copy the built application from the build stage
COPY --from=build /home/app/dashboard/.output /home/app/.output

# Start the application
CMD ["node", "/home/app/.output/server/index.mjs"]