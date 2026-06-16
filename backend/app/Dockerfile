# -- Stage 1: Build env and install dependencies --
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

# Set up working directory
WORKDIR /app

# Enable bytecode compilation for faster startup
ENV UV_COMPILE_BYTECODE=1

# Copy only configuration files needed for dependency installation
# This leverages Docker's layer caching effectively
COPY pyproject.toml uv.lock ./

# Install dependencies using a cache mount to speed up subsequent builds.
# We use --no-install-project because we haven't copied the source code yet.
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev --no-install-project

# -- Stage 2: Final minimal runtime image --
FROM python:3.12-slim-bookworm AS runtime

WORKDIR /app

# Create a non-privileged user for security compliance
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy the virtual environment from the builder stage
# uv creates the venv at /app/.venv by default
COPY --from=builder /app/.venv /app/.venv

# Copy the rest of your application source code
COPY main.py ./
COPY src/ ./src/

# Environment variables:
# 1. Place the virtual environment's bin at the front of the PATH
# 2. Force python to output logs immediately (no buffering)
# 3. Includes PYTHONPATH
ENV PATH="/app/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH="/app/src"

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:appuser /app
USER appuser

# Expose the application port
EXPOSE 8000

# Run Uvicorn directly from the virtual environment (production settings)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
