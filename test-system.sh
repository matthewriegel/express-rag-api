#!/bin/bash

# Test script for the Express RAG API system
# This script demonstrates the key features of the system

set -e

echo "==================================="
echo "Express RAG API System Test"
echo "==================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

API_URL="${API_URL:-http://localhost:3001}"
LLM_URL="${LLM_URL:-http://localhost:8000}"

echo -e "${BLUE}Testing LLM Server...${NC}"
if curl -s -f "$LLM_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ LLM Server is running${NC}"
    curl -s "$LLM_URL/health" | python3 -m json.tool
else
    echo -e "${RED}✗ LLM Server is not available${NC}"
fi
echo ""

echo -e "${BLUE}Testing Express API Health...${NC}"
if curl -s -f "$API_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Express API is running${NC}"
    curl -s "$API_URL/health" | python3 -m json.tool
else
    echo -e "${RED}✗ Express API is not available${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Testing Dog Breeds List...${NC}"
echo "Fetching all dog breeds..."
response=$(curl -s "$API_URL/api/breeds/list")
if echo "$response" | grep -q "status"; then
    echo -e "${GREEN}✓ Breeds endpoint working${NC}"
    echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Found {len(data.get(\"message\", {}))} breeds')" 2>/dev/null || echo "Response received"
else
    echo -e "${RED}✗ Breeds endpoint failed${NC}"
fi
echo ""

echo -e "${BLUE}Testing RAG Query Endpoint...${NC}"
echo "Asking: 'What are terrier breeds?'"
echo ""

response=$(curl -s -X POST "$API_URL/api/rag/query" \
    -H "Content-Type: application/json" \
    -d '{"question":"What are terrier breeds?"}')

if echo "$response" | grep -q "answer"; then
    echo -e "${GREEN}✓ RAG query successful${NC}"
    echo ""
    echo "Response:"
    echo "$response" | python3 -m json.tool
else
    echo -e "${RED}✗ RAG query failed${NC}"
    echo "$response"
fi
echo ""

echo -e "${BLUE}Testing another question...${NC}"
echo "Asking: 'Tell me about bulldogs'"
echo ""

response=$(curl -s -X POST "$API_URL/api/rag/query" \
    -H "Content-Type: application/json" \
    -d '{"question":"Tell me about bulldogs"}')

if echo "$response" | grep -q "answer"; then
    echo -e "${GREEN}✓ Second query successful${NC}"
    echo ""
    echo "Response:"
    echo "$response" | python3 -m json.tool
else
    echo -e "${RED}✗ Second query failed${NC}"
    echo "$response"
fi
echo ""

echo -e "${BLUE}Testing breed images endpoint...${NC}"
echo "Fetching images for 'hound'..."

response=$(curl -s "$API_URL/api/breeds/hound/images?count=3")
if echo "$response" | grep -q "message"; then
    echo -e "${GREEN}✓ Breed images endpoint working${NC}"
    echo "$response" | python3 -c "import sys, json; data=json.load(sys.stdin); print(f'Found {len(data.get(\"message\", []))} images')" 2>/dev/null || echo "Response received"
else
    echo -e "${RED}✗ Breed images endpoint failed${NC}"
fi
echo ""

echo "==================================="
echo -e "${GREEN}Test Suite Complete!${NC}"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Try asking questions about dog breeds"
echo "3. View the interactive chat UI"
echo ""
