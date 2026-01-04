# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (client + server)
# Note: npm run build now runs 'vite build && esbuild ...'
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy built artifacts and necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the port (Railway will override PORT env var, but 5000 is our default)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
