# AI Resume Generator - Contributing Guide

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/ai-resume-generator.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Run setup: `npm install && cp .env.local.example .env.local`

## Development Workflow

```bash
# Start dev server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

## Code Standards

- Use TypeScript for all new code
- Follow ESLint rules
- Format with Prettier
- Add comments for complex logic
- Test manually before committing

## Commit Message Format

```
type(scope): description

[optional body]
[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Example: `feat(auth): add Google OAuth login`

## Pull Request Process

1. Update README.md with any new features
2. Ensure all tests pass and linter is happy
3. Provide clear description of changes
4. Link any related issues
5. Request review from maintainers

## Reporting Bugs

Create an issue with:
- Clear title
- Description of expected vs actual behavior
- Steps to reproduce
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

## Feature Requests

Open an issue describing:
- Problem you're solving
- Proposed solution
- Alternative solutions considered
- Any relevant context

## Questions?

Ask in GitHub issues or discussions.

Thank you for contributing! 🎉
