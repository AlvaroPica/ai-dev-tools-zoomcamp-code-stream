# Stage 1: Base
FROM node:20-alpine AS base
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Development
# Usage: docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules codecollab-frontend:dev
FROM base AS dev
# Copy source code (will be hidden if volume is mounted, but node_modules will be preserved by the volume hack)
COPY . .
# Expose Vite port
EXPOSE 5173
# Bind to all interfaces
CMD ["npx", "vite", "--host"]

# Stage 3: Test
FROM base AS test
COPY . .
# Run tests
CMD ["npm", "run", "test", "--", "--run"]

# Stage 4: Build
FROM base AS builder
COPY . .
# Build the frontend
RUN npx vite build

# Stage 5: Production Serve
FROM nginx:stable-alpine AS prod
# Copy built assets from the builder stage
COPY --from=builder /app/dist/public /usr/share/nginx/html
# Copy custom nginx configuration
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
