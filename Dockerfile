FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Make prepare-data script executable
RUN chmod +x prepare-data.sh

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "./prepare-data.sh && pnpm run dev --host 0.0.0.0"]
