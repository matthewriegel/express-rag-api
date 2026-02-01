const natural = require('natural');
const TfIdf = natural.TfIdf;

class EmbeddingService {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new TfIdf();
  }

  /**
   * Generate simple embedding using TF-IDF
   * In production, you'd use a real embedding model
   */
  generateEmbedding(text) {
    if (!text) return [];

    // Tokenize and normalize
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    
    // Create a simple bag-of-words vector
    const vocabulary = this.getVocabulary();
    const embedding = new Array(vocabulary.length).fill(0);
    
    tokens.forEach(token => {
      const index = vocabulary.indexOf(token);
      if (index !== -1) {
        embedding[index] += 1;
      }
    });

    // Normalize the vector
    return this.normalize(embedding);
  }

  /**
   * Get vocabulary (using a simple fixed vocabulary for consistency)
   */
  getVocabulary() {
    // In a real implementation, this would be built from the corpus
    // For now, we'll create a simple word-based embedding
    if (!this._vocabulary) {
      this._vocabulary = [
        'dog', 'breed', 'sub', 'variety', 'type', 'has', 'is', 'are',
        'terrier', 'hound', 'shepherd', 'retriever', 'bulldog', 'spaniel',
        'poodle', 'beagle', 'collie', 'husky', 'corgi', 'dalmatian',
        'mastiff', 'pointer', 'setter', 'schnauzer', 'sheepdog', 'mountain',
        'australian', 'german', 'english', 'french', 'american', 'scottish',
        'small', 'large', 'medium', 'coat', 'fur', 'hair', 'size',
        'follow', 'following', 'this', 'that', 'these', 'those', 'no', 'yes'
      ];
    }
    return this._vocabulary;
  }

  /**
   * Normalize a vector
   */
  normalize(vector) {
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return vector;
    return vector.map(val => val / magnitude);
  }

  /**
   * Calculate cosine similarity between two vectors
   */
  cosineSimilarity(vec1, vec2) {
    if (vec1.length !== vec2.length) {
      return 0;
    }

    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    if (mag1 === 0 || mag2 === 0) {
      return 0;
    }

    return dotProduct / (mag1 * mag2);
  }
}

module.exports = new EmbeddingService();
