const indexService = require('./indexService');
const llmService = require('./llmService');

class RagService {
  /**
   * Process a user query using RAG pipeline
   */
  async processQuery(question) {
    try {
      console.log('Processing query:', question);

      // Step 1: Retrieve relevant documents
      const relevantDocs = await indexService.retrieve(question, 5);
      console.log(`Retrieved ${relevantDocs.length} relevant documents`);

      // Step 2: Build context from retrieved documents
      const context = this.buildContext(relevantDocs);
      console.log('Context built, length:', context.length);

      // Step 3: Generate response using LLM
      const response = await llmService.generateResponse(question, context);
      console.log('Response generated');

      return {
        answer: response,
        sources: relevantDocs.map(doc => ({
          breed: doc.breed,
          subBreed: doc.subBreed,
          similarity: doc.similarity
        })),
        context: context.substring(0, 500) + '...' // Include partial context for debugging
      };
    } catch (error) {
      console.error('Error processing query:', error);
      throw error;
    }
  }

  /**
   * Build context string from retrieved documents
   */
  buildContext(documents) {
    if (!documents || documents.length === 0) {
      return 'No relevant information found.';
    }

    const contextParts = documents.map((doc, index) => {
      let part = `[${index + 1}] ${doc.text}`;
      if (doc.similarity) {
        part += ` (relevance: ${(doc.similarity * 100).toFixed(1)}%)`;
      }
      return part;
    });

    return contextParts.join('\n\n');
  }

  /**
   * Get statistics about the RAG system
   */
  async getStats() {
    const documents = indexService.getDocuments();
    const llmHealth = await llmService.checkHealth();

    return {
      indexInitialized: indexService.isInitialized(),
      documentCount: documents.length,
      llmServerStatus: llmHealth.status || 'unknown'
    };
  }
}

module.exports = new RagService();
