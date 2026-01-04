FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove development dependencies to save space (optional, but good practice)
# RUN npm prune --production

# Set production environment
ENV NODE_ENV=production

# Expose the port Railway expects (they will inject PORT=5000 if we expose it)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
