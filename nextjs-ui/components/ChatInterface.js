import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/ChatInterface.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/rag/query`, {
        question: userMessage
      });

      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your question. Please try again.',
        error: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "What dog breeds are terriers?",
    "Tell me about bulldogs",
    "What are the sub-breeds of shepherd dogs?",
    "Which breeds are hounds?"
  ];

  const handleExampleClick = (question) => {
    setInput(question);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages.length === 0 && (
          <div className={styles.welcome}>
            <h3>👋 Welcome! Try asking:</h3>
            <div className={styles.examples}>
              {exampleQuestions.map((q, i) => (
                <button
                  key={i}
                  className={styles.exampleBtn}
                  onClick={() => handleExampleClick(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${styles.message} ${styles[msg.role]} ${msg.error ? styles.error : ''}`}
          >
            <div className={styles.messageHeader}>
              {msg.role === 'user' ? '👤 You' : '🤖 Assistant'}
            </div>
            <div className={styles.messageContent}>{msg.content}</div>
            {msg.sources && msg.sources.length > 0 && (
              <div className={styles.sources}>
                <strong>Sources:</strong>
                <ul>
                  {msg.sources.slice(0, 3).map((source, i) => (
                    <li key={i}>
                      {source.breed}
                      {source.subBreed && ` - ${source.subBreed}`}
                      {source.similarity && ` (${(source.similarity * 100).toFixed(0)}% match)`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.messageHeader}>🤖 Assistant</div>
            <div className={styles.messageContent}>
              <div className={styles.loader}>Thinking...</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about dog breeds..."
          className={styles.input}
          disabled={loading}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={loading || !input.trim()}
        >
          {loading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
}
