# Getting Started

This guide will help you set up and run the Express RAG API project.

## Prerequisites

- Docker and Docker Compose (recommended)
- OR Node.js 18+, Python 3.11+ for local development

## Quick Start with Docker

1. Clone the repository:
```bash
git clone https://github.com/matthewriegel/express-rag-api.git
cd express-rag-api
```

2. Start all services:
```bash
docker-compose up --build
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Express API: http://localhost:3001
   - LLM Server: http://localhost:8000

## Local Development Setup

### Express RAG API

```bash
cd express-rag-api
npm install
cp .env.example .env
npm run dev
```

The API will be available at http://localhost:3001

### Next.js Frontend

```bash
cd nextjs-ui
npm install
cp .env.local.example .env.local
npm run dev
```

The UI will be available at http://localhost:3000

### Python LLM Server

```bash
cd llm-server
pip install -r requirements.txt
python server.py
```

The LLM server will be available at http://localhost:8000

## Testing the System

### Test the API directly

```bash
# Health check
curl http://localhost:3001/health

# Get all breeds
curl http://localhost:3001/api/breeds/list

# Query with RAG
curl -X POST http://localhost:3001/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"question":"What are terrier breeds?"}'
```

### Test the LLM Server

```bash
# Health check
curl http://localhost:8000/health

# Chat completion
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "local-model",
    "messages": [
      {"role": "user", "content": "What are dog breeds?"}
    ]
  }'
```

## Using the Frontend

1. Open http://localhost:3000 in your browser
2. Type a question about dog breeds in the chat interface
3. The system will:
   - Retrieve relevant breed information from the vector index
   - Send the context to the LLM
   - Display the AI-generated response with sources

## Example Questions

- "What dog breeds are terriers?"
- "Tell me about bulldogs"
- "What are the sub-breeds of shepherd dogs?"
- "Which breeds are hounds?"

## Troubleshooting

### Services not starting

Check Docker logs:
```bash
docker-compose logs llm-server
docker-compose logs express-api
docker-compose logs nextjs-ui
```

### LLM Server in mock mode

The LLM server will run in mock mode if no model file is found. To use a real model:

1. Download a GGUF model file (e.g., Phi-3-mini)
2. Place it in `llm-server/models/`
3. Restart the service

### Port conflicts

If ports 3000, 3001, or 8000 are already in use, you can modify the ports in `docker-compose.yml`

## Development Tips

### Hot Reload

- Express API: Uses nodemon for auto-reload on file changes
- Next.js: Has built-in hot module replacement
- LLM Server: Restart manually after changes

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f express-api
```

### Rebuilding After Changes

```bash
# Rebuild all services
docker-compose up --build

# Rebuild specific service
docker-compose up --build express-api
```

## Next Steps

- Add more sophisticated embedding models
- Implement persistent vector storage
- Add user authentication
- Deploy to cloud platform
- Enhance LLM prompts for better responses
