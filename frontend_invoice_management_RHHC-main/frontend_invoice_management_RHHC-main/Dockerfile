FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (skip puppeteer chrome download)
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm install

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
