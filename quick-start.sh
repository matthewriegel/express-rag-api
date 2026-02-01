#!/bin/bash

# Quick start script for Express RAG API
# This script helps set up and run the entire system

set -e

echo "========================================="
echo "  Express RAG API - Quick Start"
echo "========================================="
echo ""

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi
echo "✓ Docker found"

if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
echo "✓ Docker Compose found"

echo ""
echo "========================================="
echo "  Starting Services"
echo "========================================="
echo ""

# Build and start services
echo "Building Docker images (this may take a few minutes)..."
docker compose build

echo ""
echo "Starting services..."
docker compose up -d

echo ""
echo "Waiting for services to be ready..."

# Wait for LLM server
echo -n "Waiting for LLM server..."
for i in {1..30}; do
    if curl -s -f http://localhost:8000/health > /dev/null 2>&1; then
        echo " ✓"
        break
    fi
    echo -n "."
    sleep 2
done

# Wait for Express API
echo -n "Waiting for Express API..."
for i in {1..30}; do
    if curl -s -f http://localhost:3001/health > /dev/null 2>&1; then
        echo " ✓"
        break
    fi
    echo -n "."
    sleep 2
done

# Wait for Next.js
echo -n "Waiting for Next.js UI..."
for i in {1..30}; do
    if curl -s -f http://localhost:3000 > /dev/null 2>&1; then
        echo " ✓"
        break
    fi
    echo -n "."
    sleep 2
done

echo ""
echo "========================================="
echo "  🎉 System is Ready!"
echo "========================================="
echo ""
echo "Services are running:"
echo "  • Frontend UI:  http://localhost:3000"
echo "  • Express API:  http://localhost:3001"
echo "  • LLM Server:   http://localhost:8000"
echo ""
echo "To view logs:"
echo "  docker compose logs -f"
echo ""
echo "To stop services:"
echo "  docker compose down"
echo ""
echo "To run tests:"
echo "  ./test-system.sh"
echo ""
echo "Opening browser..."

# Try to open browser (cross-platform)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000
elif command -v open &> /dev/null; then
    open http://localhost:3000
else
    echo "Please open http://localhost:3000 in your browser"
fi
