#!/usr/bin/env python3
"""
LLM Server with OpenAI-compatible API
Supports local models via llama.cpp
"""

import os
import sys
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Local LLM Server", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model configuration
MODEL_PATH = os.getenv("MODEL_PATH", "/models")
MODEL_NAME = os.getenv("MODEL_NAME", "phi-3-mini")
PORT = int(os.getenv("PORT", "8000"))

# Global model instance
llm = None


class Message(BaseModel):
    role: str
    content: str


class ChatCompletionRequest(BaseModel):
    model: str
    messages: List[Message]
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 500
    stream: Optional[bool] = False


class ChatCompletionChoice(BaseModel):
    index: int
    message: Message
    finish_reason: str


class ChatCompletionResponse(BaseModel):
    id: str
    object: str = "chat.completion"
    created: int
    model: str
    choices: List[ChatCompletionChoice]


def load_model():
    """Load the LLM model"""
    global llm
    
    try:
        from llama_cpp import Llama
        
        # Look for model files
        model_file = find_model_file()
        
        if not model_file:
            logger.warning("No model file found. Server will run in mock mode.")
            return None
        
        logger.info(f"Loading model from {model_file}...")
        llm = Llama(
            model_path=model_file,
            n_ctx=2048,
            n_threads=4,
            n_gpu_layers=0,  # Set to > 0 if GPU is available
        )
        logger.info("Model loaded successfully")
        return llm
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        logger.warning("Server will run in mock mode")
        return None


def find_model_file():
    """Find a GGUF model file in the models directory"""
    if not os.path.exists(MODEL_PATH):
        logger.warning(f"Model path {MODEL_PATH} does not exist")
        return None
    
    for filename in os.listdir(MODEL_PATH):
        if filename.endswith('.gguf'):
            return os.path.join(MODEL_PATH, filename)
    
    return None


def generate_mock_response(messages: List[Message]) -> str:
    """Generate a mock response when model is not available"""
    last_message = messages[-1].content if messages else ""
    
    # Simple keyword-based responses for testing
    content_lower = last_message.lower()
    
    if any(word in content_lower for word in ['terrier', 'terriers']):
        return ("Based on the provided context, there are several terrier breeds available in the system. "
                "Terriers are a group of dog breeds that were originally bred for hunting vermin. "
                "Some common terrier breeds include Yorkshire Terrier, Bull Terrier, and Scottish Terrier.")
    
    if any(word in content_lower for word in ['bulldog', 'bulldogs']):
        return ("Based on the context, bulldogs are a breed of dog known for their distinctive appearance. "
                "The system contains information about different bulldog varieties.")
    
    if any(word in content_lower for word in ['shepherd', 'shepherds']):
        return ("Based on the context, shepherd breeds are working dogs originally bred for herding livestock. "
                "The system includes information about various shepherd breeds and their sub-breeds.")
    
    if any(word in content_lower for word in ['hound', 'hounds']):
        return ("Based on the provided information, hounds are a group of hunting dogs. "
                "The system contains data about different hound breeds.")
    
    # Default response
    return (f"Based on the available dog breed information, I can help answer questions about various breeds. "
            f"However, I need more specific context to provide a detailed answer to your question: '{last_message}'. "
            f"Please try asking about specific breeds or characteristics.")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "model_loaded": llm is not None,
        "timestamp": datetime.now().isoformat()
    }


@app.post("/v1/chat/completions", response_model=ChatCompletionResponse)
async def chat_completions(request: ChatCompletionRequest):
    """OpenAI-compatible chat completions endpoint"""
    
    try:
        # Build prompt from messages
        prompt = ""
        for msg in request.messages:
            if msg.role == "system":
                prompt += f"System: {msg.content}\n\n"
            elif msg.role == "user":
                prompt += f"User: {msg.content}\n\n"
            elif msg.role == "assistant":
                prompt += f"Assistant: {msg.content}\n\n"
        
        prompt += "Assistant: "
        
        # Generate response
        if llm:
            logger.info("Generating response with loaded model")
            output = llm(
                prompt,
                max_tokens=request.max_tokens,
                temperature=request.temperature,
                stop=["User:", "\n\n"],
            )
            response_text = output['choices'][0]['text'].strip()
        else:
            logger.info("Generating mock response (model not loaded)")
            response_text = generate_mock_response(request.messages)
        
        # Create response
        response = ChatCompletionResponse(
            id=f"chatcmpl-{datetime.now().timestamp()}",
            created=int(datetime.now().timestamp()),
            model=request.model,
            choices=[
                ChatCompletionChoice(
                    index=0,
                    message=Message(role="assistant", content=response_text),
                    finish_reason="stop"
                )
            ]
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error generating completion: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "LLM Server is running",
        "endpoints": {
            "health": "/health",
            "chat": "/v1/chat/completions"
        }
    }


if __name__ == "__main__":
    logger.info("Starting LLM Server...")
    logger.info(f"Model path: {MODEL_PATH}")
    logger.info(f"Model name: {MODEL_NAME}")
    
    # Try to load model
    load_model()
    
    # Start server
    uvicorn.run(app, host="0.0.0.0", port=PORT)
