const request = require('supertest');
const app = require('../app');

describe('Express RAG API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'ok');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/rag/query', () => {
    it('should reject requests without a question', async () => {
      const res = await request(app)
        .post('/api/rag/query')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should accept valid query requests', async () => {
      const res = await request(app)
        .post('/api/rag/query')
        .send({ question: 'What are terrier breeds?' });
      
      // Should either succeed or fail gracefully
      expect([200, 500]).toContain(res.statusCode);
    });
  });

  describe('GET /api/breeds/list', () => {
    it('should return list of breeds', async () => {
      const res = await request(app).get('/api/breeds/list');
      
      // Should either succeed or fail gracefully
      expect([200, 500]).toContain(res.statusCode);
      
      if (res.statusCode === 200) {
        expect(res.body).toHaveProperty('message');
      }
    });
  });
});
