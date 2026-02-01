const dogApiService = require('./dogApiService');
const embeddingService = require('./embeddingService');

class IndexService {
  constructor() {
    this.documents = [];
    this.embeddings = [];
    this.initialized = false;
  }

  /**
   * Initialize the index with dog breed data
   */
  async initializeIndex() {
    try {
      console.log('Fetching dog breed data...');
      this.documents = await dogApiService.getDataForIndexing();
      console.log(`Fetched ${this.documents.length} documents`);

      console.log('Generating embeddings...');
      this.embeddings = this.documents.map(doc => ({
        id: doc.id,
        embedding: embeddingService.generateEmbedding(doc.text),
        metadata: doc
      }));
      console.log(`Generated ${this.embeddings.length} embeddings`);

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error initializing index:', error);
      throw error;
    }
  }

  /**
   * Retrieve relevant documents for a query
   */
  async retrieve(query, topK = 5) {
    if (!this.initialized) {
      await this.initializeIndex();
    }

    const queryEmbedding = embeddingService.generateEmbedding(query);

    // Calculate cosine similarity for all documents
    const similarities = this.embeddings.map(item => ({
      ...item,
      similarity: embeddingService.cosineSimilarity(queryEmbedding, item.embedding)
    }));

    // Sort by similarity and get top K
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topResults = similarities.slice(0, topK);

    return topResults.map(result => ({
      ...result.metadata,
      similarity: result.similarity
    }));
  }

  /**
   * Get all indexed documents
   */
  getDocuments() {
    return this.documents;
  }

  /**
   * Check if index is initialized
   */
  isInitialized() {
    return this.initialized;
  }
}

module.exports = new IndexService();
