# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Copy configuration files
COPY package*.json ./

# Install all dependencies (including devDependencies for the build)
RUN npm install

# Copy source code
COPY . .

# Generate the production build
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the compiled code from the build stage
COPY --from=build /usr/src/app/dist ./dist

# Start the application
CMD ["node", "dist/main"]