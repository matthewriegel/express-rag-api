# Example Queries for Testing the RAG System

This file contains example queries you can use to test the Express RAG API system.

## Basic Breed Queries

### Simple Breed Questions
```
What are terrier breeds?
Tell me about bulldogs
What do you know about hounds?
Which breeds are retrievers?
Are there any shepherd breeds?
```

### Sub-Breed Questions
```
What are the sub-breeds of terrier?
Does the bulldog breed have sub-breeds?
What varieties of shepherds exist?
Tell me about different types of hounds
What sub-breeds does the retriever have?
```

## Comparison Questions

```
What's the difference between a terrier and a hound?
Compare bulldogs and mastiffs
How are shepherds different from collies?
```

## General Questions

```
How many dog breeds are there?
What are the most common dog breeds?
Which breeds have the most sub-breeds?
Are there any breeds without sub-breeds?
```

## Specific Breed Information

```
Tell me about Yorkshire Terriers
What do you know about German Shepherds?
Describe the Labrador Retriever
Information about the English Bulldog
```

## Testing RAG Capabilities

Good questions to test the RAG system's ability to:

### Retrieve Relevant Context
```
What breeds are in the terrier family?
```
Expected: Should retrieve terrier-related documents

### Handle Missing Information
```
What is the temperament of a Golden Retriever?
```
Expected: Should acknowledge lack of information (not in dataset)

### Combine Multiple Facts
```
List all the breeds that have sub-breeds
```
Expected: Should combine information from multiple breed documents

## API Testing Examples

### Using curl

#### Basic Query
```bash
curl -X POST http://localhost:3001/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{"question":"What are terrier breeds?"}'
```

#### Get Breed List
```bash
curl http://localhost:3001/api/breeds/list
```

#### Get Breed Images
```bash
curl http://localhost:3001/api/breeds/hound/images?count=5
```

### Using JavaScript/Node

```javascript
const axios = require('axios');

async function askQuestion(question) {
  const response = await axios.post('http://localhost:3001/api/rag/query', {
    question: question
  });
  console.log('Answer:', response.data.answer);
  console.log('Sources:', response.data.sources);
}

askQuestion('What are terrier breeds?');
```

### Using Python

```python
import requests

def ask_question(question):
    response = requests.post(
        'http://localhost:3001/api/rag/query',
        json={'question': question}
    )
    data = response.json()
    print('Answer:', data['answer'])
    print('Sources:', data['sources'])

ask_question('What are terrier breeds?')
```

## Expected Response Format

```json
{
  "answer": "Based on the provided context, there are several terrier breeds available...",
  "sources": [
    {
      "breed": "terrier",
      "subBreed": "yorkshire",
      "similarity": 0.85
    },
    {
      "breed": "terrier",
      "subBreed": "bull",
      "similarity": 0.82
    }
  ],
  "context": "[1] Dog breed: terrier. This breed has the following sub-breeds..."
}
```

## Tips for Testing

1. **Start Simple**: Begin with basic questions about single breeds
2. **Test Edge Cases**: Try questions about non-existent breeds
3. **Check Sources**: Verify that returned sources are relevant
4. **Evaluate Answers**: Ensure answers are based on context, not hallucinated
5. **Monitor Performance**: Note response times for different query types

## Common Issues

### Issue: Generic Answers
If answers are too generic, try:
- More specific questions
- Questions about sub-breeds
- Comparisons between breeds

### Issue: No Relevant Sources
If sources don't seem relevant:
- Check the embedding quality
- Verify the index is initialized
- Try different query phrasing

### Issue: Slow Response
If queries are slow:
- Check LLM server health
- Monitor network latency
- Consider caching frequent queries
