require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ragRoutes = require('./src/routes/rag');
const breedRoutes = require('./src/routes/breeds');
const indexService = require('./src/services/indexService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/rag', ragRoutes);
app.use('/api/breeds', breedRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialize the index on startup
async function initialize() {
  try {
    console.log('Initializing RAG index...');
    await indexService.initializeIndex();
    console.log('RAG index initialized successfully');
  } catch (error) {
    console.error('Failed to initialize index:', error);
    // Continue running even if index initialization fails
  }
}

// Start server
if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`Express RAG API running on port ${PORT}`);
    await initialize();
  });
}

module.exports = app;
