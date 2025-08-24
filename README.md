# AutoCare Advisor - SaaS Development

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Linear](https://img.shields.io/badge/Linear-5E6AD2?logo=linear&logoColor=white)](https://linear.app/cleantastic)

**Intelligent Car Care Product Recommendation Platform**

AutoCare Advisor is a B2B SaaS platform that provides rule-based car care product recommendations without AI/ML. Built for car care product manufacturers and retailers to connect with customers through intelligent, transparent product matching.

## 🎯 Project Overview

- **Team**: CLEANtastic
- **Development Timeline**: 18 months (4 phases)
- **Linear Project**: [AutoCare Advisor - SaaS Development](https://linear.app/cleantastic)
- **Tech Stack**: Node.js, React, TypeScript, PostgreSQL, MongoDB, AWS

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Customer App   │    │  Partner Portal  │    │   Admin Panel   │
│  (React SPA)    │    │  (B2B Dashboard) │    │ (Management UI) │
└─────────┬───────┘    └────────┬─────────┘    └─────────┬───────┘
          │                     │                        │
          └─────────────────────┼────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │     API Gateway      │
                    │    (Node.js/Express) │
                    └───────────┬───────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼─────┐
        │ PostgreSQL   │ │  MongoDB    │ │   Redis   │
        │ (Users/Subs) │ │ (Products)  │ │ (Cache)   │
        └──────────────┘ └─────────────┘ └───────────┘
```

## 🚀 Features

### Core Functionality
- **Rule-Based Recommendations** - No AI/ML, transparent product matching
- **Vehicle-Specific Filtering** - Match products to car brand, paint type, age
- **Problem-Solution Mapping** - Target specific car care issues
- **Partner Dashboard** - B2B interface for product management
- **Revenue Optimization** - Multiple monetization streams

### Technical Highlights
- **TypeScript-First** development approach
- **Microservices Architecture** ready for scaling
- **Rule Engine** with weighted scoring system
- **Real-time Analytics** for partner insights
- **Mobile-Responsive** design across all platforms

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Frontend** | React + TypeScript | 18+ |
| **Backend** | Node.js + Express | 18+ |
| **Database** | PostgreSQL | 15+ |
| **Product Catalog** | MongoDB | 6+ |
| **Cache** | Redis | 7+ |
| **Infrastructure** | AWS (EKS, RDS, S3) | Latest |
| **Containerization** | Docker + Kubernetes | Latest |
| **Analytics** | ClickHouse | Latest |

## 📋 Prerequisites

- Node.js >= 18.0.0
- Docker & Docker Compose
- PostgreSQL 15+
- MongoDB 6+
- Redis 7+

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/COLORtastic/autocare-advisor.git
cd autocare-advisor
npm install
```

### 2. Environment Setup
```bash
# Copy environment templates
cp .env.example .env.local

# Start database services
docker-compose up -d postgres mongodb redis
```

### 3. Development Servers
```bash
# Start all development servers (uses VS Code tasks)
npm run dev:all

# Or individually:
npm run dev:backend    # Port 3000
npm run dev:frontend   # Port 3001  
npm run dev:admin      # Port 3002
```

### 4. Database Setup
```bash
# Initialize databases
npm run db:migrate
npm run db:seed

# Generate test data
npm run db:generate-test-data
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage reports
npm run test:coverage

# Integration tests only
npm run test:integration
```

## 🗄️ Database Schema

### MongoDB Product Schema (Core Recommendation Engine)
```javascript
{
  _id: ObjectId,
  name: "Chemical Guys Black Light Shampoo",
  brand: "Chemical Guys",
  category: "Autoshampoo",
  price: 24.99,
  
  // MATCHING CRITERIA
  suitableFor: {
    vehicleTypes: ["PKW", "SUV", "Limousine"],
    vehicleBrands: ["BMW", "Mercedes", "ALL"],
    paintTypes: ["Metallic", "Uni", "Perleffekt"],
    paintColors: ["Schwarz", "Dunkelblau", "ALL"],
    vehicleAge: { min: 0, max: 20 }
  },
  
  // PROBLEM SOLVING
  solves: {
    problems: ["Wasserflecken", "Kalkflecken", "Lackpflege"],
    applications: ["Handwäsche", "2-Eimer-Methode"],
    careAreas: ["Außenlack", "Plastikteile"]
  },
  
  // USAGE CONTEXT
  usage: {
    experienceLevel: ["Anfänger", "Fortgeschritten"],
    frequency: ["Wöchentlich", "Monatlich"],
    timeRequired: 15,
    seasonality: ["ALL"]
  }
}
```

## 🤖 Recommendation Engine

The core of AutoCare Advisor is a **rule-based recommendation system** that matches customers with products based on structured criteria:

### Scoring Algorithm
```javascript
// Weighted scoring factors (total 100 points)
- Exact vehicle match: 40 points
- Solves primary problem: 30 points  
- Price category match: 15 points
- Experience level match: 10 points
- Product rating ≥4.0: 5 points
```

### Matching Rules
- **Hard Filters**: Product MUST meet basic criteria
- **Soft Scoring**: Additional points for better matches
- **Exclusion Criteria**: Incompatible products are filtered out

## 📊 Development Phases

| Phase | Duration | Focus | Key Deliverables |
|-------|----------|-------|------------------|
| **Phase 1** | 3 months | MVP Foundation | Backend, Database, Basic UI |
| **Phase 2** | 5 months | Core Features | Recommendation Engine, Payments |
| **Phase 3** | 6 months | Scale & Optimize | Performance, Mobile, Analytics |
| **Phase 4** | 4 months | Launch & Growth | Production, Marketing, Expansion |

## 📈 Business Model

### Revenue Streams
1. **Subscription Fees** - Monthly partner subscriptions (€99-€999)
2. **Commission** - % of sales through recommendations (2-5%)
3. **Pay-per-Click** - Partner pays for product clicks
4. **Premium Listings** - Enhanced product placement

### Target Metrics
- **Partner Onboarding**: 10+ partners in Year 1
- **Conversion Rate**: >15% click-through to partner shops
- **Revenue Target**: €50k MRR after 18 months
- **User Satisfaction**: >85% recommendation relevance

## 🔧 Development Setup

### VS Code Configuration
This project includes comprehensive VS Code settings:
- Pre-configured debugging for Frontend + Backend
- Automated task runners for development servers
- Terminal templates for different services
- Extension recommendations for the full stack

### Git Workflow
```bash
# Feature branches
git checkout -b feature/CL-{issue-number}-{description}

# Commit format (integrated with Linear)
git commit -m "feat(CL-123): implement recommendation engine"

# Pull request template includes Linear issue reference
```

## 📚 Documentation

- **[Copilot Instructions](.copilot-instructions.md)** - AI assistant guidelines
- **[API Documentation](docs/api.md)** - REST API endpoints
- **[Database Schema](docs/database.md)** - Complete data model
- **[Deployment Guide](docs/deployment.md)** - AWS setup instructions
- **[Contributing Guide](CONTRIBUTING.md)** - Development guidelines

## 🤝 Contributing

1. **Check Linear Issues** - Pick up tasks from [AutoCare Advisor Project](https://linear.app/cleantastic)
2. **Follow TypeScript Standards** - Strict typing required
3. **Write Tests** - Minimum 90% coverage
4. **Rule-Based Only** - No AI/ML libraries allowed
5. **Performance First** - <100ms recommendation response time

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

### Team CLEANtastic
- **Project Management**: [Linear Workspace](https://linear.app/cleantastic)
- **Development Questions**: Create an issue in this repository
- **Business Inquiries**: Contact via Linear project

### Development Resources
- **VS Code Setup**: Use provided `.vscode/` configuration
- **Database Tools**: MongoDB Compass, pgAdmin recommended
- **API Testing**: Use Thunder Client or Postman collections

---

**Built with ❤️ by Team CLEANtastic** | **Powered by Rule-Based Intelligence**
