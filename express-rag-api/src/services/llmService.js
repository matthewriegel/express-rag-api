const axios = require('axios');

const LLM_SERVER_URL = process.env.LLM_SERVER_URL || 'http://localhost:8000';

class LlmService {
  /**
   * Generate a response using the LLM server
   */
  async generateResponse(prompt, context = '') {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful assistant that answers questions about dogs based on the provided context. Only use information from the context to answer questions. If the context does not contain relevant information, say so.'
        }
      ];

      if (context) {
        messages.push({
          role: 'system',
          content: `Context information:\n${context}`
        });
      }

      messages.push({
        role: 'user',
        content: prompt
      });

      const response = await axios.post(
        `${LLM_SERVER_URL}/v1/chat/completions`,
        {
          model: 'local-model',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500
        },
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      }

      throw new Error('Invalid response from LLM server');
    } catch (error) {
      console.error('Error calling LLM server:', error.message);
      
      // If LLM server is not available, return a fallback response
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        console.warn('LLM server unavailable, using fallback response');
        return this.fallbackResponse(prompt, context);
      }
      
      throw error;
    }
  }

  /**
   * Fallback response when LLM server is unavailable
   */
  fallbackResponse(prompt, context) {
    if (context) {
      return `Based on the available dog breed information: ${context.substring(0, 300)}... \n\nNote: LLM server is currently unavailable. This is a simple context-based response.`;
    }
    return 'I apologize, but I am currently unable to process your request. The LLM service is unavailable.';
  }

  /**
   * Check if LLM server is healthy
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${LLM_SERVER_URL}/health`, { timeout: 5000 });
      return response.data;
    } catch (error) {
      return { status: 'unavailable', error: error.message };
    }
  }
}

module.exports = new LlmService();
