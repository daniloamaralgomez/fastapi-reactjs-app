############################
# Backend builder
############################

FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS backend-builder

# IMPORTANT: build directly in /app
WORKDIR /app

COPY backend/app/ ./

RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev


############################
# Frontend builder
############################

FROM node:22-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/app/package*.json ./

RUN npm ci

COPY frontend/app/ ./

# Frontend API URL
#
# Examples:
#   Single container deployment -> leave empty
#   Separate backend deployment -> https://backend.example.com
ARG VITE_API_BASE_URL=""

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}


RUN npm run build


############################
# Runtime
############################

FROM python:3.12-slim-bookworm

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    nginx \
    supervisor && \
    rm -rf /var/lib/apt/lists/*

# Remove Debian default nginx site
RUN rm -f /etc/nginx/sites-enabled/default

# Backend

COPY --from=backend-builder /app/.venv /app/.venv

COPY backend/app/main.py .

COPY backend/app/src ./src

# Frontend

COPY --from=frontend-builder \
     /frontend/dist \
     /usr/share/nginx/html

# Configs

COPY deploy/render/nginx.conf \
     /etc/nginx/conf.d/default.conf

COPY deploy/render/supervisord.conf \
     /etc/supervisor/conf.d/supervisord.conf

ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONPATH="/app/src" \
    PYTHONUNBUFFERED=1

EXPOSE 80

CMD ["/usr/bin/supervisord","-n","-c","/etc/supervisor/conf.d/supervisord.conf"]
