# Contributing to Express RAG API

Thank you for your interest in contributing to the Express RAG API project! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/express-rag-api.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit and push
7. Open a pull request

## Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker and Docker Compose

### Local Development

#### Express API
```bash
cd express-rag-api
npm install
cp .env.example .env
npm run dev
```

#### Next.js UI
```bash
cd nextjs-ui
npm install
cp .env.local.example .env.local
npm run dev
```

#### LLM Server
```bash
cd llm-server
pip install -r requirements.txt
python server.py
```

## Code Style

### JavaScript/Node.js
- Use ES6+ features
- Use async/await for asynchronous operations
- Follow the existing code structure
- Add JSDoc comments for functions

### Python
- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings for functions and classes

### General
- Write meaningful commit messages
- Keep changes focused and atomic
- Update documentation when needed

## Testing

### Running Tests

#### Express API
```bash
cd express-rag-api
npm test
```

#### Integration Tests
```bash
./test-system.sh
```

### Writing Tests
- Add unit tests for new functionality
- Ensure tests pass before submitting PR
- Aim for good test coverage

## Pull Request Process

1. **Update Documentation**: Update README.md and other docs as needed
2. **Add Tests**: Include tests for new features
3. **Follow Code Style**: Ensure code follows project conventions
4. **Describe Changes**: Provide clear description of what and why
5. **Link Issues**: Reference any related issues

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Commits are clean and well-organized

## Project Structure

```
.
├── express-rag-api/     # Backend API
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── utils/       # Utility functions
│   └── tests/           # Test files
├── nextjs-ui/           # Frontend application
│   ├── pages/           # Next.js pages
│   ├── components/      # React components
│   └── styles/          # CSS files
├── llm-server/          # Python LLM server
└── .github/workflows/   # CI/CD pipelines
```

## Key Areas for Contribution

### High Priority
- Improve embedding quality
- Add more sophisticated vector search
- Enhance LLM prompt engineering
- Improve error handling
- Add authentication/authorization

### Nice to Have
- Support for more LLM models
- Persistent vector store integration
- Query caching
- Admin dashboard
- API rate limiting

### Documentation
- Improve setup instructions
- Add troubleshooting guides
- Create video tutorials
- API documentation

## Reporting Bugs

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: OS, Node version, Docker version, etc.
6. **Logs**: Relevant error messages or logs

## Feature Requests

For feature requests, please:

1. Check if the feature already exists or is planned
2. Clearly describe the feature and its benefits
3. Provide use cases
4. Consider implementation complexity

## Code Review Process

1. PRs require at least one approval
2. All tests must pass
3. Code must follow style guidelines
4. Documentation must be updated
5. No merge conflicts

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Give constructive feedback
- Follow the code of conduct

## Questions?

If you have questions:
- Open an issue for discussion
- Check existing issues and PRs
- Review the documentation

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for contributing to Express RAG API! 🎉
