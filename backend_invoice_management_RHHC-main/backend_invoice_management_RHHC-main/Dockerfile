FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p src/uploads/temp

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "src/server.js"]
