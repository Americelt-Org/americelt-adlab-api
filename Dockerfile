FROM node:22

# Set working directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Generate Prisma client at build time
RUN npx prisma generate --schema ./prisma/schema

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3001

# Run migrations on container start, then start app
CMD ["sh", "-c", "npx prisma migrate deploy --schema ./prisma/schema && npm run start"]