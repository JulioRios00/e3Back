FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Build the application
RUN npm run build

EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "start:prod"]