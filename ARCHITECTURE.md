# Express RAG API - Architecture

## System Architecture

The Express RAG API is built using a microservices architecture with three main components:

### 1. Frontend (Next.js)
- **Technology**: Next.js 14, React 18
- **Port**: 3000
- **Purpose**: User-facing chat interface
- **Key Features**:
  - Server-side rendering for optimal performance
  - Real-time chat interface
  - Responsive design
  - API integration with Express backend

### 2. Backend API (Express)
- **Technology**: Node.js, Express
- **Port**: 3001
- **Purpose**: RAG processing and Dog API integration
- **Key Components**:
  - **Routes**: Handle HTTP requests
  - **Services**: Business logic layer
    - `dogApiService`: Fetch data from Dog CEO API
    - `indexService`: Manage vector embeddings index
    - `embeddingService`: Generate text embeddings
    - `ragService`: Orchestrate RAG pipeline
    - `llmService`: Interface with LLM server

### 3. LLM Server (Python/FastAPI)
- **Technology**: Python 3.11, FastAPI, llama-cpp-python
- **Port**: 8000
- **Purpose**: Local LLM inference
- **Key Features**:
  - OpenAI-compatible API
  - Supports GGUF format models
  - Mock mode when model not available
  - Optimized for CPU inference

## Data Flow

### RAG Query Pipeline

```
1. User enters question in UI
   ↓
2. Frontend sends POST /api/rag/query
   ↓
3. Backend retrieves question
   ↓
4. indexService.retrieve() finds relevant documents
   - Generates query embedding
   - Computes cosine similarity with all documents
   - Returns top K most similar documents
   ↓
5. ragService.buildContext() creates context string
   ↓
6. llmService.generateResponse() calls LLM
   - Constructs prompt with system message + context + question
   - Sends to LLM server at /v1/chat/completions
   ↓
7. LLM Server processes request
   - Loads model (if available)
   - Generates response based on context
   - Returns completion
   ↓
8. Backend assembles response with answer + sources
   ↓
9. Frontend displays answer and citations
```

### Index Building Pipeline

```
1. Application starts
   ↓
2. indexService.initializeIndex()
   ↓
3. dogApiService.getDataForIndexing()
   - Fetches all breeds from Dog CEO API
   - Creates text documents for each breed/sub-breed
   ↓
4. embeddingService.generateEmbedding()
   - Tokenizes text
   - Creates bag-of-words vectors
   - Normalizes vectors
   ↓
5. Stores embeddings in memory
   ↓
6. Ready to process queries
```

## Vector Similarity

The system uses a simple TF-IDF-like approach for embeddings:

1. **Vocabulary**: Fixed set of common dog-related terms
2. **Embedding**: Bag-of-words vector with normalization
3. **Similarity**: Cosine similarity between vectors

### Formula

```
similarity(q, d) = (q · d) / (||q|| × ||d||)
```

Where:
- q = query embedding vector
- d = document embedding vector
- · = dot product
- ||v|| = vector magnitude

## Model Loading (LLM Server)

The LLM server supports multiple modes:

### 1. Real Model Mode
- Loads GGUF model from `/models` directory
- Uses llama.cpp for efficient inference
- Configurable context size and threads

### 2. Mock Mode
- Activates when no model file found
- Returns keyword-based responses
- Useful for testing without large model files

## API Contracts

### Express API

#### POST /api/rag/query
Request:
```json
{
  "question": "What are terrier breeds?"
}
```

Response:
```json
{
  "answer": "Based on the context...",
  "sources": [
    {
      "breed": "terrier",
      "subBreed": "yorkshire",
      "similarity": 0.85
    }
  ],
  "context": "..."
}
```

### LLM Server

#### POST /v1/chat/completions
Request:
```json
{
  "model": "local-model",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

Response:
```json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1234567890,
  "model": "local-model",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "..."
      },
      "finish_reason": "stop"
    }
  ]
}
```

## Scalability Considerations

### Current Implementation (MVP)
- In-memory vector store
- Single instance per service
- Synchronous processing

### Future Enhancements
1. **Vector Store**: Replace with Pinecone, Weaviate, or Milvus
2. **Caching**: Add Redis for query results
3. **Load Balancing**: Multiple API instances
4. **Async Processing**: Queue system for long-running queries
5. **Model Server**: Separate model serving layer (e.g., vLLM)

## Security Considerations

1. **API Security**:
   - CORS configuration
   - Rate limiting (to be added)
   - Input validation

2. **LLM Safety**:
   - System prompts restrict output to context
   - Max token limits prevent abuse
   - Timeout protection

3. **Data Privacy**:
   - No user data persistence
   - Stateless API design
   - Public data sources only

## Performance Metrics

### Expected Performance
- **Index Size**: ~200 breed documents
- **Query Time**: 
  - Retrieval: <50ms
  - LLM inference: 1-5s (CPU), <1s (GPU)
  - Total: 1-5s per query

### Optimization Opportunities
1. Batch processing for initial indexing
2. Caching frequent queries
3. Model quantization for faster inference
4. GPU acceleration for LLM
