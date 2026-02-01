# Express RAG API - Dog Information System

A full-stack Retrieval Augmented Generation (RAG) system for querying dog information using AI.

## Overview

This project demonstrates a complete RAG implementation with:

- **Next.js Frontend**: User-friendly chat interface for asking questions about dogs
- **Express Backend API**: RAG processing pipeline that fetches dog data and generates contextual responses
- **Python LLM Server**: Dockerized local LLM (Phi-3-mini or Qwen 1.5B) with OpenAI-compatible API
- **Docker Compose**: Multi-service orchestration
- **GitHub Actions**: Automated testing and deployment with model weight caching

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Next.js UI    │─────▶│  Express RAG API │─────▶│   LLM Server    │
│  (Port 3000)    │      │   (Port 3001)    │      │  (Port 8000)    │
└─────────────────┘      └──────────────────┘      └─────────────────┘
                                │
                                ▼
                         ┌─────────────┐
                         │  Dog CEO API│
                         │ (External)  │
                         └─────────────┘
```

## Features

### Frontend (Next.js)
- Clean, responsive chat UI
- Real-time question answering
- Dog breed information display

### Backend (Express)
- Dog CEO API integration
- Vector embeddings for RAG
- Context retrieval and ranking
- LLM integration for response generation

### LLM Server (Python)
- OpenAI-compatible API
- Local model inference (Phi-3-mini/Qwen)
- Optimized with llama.cpp

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Running with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# API: http://localhost:3001
# LLM Server: http://localhost:8000
```

### Local Development

#### Frontend
```bash
cd nextjs-ui
npm install
npm run dev
```

#### Express API
```bash
cd express-rag-api
npm install
npm run dev
```

#### LLM Server
```bash
cd llm-server
pip install -r requirements.txt
python server.py
```

## Project Structure

```
.
├── nextjs-ui/              # Next.js frontend application
│   ├── pages/              # Next.js pages
│   ├── components/         # React components
│   └── package.json
├── express-rag-api/        # Express backend API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── app.js              # Express app entry point
│   └── package.json
├── llm-server/             # Python LLM server
│   ├── server.py           # FastAPI server
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml      # Multi-service orchestration
└── .github/
    └── workflows/
        └── deploy.yml      # CI/CD pipeline
```

## API Endpoints

### Express RAG API

- `POST /api/rag/query` - Submit a question and get RAG-enhanced response
- `GET /api/breeds/list` - Get all dog breeds
- `GET /api/breeds/:breed/images` - Get images for a specific breed
- `GET /health` - Health check

### LLM Server

- `POST /v1/chat/completions` - OpenAI-compatible chat endpoint
- `GET /health` - Health check

## RAG Pipeline

1. **Data Ingestion**: Fetch dog breed data from Dog CEO API
2. **Embedding**: Convert text to vector embeddings
3. **Indexing**: Store embeddings in vector database
4. **Retrieval**: Find relevant context for user queries
5. **Generation**: Use LLM to generate responses with context

## Testing

### Run Tests Locally
```bash
# Run all tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

### GitHub Actions
The CI/CD pipeline automatically:
- Builds all Docker images
- Caches LLM model weights
- Runs integration tests
- Deploys on success

## Configuration

Environment variables:

### Express API
```
PORT=3001
LLM_SERVER_URL=http://llm-server:8000
DOG_API_URL=https://dog.ceo
```

### LLM Server
```
PORT=8000
MODEL_NAME=phi-3-mini
MODEL_PATH=/models
```

### Next.js
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Technologies

- **Frontend**: Next.js, React, TypeScript
- **Backend**: Node.js, Express
- **LLM**: Python, FastAPI, llama-cpp-python
- **Vector Store**: In-memory vector search (can be extended to Pinecone/Weaviate)
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT

## Acknowledgments

- Dog CEO API: https://dog.ceo/
- llama.cpp for efficient LLM inference
- OpenAI for API standards