# Contributing to AutoCare Advisor

🎉 ```bash

# Clone repository

git clone https://github.com/COLORtastic/autocare-advisor.git
cd autocare-advisork you for contributing to AutoCare Advisor! This document provides guidelines for team CLEANtastic and external contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Linear Integration](#linear-integration)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Performance Guidelines](#performance-guidelines)

## 📜 Code of Conduct

### Our Standards

- **Professional Communication** - Constructive feedback and respectful discussions
- **Collaborative Spirit** - Help team members and share knowledge
- **Quality Focus** - Prioritize code quality and user experience
- **Business Awareness** - Understand the B2B SaaS context and revenue implications

### What's Not Allowed

- ❌ **AI/ML Libraries** - Only rule-based recommendations allowed
- ❌ **Widget Development** - This is a standalone platform, not embeddable widgets
- ❌ **Shortcuts on Testing** - 90% coverage minimum required
- ❌ **Performance Compromises** - <100ms recommendation response time is non-negotiable

## 🚀 Getting Started

### Prerequisites

```bash
# Required software
Node.js >= 18.0.0
Docker & Docker Compose
Git with SSH keys configured
VS Code (recommended)
```

### First-Time Setup

```bash
# 1. Clone repository
git clone https://github.com/CLEANtastic/autocare-advisor.git
cd autocare-advisor

# 2. Install dependencies
npm run install:all

# 3. Environment setup
cp .env.example .env.local
# Edit .env.local with your local configuration

# 4. Start development environment
.\scripts\setup-terminals.ps1 -Action start
```

### VS Code Configuration

This project includes comprehensive VS Code settings:

```bash
# Install recommended extensions (VS Code will prompt)
# Use predefined terminal setup
# Debug configurations ready for Frontend + Backend
```

## 🔄 Development Workflow

### Branch Strategy

```bash
# Feature development
git checkout -b feature/CL-{issue-number}-{short-description}

# Bug fixes
git checkout -b bugfix/CL-{issue-number}-{bug-description}

# Epic work
git checkout -b epic/CL-{issue-number}-{epic-name}
```

### Daily Development Flow

1. **Check Linear** - Pick up assigned issues from AutoCare Advisor project
2. **Create Branch** - Use Linear issue number in branch name
3. **Write Tests First** - TDD approach for new features
4. **Implement Feature** - Follow TypeScript + code standards
5. **Run Full Test Suite** - Ensure 90%+ coverage
6. **Performance Check** - Verify recommendation engine <100ms
7. **Create PR** - Include Linear issue reference

## 📊 Linear Integration

### Issue Management

- **All work** must be tracked in Linear issues
- **Branch names** must include Linear issue numbers
- **Commit messages** must reference Linear issues
- **PR descriptions** must link to Linear issues

### Commit Message Format

```bash
# Format: type(scope): description
feat(CL-123): implement vehicle-specific product filtering
fix(CL-124): resolve MongoDB connection timeout
docs(CL-125): update API documentation for recommendation endpoints
test(CL-126): add integration tests for recommendation engine

# Valid types: feat, fix, docs, style, refactor, perf, test, chore
```

### Linear Labels Usage

- **Phase 1-4** - Development phase tracking
- **Frontend/Backend/Database** - Component classification
- **🚨 Critical/✨ Feature/🐛 Bug** - Priority and type
- **🧪 Testing** - Testing-related tasks

## 💻 Code Standards

### TypeScript Requirements

```typescript
// ✅ Always use strict typing
interface ProductRecommendation {
  product: Product;
  matchScore: number;
  reasoning: string[];
  partnerTier: PartnerTier;
}

// ✅ Comprehensive error handling
class RecommendationEngine {
  generateRecommendations(answers: CustomerAnswers): ProductRecommendation[] {
    try {
      // Implementation here
    } catch (error) {
      logger.error('Recommendation generation failed', { error, answers });
      throw new RecommendationError('Unable to generate recommendations');
    }
  }
}

// ❌ Avoid any types
// ❌ No implicit any
// ❌ No unused variables
```

### Code Organization

```
src/
├── components/          # React components
├── services/           # Business logic
├── utils/              # Helper functions
├── types/              # TypeScript definitions
├── hooks/              # Custom React hooks
├── constants/          # App constants
└── tests/              # Test files
```

### Naming Conventions

```typescript
// Components: PascalCase
const RecommendationEngine = () => { ... }

// Functions: camelCase
const calculateMatchScore = (product: Product) => { ... }

// Constants: SCREAMING_SNAKE_CASE
const MAX_RECOMMENDATIONS = 20;

