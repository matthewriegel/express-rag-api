FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY server.py .

# Create models directory
RUN mkdir -p /models

# Download a small model (optional - can be cached in CI)
# Uncomment to auto-download a model
# RUN wget -O /models/phi-3-mini.gguf \
#     https://huggingface.co/microsoft/Phi-3-mini-4k-instruct-gguf/resolve/main/Phi-3-mini-4k-instruct-q4.gguf

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

CMD ["python", "server.py"]
