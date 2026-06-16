# -- Stage 1: Build the React application --
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package management files first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies needed for building)
RUN npm ci

# Copy the rest of the application source code
COPY . .

ARG VITE_API_BASE_URL=""

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the production assets (Vite outputs to the 'dist' folder)
RUN npm run build

# -- Stage 2: Serve the assets using Nginx --
FROM nginx:1.27-alpine AS runtime

# Copy our custom Nginx configuration over the default one
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled static assets from the builder stage to Nginx's HTML directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx in the foreground so the Docker container stays active
CMD ["nginx", "-g", "daemon off;"]
