const express = require('express');
const router = express.Router();
const ragService = require('../services/ragService');

/**
 * POST /api/rag/query
 * Submit a question and get a RAG-enhanced response
 */
router.post('/query', async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required and must be a string' });
    }

    console.log('Received query:', question);

    const response = await ragService.processQuery(question);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
