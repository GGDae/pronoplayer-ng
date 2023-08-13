# Use a base image with Node.js and Alpine Linux
FROM node:16.18.0 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files first to take advantage of Docker cache layer
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Angular app
RUN npm run build --prod

# Use a lighter base image for the final image
FROM nginx:1.21.1-alpine

# Copy the built Angular app from the builder stage to the nginx directory
COPY --from=builder /app/dist/sample /usr/share/nginx/html

# Expose the port that nginx listens on (default is 80)
EXPOSE 80

# The CMD is provided by the base nginx image, so no need to specify it here