// Files: kebab-case
// recommendation-engine.service.ts
// product-catalog.component.tsx
```

## 🧪 Testing Requirements

### Coverage Requirements

- **Minimum 90%** code coverage
- **100% coverage** for recommendation engine logic
- **Integration tests** for all API endpoints
- **E2E tests** for critical user flows

### Test Structure

```typescript
// Unit tests
describe('RecommendationEngine', () => {
  describe('generateRecommendations', () => {
    it('should filter products by vehicle compatibility', () => {
      // Arrange
      const products = createTestProducts();
      const answers = { vehicleBrand: 'BMW', paintType: 'Metallic' };

      // Act
      const recommendations = engine.generateRecommendations(answers, products);

      // Assert
      expect(
        recommendations.every((r) =>
          r.product.suitableFor.vehicleBrands.includes('BMW')
        )
      ).toBe(true);
    });
  });
});
```

### Performance Testing

```typescript
// Performance requirements
describe('RecommendationEngine Performance', () => {
  it('should generate recommendations in <100ms', async () => {
    const startTime = performance.now();
    await engine.generateRecommendations(testAnswers, largeProductSet);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100);
  });
});
```

## 📝 Pull Request Process

### PR Checklist

- [ ] **Linear Issue** - Linked in PR description
- [ ] **Tests Added** - New functionality has tests
- [ ] **Tests Passing** - All tests pass locally
- [ ] **Coverage Maintained** - 90%+ coverage preserved
- [ ] **Performance Verified** - No regression in recommendation speed
- [ ] **Documentation Updated** - README/docs updated if needed
- [ ] **Type Safety** - No TypeScript errors
- [ ] **Linting Passed** - ESLint + Prettier applied

### PR Template

```markdown
## Linear Issue

Closes: CL-{issue-number}

## Changes

- Implemented rule-based product filtering for vehicle brands
- Added MongoDB indexes for improved query performance
- Created unit tests with 95% coverage

## Testing

- [ ] Unit tests added and passing
- [ ] Integration tests updated
- [ ] Performance benchmarks meet requirements (<100ms)

## Screenshots (if UI changes)

[Add screenshots for UI changes]

## Breaking Changes

None / [Describe breaking changes]
```

### Review Process

1. **Automated Checks** - CI/CD pipeline must pass
2. **Code Review** - At least 1 team member approval
3. **Performance Review** - Recommendation engine benchmarks
4. **Linear Update** - Issue status updated automatically

## ⚡ Performance Guidelines

### Recommendation Engine

```typescript
// ✅ Optimized database queries
const products = await ProductModel.find({
  'suitableFor.vehicleBrands': { $in: [vehicleBrand, 'ALL'] },
  'solves.problems': { $in: customerProblems },
}).lean(); // Use lean() for performance

// ✅ Efficient scoring algorithm
const calculateMatchScore = (
  product: Product,
  answers: CustomerAnswers
): number => {
  let score = 0;

  // Early returns for performance
  if (!matchesBasicCriteria(product, answers)) return 0;

  // Weighted scoring
  if (product.suitableFor.vehicleBrands.includes(answers.vehicleBrand))
    score += 40;
  if (product.solves.problems.includes(answers.primaryProblem)) score += 30;

  return score;
};
```

### Database Optimization

```javascript
// MongoDB indexes for recommendation queries
db.products.createIndex({
  'suitableFor.vehicleBrands': 1,
  'suitableFor.paintTypes': 1,
  inStock: 1,
});

db.products.createIndex({
  'solves.problems': 1,
  priceCategory: 1,
});
```

### Caching Strategy

```typescript
// Redis caching for frequently requested recommendations
const cacheKey = `recommendations:${hashAnswers(customerAnswers)}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const recommendations = await generateRecommendations(customerAnswers);
await redis.setex(cacheKey, 3600, JSON.stringify(recommendations)); // 1 hour TTL
```

## 🚫 What NOT to Contribute

### Forbidden Technologies

- **AI/ML Libraries** - TensorFlow, PyTorch, scikit-learn, etc.
- **Machine Learning** - Neural networks, training algorithms
- **Widget Systems** - Embeddable components for external sites
- **Generic Solutions** - Must be car care specific

### Code Patterns to Avoid

```typescript
// ❌ Don't use AI/ML for recommendations
import * as tf from '@tensorflow/tfjs';
const model = await tf.loadModel('recommendation-model');

// ❌ Don't create embeddable widgets
const AutoCareWidget = ({ embedId }: { embedId: string }) => {
  // This conflicts with our standalone app model
};

// ❌ Don't compromise on performance
const slowRecommendationEngine = async () => {
  // Avoid N+1 queries, unoptimized algorithms
  for (const product of products) {
    const score = await calculateScoreWithMultipleDBCalls(product);
  }
};
```

## 📚 Resources

### Documentation

- **API Docs**: `/docs/api.md`
- **Database Schema**: `/docs/database.md`
- **Deployment Guide**: `/docs/deployment.md`
- **Copilot Instructions**: `.copilot-instructions.md`

### Development Tools

- **VS Code Extensions**: Auto-installed from `.vscode/extensions.json`
- **Database Tools**: MongoDB Compass, pgAdmin
- **API Testing**: Thunder Client collections included
- **Performance Monitoring**: Built-in metrics dashboard

### Getting Help

- **Linear Comments** - Ask questions on specific issues
- **Team Discussions** - Use GitHub Discussions for broader topics
- **Code Reviews** - Learn from PR feedback and discussions

---

**Remember**: We're building a B2B SaaS platform with rule-based intelligence. Every contribution should align with this vision and our technical constraints. Quality over speed, transparency over complexity! 🚀
