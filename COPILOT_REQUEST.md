### PROJECT GOAL
# Generate a full project scaffold with a testable Retrieval Augmented Generation (RAG) system.
#
# The system consists of:
# 1) A Next.js frontend UI for users to ask questions about dogs.
# 2) A Node/Express backend API that:
#    - Fetches dog data from https://dog.ceo/dog-api/ endpoints
#      including:
#      - /api/breeds/list/all
#      - /api/breeds/image/random
#      - /api/breed/{breed}/images
#      - /api/breed/{breed}/images/random
#      (and by sub-breed)  [oai_citation:1‡dog.ceo](https://dog.ceo/dog-api/documentation.php?utm_source=chatgpt.com)
#    - Stores text data extracted from these endpoints for RAG indexing.
#    - Provides a RAG endpoint that:
#      * Converts text data to embeddings
#      * Retrieves the most relevant Dog API info for a user query
#      * Assembles RAG context and responds with an LLM-generated response
#
# 3) A separate Dockerized LLM server (Python/llama.cpp or llama-cpp-python)
#    that:
#    - Loads a small open local model (e.g., phi-3-mini or Qwen 1.5B)
#    - Exposes a chat/completions API compatible with OpenAI style
#    - Is cached in GitHub Actions so the weights do not re-download every build
#
# 4) Docker Compose or multi-image deployment for both services.

### REQUIREMENTS
# - Next.js frontend calls our Express RAG API.
# - The Express RAG API fetches Dog API data, indexes it locally (vector store),
#   performs retrieval & calls the LLM server to generate answers.
# - RAG output must be based on context, not just hallucinated text.
# - Include automated integration tests in GitHub Actions that:
#   * Build the LLM image with cache
#   * Build the RAG API image
#   * Spin up services (docker compose) and run E2E tests
#
# Generate all files necessary:
# - /nextjs-ui
# - /express-rag-api
# - /llm-server
# - Dockerfiles
# - docker-compose.yml
# - GitHub Actions workflow (.github/workflows/deploy.yml)
# - RAG index builder
# - Testing scripts

### START FILES
# root README.md
# nextjs-ui/package.json, index page with chat UI
# express-rag-api/app.js, routes
# llm-server/server.py
# docker-compose.yml
# .github/workflows/deploy.yml

### CODE