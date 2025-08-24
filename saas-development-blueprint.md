# AutoCare Advisor - SaaS Full-Stack Development Blueprint

## Detaillierte Phasenplanung für 7-köpfiges Entwicklungsteam

---

# PROJECT OVERVIEW

**Projekt**: AutoCare Advisor - B2B SaaS Autopflege-Beratungsplatform
**Team**: 7 Entwickler (1 CTO, 2 Backend, 2 Frontend, 1 DevOps, 1 Data Scientist)
**Timeline**: 16 Wochen MVP + 32 Wochen Skalierung
**Tech Stack**: Node.js, React, PostgreSQL, MongoDB, AWS, Docker

---

# TECHNICAL ARCHITECTURE

## **System Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Customer      │    │   Partner        │    │   Admin         │
│   Widget        │    │   Dashboard      │    │   Panel         │
│   (React)       │    │   (React)        │    │   (React)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────────┐
                    │    API Gateway          │
                    │    (Express.js)         │
                    └─────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Recommendation  │    │ User Management  │    │ Analytics       │
│ Service         │    │ Service          │    │ Service         │
│ (Node.js)       │    │ (Node.js)        │    │ (Python)        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ MongoDB         │    │ PostgreSQL       │    │ ClickHouse      │
│ (Products)      │    │ (Users/Orders)   │    │ (Analytics)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## **Database Schema Design**

### **PostgreSQL (Transactional Data)**

```sql
-- Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    tier_level VARCHAR(20) NOT NULL DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions & Billing
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    tier_level VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    stripe_subscription_id VARCHAR(255),
    current_period_start DATE,
    current_period_end DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Widget Configurations
CREATE TABLE widget_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    domain VARCHAR(255) NOT NULL,
    widget_style JSON,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Click Tracking & Billing
CREATE TABLE click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    widget_id UUID REFERENCES widget_configs(id),
    product_id VARCHAR(255),
    clicked_at TIMESTAMP DEFAULT NOW(),
    cost_per_click DECIMAL(5,2),
    billed BOOLEAN DEFAULT false
);
```

### **MongoDB (Product Catalog)**

```javascript
// Products Collection
{
  _id: ObjectId,
  partnerId: String,
  name: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  tags: [String],
  compatibility: {
    vehicleTypes: [String],
    paintTypes: [String],
    materials: [String]
  },
  specifications: {
    volume: String,
    application: String,
    season: String,
    environmentFriendly: Boolean
  },
  analytics: {
    views: Number,
    clicks: Number,
    conversions: Number,
    rating: Number
  },
  createdAt: Date,
  updatedAt: Date
}

// Questionnaire Templates
{
  _id: ObjectId,
  version: String,
  questions: [{
    id: String,
    type: String, // radio, checkbox, select
    text: String,
    options: [String],
    scoring: Object,
    conditions: Object // for conditional questions
  }],
  scoringRules: Object,
  active: Boolean,
  createdAt: Date
}
```

---

# PHASE 1: FOUNDATION & CORE (Wochen 1-4)

## **Team Allocation**

- **CTO**: Architecture, Code Reviews, Technical Leadership
- **Backend Dev 1**: User Management & Authentication
- **Backend Dev 2**: Product Management & API Foundation
- **Frontend Dev 1**: Partner Dashboard Foundation
- **Frontend Dev 2**: Customer Widget Foundation
- **DevOps**: Infrastructure Setup & CI/CD
- **Data Scientist**: Recommendation Algorithm Foundation

---

## **WOCHE 1: PROJECT SETUP & INFRASTRUCTURE**

### **DevOps Engineer Tasks**

```bash
# Infrastructure as Code Setup
├── terraform/
│   ├── vpc.tf              # VPC with public/private subnets
│   ├── rds.tf              # PostgreSQL RDS instance
│   ├── documentdb.tf       # MongoDB-compatible DocumentDB
│   ├── elasticache.tf      # Redis for caching
│   ├── ecs.tf              # ECS cluster for containers
│   ├── alb.tf              # Application Load Balancer
│   └── cloudfront.tf       # CDN for widget delivery
```

**Daily Tasks:**

- **Tag 1**: AWS Account Setup + Terraform Infrastructure
- **Tag 2**: CI/CD Pipeline (GitHub Actions)
- **Tag 3**: Development Environment Setup
- **Tag 4**: Staging Environment Setup
- **Tag 5**: Monitoring Setup (CloudWatch + DataDog)

**Deliverables:**

- ✅ Dev/Staging/Prod Environments laufen
- ✅ CI/CD Pipeline funktioniert
- ✅ Monitoring & Alerting aktiv
- ✅ SSL Certificates & Domains konfiguriert

### **Backend Dev 1 Tasks - User Management**

```javascript
// Project Structure Setup
src/
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── subscription.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   └── rateLimit.middleware.js
├── models/
│   ├── User.js
│   ├── Subscription.js
│   └── WidgetConfig.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── subscription.routes.js
├── services/
│   ├── auth.service.js
│   ├── email.service.js
│   └── stripe.service.js
└── utils/
    ├── database.js
    ├── logger.js
    └── validators.js
```

**Daily Tasks:**

- **Tag 1**: Express.js Setup + Database Connection
- **Tag 2**: User Registration/Login API
- **Tag 3**: JWT Authentication Middleware
- **Tag 4**: Password Reset Functionality
- **Tag 5**: Email Service Integration (SendGrid)

**Deliverables:**

- ✅ RESTful User API (CRUD operations)
- ✅ JWT-basierte Authentication
- ✅ Password Reset via Email
- ✅ Input Validation & Sanitization

### **Backend Dev 2 Tasks - Product Management**

```javascript
// MongoDB Connection & Models
├── models/
│   ├── Product.js
│   ├── Category.js
│   ├── Questionnaire.js
│   └── Analytics.js
├── controllers/
│   ├── product.controller.js
│   ├── category.controller.js
│   └── analytics.controller.js
├── services/
│   ├── product.service.js
│   ├── search.service.js
│   └── imageUpload.service.js
```

**Daily Tasks:**

- **Tag 1**: MongoDB Connection + Product Schema
- **Tag 2**: Product CRUD API Implementation
- **Tag 3**: Category Management System
- **Tag 4**: Image Upload Service (AWS S3)
- **Tag 5**: Search & Filtering API

**Deliverables:**

- ✅ Product Management API
- ✅ Category System
- ✅ Image Upload Pipeline
- ✅ Basic Search Functionality

### **Frontend Dev 1 Tasks - Dashboard Foundation**

```javascript
// React Dashboard Structure
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Input.jsx
│       └── Modal.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Analytics.jsx
│   └── Settings.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   └── useLocalStorage.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── storage.js
└── utils/
    ├── constants.js
    ├── helpers.js
    └── validators.js
```

**Daily Tasks:**

- **Tag 1**: React App Setup + Routing (React Router)
- **Tag 2**: Authentication Pages (Login/Register)
- **Tag 3**: Dashboard Layout & Navigation
- **Tag 4**: Basic Product Management Interface
- **Tag 5**: State Management Setup (Redux Toolkit)

**Deliverables:**

- ✅ Authentication Flow komplett
- ✅ Dashboard Layout responsive
- ✅ Basic Product Management UI
- ✅ State Management konfiguriert

### **Frontend Dev 2 Tasks - Widget Foundation**

```javascript
// Widget Structure (Embeddable)
widget/
├── src/
│   ├── components/
│   │   ├── Questionnaire.jsx
│   │   ├── QuestionStep.jsx
│   │   ├── ProductCard.jsx
│   │   └── ResultsDisplay.jsx
│   ├── hooks/
│   │   ├── useQuestionnaire.js
│   │   ├── useRecommendations.js
│   │   └── useAnalytics.js
│   ├── services/
│   │   ├── widgetApi.js
│   │   └── analytics.js
│   └── styles/
│       ├── widget.css
│       └── themes.css
├── public/
│   └── embed.js              # Widget Embed Script
└── build/
    └── widget.min.js         # Production Build
```

**Daily Tasks:**

- **Tag 1**: Widget React App Setup (separates Build)
- **Tag 2**: Questionnaire Component Structure
- **Tag 3**: Embed Script Development
- **Tag 4**: PostMessage Communication Setup
- **Tag 5**: Widget Styling System

**Deliverables:**

- ✅ Embeddable Widget Framework
- ✅ Basic Questionnaire Flow
- ✅ Parent-Widget Communication
- ✅ Responsive Widget Design

### **Data Scientist Tasks - Algorithm Foundation**

```python
# Recommendation Engine Setup
recommendation_engine/
├── src/
│   ├── models/
│   │   ├── scoring.py
│   │   ├── compatibility.py
│   │   └── ranking.py
│   ├── services/
│   │   ├── recommendation.py
│   │   ├── analytics.py
│   │   └── learning.py
│   ├── utils/
│   │   ├── data_processing.py
│   │   ├── feature_engineering.py
│   │   └── evaluation.py
│   └── api/
│       ├── recommendation_api.py
│       └── analytics_api.py
```

**Daily Tasks:**

- **Tag 1**: Python Environment + Dependencies Setup
- **Tag 2**: Scoring Algorithm Development
- **Tag 3**: Product Compatibility Matrix
- **Tag 4**: Basic Recommendation API
- **Tag 5**: Testing & Validation Framework

**Deliverables:**

- ✅ Scoring Algorithm (v1)
- ✅ Product Compatibility Engine
- ✅ Recommendation API Endpoint
- ✅ Algorithm Testing Suite

### **CTO Tasks - Architecture & Coordination**

**Daily Tasks:**

- **Tag 1**: Final Architecture Review & Team Alignment
- **Tag 2**: Code Review Standards & Guidelines
- **Tag 3**: API Design Standards & Documentation
- **Tag 4**: Security Best Practices Implementation
- **Tag 5**: Weekly Sprint Planning & Retrospective

**Deliverables:**

- ✅ Technical Documentation Complete
- ✅ Development Standards Defined
- ✅ Security Guidelines Implemented
- ✅ Team Coordination Processes

---

## **WOCHE 2: CORE FUNCTIONALITY DEVELOPMENT**

### **Backend Dev 1 - Subscription & Billing**

```javascript
// Stripe Integration
├── controllers/
│   ├── billing.controller.js
│   ├── subscription.controller.js
│   └── webhook.controller.js
├── services/
│   ├── stripe.service.js
│   ├── billing.service.js
│   └── usage.service.js
├── models/
│   ├── BillingEvent.js
│   ├── UsageRecord.js
│   └── Invoice.js
```

**Daily Tasks:**

- **Tag 1**: Stripe Integration Setup
- **Tag 2**: Subscription Management API
- **Tag 3**: Usage-based Billing System
- **Tag 4**: Webhook Handler für Stripe Events
- **Tag 5**: Billing Dashboard API

**Code Example - Subscription Service:**

```javascript
class SubscriptionService {
  async createSubscription(userId, tierId, paymentMethodId) {
    try {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        payment_method: paymentMethodId,
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: this.getTierPriceId(tierId) }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      // Save to database
      await Subscription.create({
        userId,
        stripeSubscriptionId: subscription.id,
        tierLevel: tierId,
        status: subscription.status,
      });

      return subscription;
    } catch (error) {
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }

  async recordUsage(userId, clicks) {
    const subscription = await this.getUserSubscription(userId);
    const costPerClick = this.getTierCostPerClick(subscription.tierLevel);

    await UsageRecord.create({
      userId,
      subscriptionId: subscription.id,
      clicks,
      cost: clicks * costPerClick,
      recordedAt: new Date(),
    });
  }
}
```

### **Backend Dev 2 - Recommendation Engine Integration**

```javascript
// Recommendation System
├── controllers/
│   ├── recommendation.controller.js
│   ├── questionnaire.controller.js
│   └── analytics.controller.js
├── services/
│   ├── recommendation.service.js
│   ├── scoring.service.js
│   └── personalization.service.js
```

**Daily Tasks:**

- **Tag 1**: Questionnaire Management API
- **Tag 2**: Recommendation Engine Integration
- **Tag 3**: Scoring Algorithm Implementation
- **Tag 4**: Real-time Analytics Collection
- **Tag 5**: Performance Optimization

**Code Example - Recommendation Controller:**

```javascript
class RecommendationController {
  async getRecommendations(req, res) {
    try {
      const { answers, partnerId, limit = 6 } = req.body;

      // Validate questionnaire answers
      const validation = await QuestionnaireService.validateAnswers(answers);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.errors });
      }

      // Get partner's products
      const partnerProducts = await ProductService.getPartnerProducts(
        partnerId
      );

      // Calculate scores for each product
      const scoredProducts = await ScoringService.scoreProducts(
        partnerProducts,
        answers,
        partnerId
      );

      // Apply tier-based ranking boost
      const rankedProducts = await RankingService.applyTierBoost(
        scoredProducts,
        partnerId
      );

      // Return top recommendations
      const recommendations = rankedProducts.slice(0, limit);

      // Record analytics
      await AnalyticsService.recordRecommendation({
        partnerId,
        answers,
        recommendations: recommendations.map((p) => p.id),
      });

      res.json({
        success: true,
        recommendations,
        metadata: {
          totalScored: scoredProducts.length,
          averageScore: this.calculateAverageScore(scoredProducts),
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

### **Frontend Dev 1 - Product Management Interface**

```jsx
// Product Management Components
├── components/
│   ├── products/
│   │   ├── ProductList.jsx
│   │   ├── ProductForm.jsx
│   │   ├── ProductCard.jsx
│   │   └── BulkActions.jsx
│   ├── categories/
│   │   ├── CategoryManager.jsx
│   │   └── CategoryForm.jsx
│   └── upload/
│       ├── ImageUpload.jsx
│       ├── CSVUpload.jsx
│       └── BulkImport.jsx
```

**Daily Tasks:**

- **Tag 1**: Product List Interface mit Pagination
- **Tag 2**: Product Add/Edit Forms
- **Tag 3**: Image Upload Component
- **Tag 4**: Category Management Interface
- **Tag 5**: Bulk Import/Export Functionality

**Code Example - Product Form:**

```jsx
const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    compatibility: product?.compatibility || {
      vehicleTypes: [],
      paintTypes: [],
      materials: [],
    },
    images: product?.images || [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validation = validateProduct(formData);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      await productApi.saveProduct(formData);
      toast.success("Product saved successfully");
      onSave();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-section">
        <h3>Basic Information</h3>
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, name: value }))
          }
          required
        />

        <TextArea
          label="Description"
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
          rows={4}
        />

        <Select
          label="Category"
          value={formData.category}
          options={categories}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
          required
        />
      </div>

      <div className="form-section">
        <h3>Compatibility</h3>
        <MultiSelect
          label="Vehicle Types"
          value={formData.compatibility.vehicleTypes}
          options={vehicleTypeOptions}
          onChange={(values) =>
            setFormData((prev) => ({
              ...prev,
              compatibility: { ...prev.compatibility, vehicleTypes: values },
            }))
          }
        />
      </div>

      <div className="form-section">
        <h3>Images</h3>
        <ImageUpload
          images={formData.images}
          onImagesChange={(images) =>
            setFormData((prev) => ({ ...prev, images }))
          }
          maxImages={5}
        />
      </div>

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Product
        </Button>
      </div>
    </form>
  );
};
```

### **Frontend Dev 2 - Interactive Questionnaire**

```jsx
// Questionnaire Components
├── components/
│   ├── questionnaire/
│   │   ├── QuestionnaireFlow.jsx
│   │   ├── QuestionStep.jsx
│   │   ├── ProgressBar.jsx
│   │   └── NavigationButtons.jsx
│   ├── questions/
│   │   ├── RadioQuestion.jsx
│   │   ├── CheckboxQuestion.jsx
│   │   └── SelectQuestion.jsx
│   └── results/
│       ├── ResultsDisplay.jsx
│       ├── ProductCard.jsx
│       └── ComparisonTable.jsx
```

**Daily Tasks:**

- **Tag 1**: Question Components (Radio, Checkbox, Select)
- **Tag 2**: Questionnaire Flow Logic
- **Tag 3**: Progress Indicator & Navigation
- **Tag 4**: Results Display Interface
- **Tag 5**: Mobile Responsiveness

**Code Example - Questionnaire Flow:**

```jsx
const QuestionnaireFlow = ({ partnerId, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadQuestionnaire = async () => {
      try {
        const questionnaireData = await questionnaireApi.getActive();
        setQuestions(questionnaireData.questions);
      } catch (error) {
        console.error("Failed to load questionnaire:", error);
      }
    };

    loadQuestionnaire();
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const recommendations = await recommendationApi.getRecommendations({
        answers,
        partnerId,
        limit: 6,
      });

      onComplete(recommendations);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (questions.length === 0) {
    return <div className="loading">Loading questionnaire...</div>;
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="questionnaire-flow">
      <ProgressBar progress={progress} />

      <div className="question-container">
        <QuestionStep
          question={currentQuestion}
          answer={answers[currentQuestion.id]}
          onAnswerChange={(answer) =>
            handleAnswerChange(currentQuestion.id, answer)
          }
        />
      </div>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={questions.length}
        canProceed={!!answers[currentQuestion.id]}
        onPrevious={() => setCurrentStep((prev) => prev - 1)}
        onNext={handleNext}
        loading={loading}
      />
    </div>
  );
};
```

### **Data Scientist - Advanced Scoring Algorithm**

```python
# Advanced Recommendation Engine
class RecommendationEngine:
    def __init__(self):
        self.compatibility_weights = {
            'vehicleType': 0.25,
            'paintType': 0.20,
            'experienceLevel': 0.15,
            'budget': 0.15,
            'application': 0.10,
            'season': 0.10,
            'environmental': 0.05
        }

    def score_product(self, product, answers, partner_tier):
        """
        Calculate comprehensive product score based on user answers
        """
        compatibility_score = self._calculate_compatibility(product, answers)
        quality_score = self._calculate_quality_score(product)
        tier_boost = self._get_tier_boost(partner_tier)
        price_score = self._calculate_price_score(product, answers.get('budget'))

        # Weighted final score
        final_score = (
            compatibility_score * 0.40 +
            quality_score * 0.20 +
            price_score * 0.10 +
            tier_boost * 0.25 +
            self._calculate_availability_score(product) * 0.05
        )

        return min(100, max(0, final_score))

    def _calculate_compatibility(self, product, answers):
        """Calculate how well product matches user needs"""
        score = 0
        total_weight = 0

        for criteria, weight in self.compatibility_weights.items():
            if criteria in answers:
                match_score = self._get_criteria_match(
                    product, criteria, answers[criteria]
                )
                score += match_score * weight
                total_weight += weight

        return (score / total_weight) * 100 if total_weight > 0 else 0

    def _get_tier_boost(self, partner_tier):
        """Apply tier-based ranking boost"""
        tier_multipliers = {
            'basic': 1.0,
            'professional': 1.5,
            'enterprise': 2.0
        }
        return tier_multipliers.get(partner_tier, 1.0) * 25

    def get_recommendations(self, products, answers, partner_id, limit=6):
        """Get top product recommendations"""
        partner = self.get_partner_info(partner_id)

        scored_products = []
        for product in products:
            if product['partnerId'] == partner_id:
                score = self.score_product(product, answers, partner['tier'])
                scored_products.append({
                    **product,
                    'score': score,
                    'reasons': self._get_recommendation_reasons(product, answers)
                })

        # Sort by score and apply tier-based distribution
        scored_products.sort(key=lambda x: x['score'], reverse=True)

        return self._apply_tier_distribution(scored_products, limit)
```

---

## **WOCHE 3: INTEGRATION & TESTING**

### **Backend Dev 1 - API Integration & Security**

**Daily Tasks:**

- **Tag 1**: API Gateway Setup mit Rate Limiting
- **Tag 2**: CORS & Security Headers Implementation
- **Tag 3**: API Documentation (Swagger/OpenAPI)
- **Tag 4**: Authentication Middleware Testing
- **Tag 5**: Security Audit & Penetration Testing

**Code Example - API Security Middleware:**

```javascript
// Security Middleware Stack
const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),

  cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),

  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
      // Different limits based on tier
      const userTier = req.user?.tierLevel || "basic";
      const limits = {
        basic: 100,
        professional: 500,
        enterprise: 2000,
      };
      return limits[userTier];
    },
    message: "Too many requests from this IP",
    standardHeaders: true,
    legacyHeaders: false,
  }),
];
```

### **Backend Dev 2 - Analytics & Monitoring**

**Daily Tasks:**

- **Tag 1**: ClickHouse Analytics Database Setup
- **Tag 2**: Real-time Event Tracking Implementation
- **Tag 3**: Dashboard Analytics API
- **Tag 4**: Performance Monitoring Integration
- **Tag 5**: Data Export & Reporting Features

**Code Example - Analytics Service:**

```javascript
class AnalyticsService {
  constructor() {
    this.clickhouse = new ClickHouse({
      url: process.env.CLICKHOUSE_URL,
      database: 'autocare_analytics'
    });
  }

  async trackWidgetImpression(data) {
    const event = {
      event_type: 'widget_impression',
      timestamp: new Date(),
      partner_id: data.partnerId,
      widget_id: data.widgetId,
      user_agent: data.userAgent,
      ip_address: this.hashIP(data.ipAddress),
      referrer: data.referrer,
      page_url: data.pageUrl
    };

    await this.insertEvent(event);
  }

  async trackQuestionnaireStart(data) {
    const event = {
      event_type: 'questionnaire_start',
      timestamp: new Date(),
      partner_id: data.partnerId,
      session_id: data.sessionId,
      questions_version: data.questionnaireVersion
    const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AutoCare-Signature': signature,
          'X-AutoCare-Event': event,
          'User-Agent': 'AutoCare-Webhook/1.0'
        },
        body: JSON.stringify(payload),
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      await WebhookLog.create({
        webhookId: webhook.id,
        event,
        status: 'success',
        responseStatus: response.status
      });

    } catch (error) {
      await WebhookLog.create({
        webhookId: webhook.id,
        event,
        status: 'failed',
        error: error.message
      });

      // Implement retry logic for failed webhooks
      await this.scheduleRetry(webhook, event, data);
    }
  }
}
```

### **Backend Dev 2 - ML Integration & Advanced Analytics**

**Daily Tasks:**

- **Tag 1**: Real-time ML Model Integration
- **Tag 2**: Advanced Analytics Pipeline
- **Tag 3**: Personalization Engine
- **Tag 4**: Predictive Analytics Features
- **Tag 5**: A/B Testing Backend Infrastructure

**Code Example - Real-time ML Integration:**

```javascript
// ML Service Integration
class MLRecommendationService {
  constructor() {
    this.pythonAPI = new PythonMLAPI();
    this.fallbackAlgorithm = new RuleBasedAlgorithm();
    this.cache = new Redis();
  }

  async getRecommendations(answers, products, partnerId, options = {}) {
    const cacheKey = this.generateCacheKey(answers, partnerId);

    try {
      // Check cache first
      const cached = await this.cache.get(cacheKey);
      if (cached && !options.bypassCache) {
        return JSON.parse(cached);
      }

      // Try ML model first
      const mlRecommendations = await this.pythonAPI.predict({
        answers,
        products,
        partnerId,
        context: options.context,
      });

      if (mlRecommendations.success) {
        const enriched = await this.enrichRecommendations(
          mlRecommendations.data,
          answers,
          partnerId
        );

        // Cache results for 1 hour
        await this.cache.setex(cacheKey, 3600, JSON.stringify(enriched));

        return enriched;
      }

      throw new Error("ML model unavailable");
    } catch (error) {
      console.warn(
        "ML model failed, falling back to rule-based:",
        error.message
      );

      // Fallback to rule-based algorithm
      const fallbackRecommendations = await this.fallbackAlgorithm.recommend(
        answers,
        products,
        partnerId
      );

      return this.enrichRecommendations(
        fallbackRecommendations,
        answers,
        partnerId
      );
    }
  }

  async enrichRecommendations(recommendations, answers, partnerId) {
    // Add explanation for each recommendation
    const enriched = await Promise.all(
      recommendations.map(async (rec) => {
        const explanation = await this.generateExplanation(rec, answers);
        const confidence = await this.calculateConfidence(rec, answers);

        return {
          ...rec,
          explanation,
          confidence,
          reasoning: this.generateReasoning(rec, answers),
        };
      })
    );

    // Apply tier-based boosting
    return this.applyTierBoosting(enriched, partnerId);
  }

  async generateExplanation(recommendation, answers) {
    const reasons = [];

    if (this.isVehicleMatch(recommendation, answers)) {
      reasons.push(`Perfekt für ${answers.vehicleType}`);
    }

    if (this.isPaintTypeMatch(recommendation, answers)) {
      reasons.push(`Speziell für ${answers.paintType} Lack`);
    }

    if (this.isExperienceMatch(recommendation, answers)) {
      reasons.push(`Ideal für ${answers.experience} Anwender`);
    }

    if (this.isBudgetMatch(recommendation, answers)) {
      reasons.push("Passt zu Ihrem Budget");
    }

    return reasons.join(" • ");
  }
}

// Python ML API Client
class PythonMLAPI {
  constructor() {
    this.baseURL = process.env.ML_API_URL || "http://ml-service:8000";
    this.timeout = 5000;
  }

  async predict(data) {
    try {
      const response = await fetch(`${this.baseURL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ML_API_TOKEN}`,
        },
        body: JSON.stringify(data),
        timeout: this.timeout,
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`ML API request failed: ${error.message}`);
    }
  }

  async trainModel(trainingData) {
    const response = await fetch(`${this.baseURL}/train`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ML_API_TOKEN}`,
      },
      body: JSON.stringify(trainingData),
    });

    return await response.json();
  }

  async getModelMetrics() {
    const response = await fetch(`${this.baseURL}/metrics`, {
      headers: {
        Authorization: `Bearer ${process.env.ML_API_TOKEN}`,
      },
    });

    return await response.json();
  }
}
```

### **Frontend Dev 1 - Advanced Dashboard Features**

**Daily Tasks:**

- **Tag 1**: Real-time Analytics Dashboard
- **Tag 2**: Custom Report Builder
- **Tag 3**: Advanced Filtering & Search
- **Tag 4**: Data Export Features
- **Tag 5**: Mobile Dashboard Optimization

**Code Example - Real-time Analytics Dashboard:**

```jsx
// Real-time Analytics Dashboard
const RealTimeAnalytics = () => {
  const [realTimeData, setRealTimeData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const token = localStorage.getItem("authToken");
      wsRef.current = new WebSocket(
        `ws://localhost:8080/analytics?token=${token}`
      );

      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setRealTimeData((prev) => ({
          ...prev,
          [data.metric]: data.value,
          lastUpdate: new Date(),
        }));
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        // Reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="real-time-analytics">
      <div className="connection-status">
        <div
          className={`status-indicator ${
            isConnected ? "connected" : "disconnected"
          }`}
        >
          {isConnected ? "🟢 Live" : "🔴 Disconnected"}
        </div>
        {realTimeData.lastUpdate && (
          <span className="last-update">
            Last update: {format(realTimeData.lastUpdate, "HH:mm:ss")}
          </span>
        )}
      </div>

      <div className="real-time-metrics">
        <MetricCard
          title="Active Sessions"
          value={realTimeData.activeSessions || 0}
          trend={realTimeData.sessionsTrend}
          icon="👥"
        />

        <MetricCard
          title="Recommendations/Min"
          value={realTimeData.recommendationsPerMinute || 0}
          trend={realTimeData.recommendationsTrend}
          icon="🎯"
        />

        <MetricCard
          title="Clicks/Min"
          value={realTimeData.clicksPerMinute || 0}
          trend={realTimeData.clicksTrend}
          icon="👆"
        />

        <MetricCard
          title="Revenue Today"
          value={`€${realTimeData.revenueToday || 0}`}
          trend={realTimeData.revenueTrend}
          icon="💰"
        />
      </div>

      <div className="real-time-charts">
        <div className="chart-container">
          <h3>Live Activity</h3>
          <LiveActivityChart data={realTimeData.activityData} />
        </div>

        <div className="chart-container">
          <h3>Conversion Funnel</h3>
          <LiveFunnelChart data={realTimeData.funnelData} />
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ActivityFeed data={realTimeData.recentActivity} />
      </div>
    </div>
  );
};

// Custom Report Builder
const ReportBuilder = () => {
  const [reportConfig, setReportConfig] = useState({
    metrics: [],
    dimensions: [],
    filters: [],
    dateRange: { start: subDays(new Date(), 30), end: new Date() },
    visualization: "table",
  });

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableMetrics = [
    { id: "impressions", name: "Impressions", type: "number" },
    { id: "completions", name: "Completions", type: "number" },
    { id: "clicks", name: "Clicks", type: "number" },
    { id: "conversion_rate", name: "Conversion Rate", type: "percentage" },
    { id: "revenue", name: "Revenue", type: "currency" },
  ];

  const availableDimensions = [
    { id: "date", name: "Date" },
    { id: "product_category", name: "Product Category" },
    { id: "user_segment", name: "User Segment" },
    { id: "device_type", name: "Device Type" },
  ];

  const generateReport = async () => {
    setLoading(true);

    try {
      const response = await analyticsApi.generateCustomReport(reportConfig);
      setReportData(response.data);
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      const blob = await analyticsApi.exportReport(reportConfig, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${format}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    }
  };

  return (
    <div className="report-builder">
      <div className="builder-sidebar">
        <div className="section">
          <h4>Metrics</h4>
          <MetricSelector
            metrics={availableMetrics}
            selected={reportConfig.metrics}
            onChange={(metrics) =>
              setReportConfig((prev) => ({ ...prev, metrics }))
            }
          />
        </div>

        <div className="section">
          <h4>Dimensions</h4>
          <DimensionSelector
            dimensions={availableDimensions}
            selected={reportConfig.dimensions}
            onChange={(dimensions) =>
              setReportConfig((prev) => ({ ...prev, dimensions }))
            }
          />
        </div>

        <div className="section">
          <h4>Filters</h4>
          <FilterBuilder
            filters={reportConfig.filters}
            onChange={(filters) =>
              setReportConfig((prev) => ({ ...prev, filters }))
            }
          />
        </div>

        <div className="section">
          <h4>Date Range</h4>
          <DateRangePicker
            value={reportConfig.dateRange}
            onChange={(dateRange) =>
              setReportConfig((prev) => ({ ...prev, dateRange }))
            }
          />
        </div>

        <div className="section">
          <h4>Visualization</h4>
          <VisualizationSelector
            value={reportConfig.visualization}
            onChange={(visualization) =>
              setReportConfig((prev) => ({ ...prev, visualization }))
            }
          />
        </div>

        <div className="actions">
          <Button
            onClick={generateReport}
            loading={loading}
            disabled={reportConfig.metrics.length === 0}
          >
            Generate Report
          </Button>
        </div>
      </div>

      <div className="report-content">
        {reportData && (
          <>
            <div className="report-header">
              <h2>Custom Report</h2>
              <div className="export-options">
                <Button variant="outline" onClick={() => exportReport("csv")}>
                  Export CSV
                </Button>
                <Button variant="outline" onClick={() => exportReport("xlsx")}>
                  Export Excel
                </Button>
                <Button variant="outline" onClick={() => exportReport("pdf")}>
                  Export PDF
                </Button>
              </div>
            </div>

            <div className="report-visualization">
              <ReportVisualization data={reportData} config={reportConfig} />
            </div>
          </>
        )}

        {!reportData && (
          <div className="empty-state">
            <h3>Build Your Custom Report</h3>
            <p>
              Select metrics and dimensions from the sidebar to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
```

### **Frontend Dev 2 - Widget Advanced Features**

**Daily Tasks:**

- **Tag 1**: Widget Customization Interface
- **Tag 2**: Advanced A/B Testing Framework
- **Tag 3**: Widget Performance Optimization
- **Tag 4**: Multi-language Support
- **Tag 5**: Widget Analytics Enhancement

**Code Example - Widget Customization Interface:**

```jsx
// Widget Customization Interface
const WidgetCustomizer = () => {
  const [config, setConfig] = useState({
    theme: "default",
    colors: {
      primary: "#007bff",
      secondary: "#6c757d",
      success: "#28a745",
      background: "#ffffff",
      text: "#333333",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      fontWeight: "400",
    },
    layout: {
      style: "card",
      width: "100%",
      maxWidth: "600px",
      padding: "20px",
      borderRadius: "8px",
    },
    content: {
      title: "Finden Sie das perfekte Pflegeprodukt",
      subtitle: "Beantworten Sie 6 kurze Fragen",
      buttonText: "Beratung starten",
      thankYouMessage: "Vielen Dank! Hier sind Ihre Empfehlungen:",
    },
    features: {
      progressBar: true,
      questionNumbers: true,
      backButton: true,
      skipOption: false,
      socialShare: false,
    },
  });

  const [previewMode, setPreviewMode] = useState("desktop");
  const [livePreview, setLivePreview] = useState(true);

  const updateConfig = (path, value) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      const keys = path.split(".");
      let current = newConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const generateEmbedCode = () => {
    return `
<!-- AutoCare Advisor Widget -->
<script>
  window.AutoCareConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="https://widget.autocare-advisor.com/embed.js" async></script>
<div id="autocare-widget"></div>
<!-- End AutoCare Advisor Widget -->
    `.trim();
  };

  const saveConfiguration = async () => {
    try {
      await widgetApi.saveConfiguration(config);
      toast.success("Widget configuration saved successfully");
    } catch (error) {
      toast.error("Failed to save configuration");
    }
  };

  return (
    <div className="widget-customizer">
      <div className="customizer-sidebar">
        <div className="section">
          <h4>Theme & Colors</h4>
          <div className="form-group">
            <label>Theme</label>
            <Select
              value={config.theme}
              onChange={(value) => updateConfig("theme", value)}
              options={[
                { value: "default", label: "Default" },
                { value: "minimal", label: "Minimal" },
                { value: "modern", label: "Modern" },
                { value: "automotive", label: "Automotive" },
              ]}
            />
          </div>

          <div className="color-grid">
            <ColorPicker
              label="Primary Color"
              value={config.colors.primary}
              onChange={(color) => updateConfig("colors.primary", color)}
            />
            <ColorPicker
              label="Background"
              value={config.colors.background}
              onChange={(color) => updateConfig("colors.background", color)}
            />
            <ColorPicker
              label="Text Color"
              value={config.colors.text}
              onChange={(color) => updateConfig("colors.text", color)}
            />
          </div>
        </div>

        <div className="section">
          <h4>Typography</h4>
          <div className="form-group">
            <label>Font Family</label>
            <Select
              value={config.typography.fontFamily}
              onChange={(value) => updateConfig("typography.fontFamily", value)}
              options={[
                { value: "Inter, sans-serif", label: "Inter" },
                { value: "Roboto, sans-serif", label: "Roboto" },
                { value: "Open Sans, sans-serif", label: "Open Sans" },
                { value: "Arial, sans-serif", label: "Arial" },
              ]}
            />
          </div>

          <div className="form-group">
            <label>Font Size</label>
            <input
              type="range"
              min="12"
              max="18"
              value={parseInt(config.typography.fontSize)}
              onChange={(e) =>
                updateConfig("typography.fontSize", `${e.target.value}px`)
              }
            />
            <span>{config.typography.fontSize}</span>
          </div>
        </div>

        <div className="section">
          <h4>Layout</h4>
          <div className="form-group">
            <label>Style</label>
            <RadioGroup
              value={config.layout.style}
              onChange={(value) => updateConfig("layout.style", value)}
              options={[
                { value: "card", label: "Card" },
                { value: "inline", label: "Inline" },
                { value: "modal", label: "Modal" },
              ]}
            />
          </div>

          <div className="form-group">
            <label>Max Width</label>
            <input
              type="text"
              value={config.layout.maxWidth}
              onChange={(e) => updateConfig("layout.maxWidth", e.target.value)}
              placeholder="600px"
            />
          </div>
        </div>

        <div className="section">
          <h4>Content</h4>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={config.content.title}
              onChange={(e) => updateConfig("content.title", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              value={config.content.subtitle}
              onChange={(e) => updateConfig("content.subtitle", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Button Text</label>
            <input
              type="text"
              value={config.content.buttonText}
              onChange={(e) =>
                updateConfig("content.buttonText", e.target.value)
              }
            />
          </div>
        </div>

        <div className="section">
          <h4>Features</h4>
          <div className="feature-toggles">
            <Toggle
              label="Progress Bar"
              checked={config.features.progressBar}
              onChange={(checked) =>
                updateConfig("features.progressBar", checked)
              }
            />
            <Toggle
              label="Question Numbers"
              checked={config.features.questionNumbers}
              onChange={(checked) =>
                updateConfig("features.questionNumbers", checked)
              }
            />
            <Toggle
              label="Back Button"
              checked={config.features.backButton}
              onChange={(checked) =>
                updateConfig("features.backButton", checked)
              }
            />
            <Toggle
              label="Skip Option"
              checked={config.features.skipOption}
              onChange={(checked) =>
                updateConfig("features.skipOption", checked)
              }
            />
          </div>
        </div>

        <div className="actions">
          <Button onClick={saveConfiguration} variant="primary">
            Save Configuration
          </Button>
        </div>
      </div>

      <div className="preview-area">
        <div className="preview-header">
          <h3>Live Preview</h3>
          <div className="preview-controls">
            <div className="device-selector">
              <button
                className={previewMode === "desktop" ? "active" : ""}
                onClick={() => setPreviewMode("desktop")}
              >
                🖥️ Desktop
              </button>
              <button
                className={previewMode === "tablet" ? "active" : ""}
                onClick={() => setPreviewMode("tablet")}
              >
                📱 Tablet
              </button>
              <button
                className={previewMode === "mobile" ? "active" : ""}
                onClick={() => setPreviewMode("mobile")}
              >
                📱 Mobile
              </button>
            </div>

            <Toggle
              label="Live Preview"
              checked={livePreview}
              onChange={setLivePreview}
            />
          </div>
        </div>

        <div className={`preview-container ${previewMode}`}>
          {livePreview ? (
            <WidgetPreview config={config} />
          ) : (
            <div className="preview-placeholder">Live preview disabled</div>
          )}
        </div>

        <div className="embed-code-section">
          <h4>Embed Code</h4>
          <CodeBlock code={generateEmbedCode()} language="html" copyable />
        </div>
      </div>
    </div>
  );
};

// Widget A/B Testing Framework
const ABTestManager = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      try {
        const response = await abTestApi.getActiveTests();
        setTests(response.data);
      } catch (error) {
        console.error("Failed to load A/B tests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  const createTest = async (testConfig) => {
    try {
      const response = await abTestApi.createTest(testConfig);
      setTests((prev) => [...prev, response.data]);
      toast.success("A/B test created successfully");
    } catch (error) {
      toast.error("Failed to create A/B test");
    }
  };

  const pauseTest = async (testId) => {
    try {
      await abTestApi.pauseTest(testId);
      setTests((prev) =>
        prev.map((test) =>
          test.id === testId ? { ...test, status: "paused" } : test
        )
      );
      toast.success("A/B test paused");
    } catch (error) {
      toast.error("Failed to pause A/B test");
    }
  };

  const declareWinner = async (testId, winningVariant) => {
    try {
      await abTestApi.declareWinner(testId, winningVariant);
      setTests((prev) =>
        prev.map((test) =>
          test.id === testId
            ? { ...test, status: "completed", winner: winningVariant }
            : test
        )
      );
      toast.success(`Variant ${winningVariant} declared winner`);
    } catch (error) {
      toast.error("Failed to declare winner");
    }
  };

  if (loading) {
    return <div className="loading">Loading A/B tests...</div>;
  }

  return (
    <div className="ab-test-manager">
      <div className="tests-list">
        <div className="list-header">
          <h2>A/B Tests</h2>
          <Button onClick={() => setSelectedTest("new")}>
            Create New Test
          </Button>
        </div>

        <div className="tests-grid">
          {tests.map((test) => (
            <div key={test.id} className="test-card">
              <div className="test-header">
                <h3>{test.name}</h3>
                <span className={`status ${test.status}`}>{test.status}</span>
              </div>

              <div className="test-stats">
                <div className="stat">
                  <span className="label">Traffic Split</span>
                  <span className="value">{test.trafficSplit}%</span>
                </div>
                <div className="stat">
                  <span className="label">Participants</span>
                  <span className="value">{test.participants}</span>
                </div>
                <div className="stat">
                  <span className="label">Conversion Rate</span>
                  <span className="value">{test.conversionRate}%</span>
                </div>
              </div>

              <div className="variants">
                {test.variants.map((variant) => (
                  <div key={variant.id} className="variant">
                    <span className="variant-name">{variant.name}</span>
                    <span className="conversion-rate">
                      {variant.conversionRate}%
                    </span>
                    {test.winner === variant.id && (
                      <span className="winner-badge">Winner</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="test-actions">
                <Button variant="outline" onClick={() => setSelectedTest(test)}>
                  View Details
                </Button>

                {test.status === "running" && (
                  <Button variant="outline" onClick={() => pauseTest(test.id)}>
                    Pause
                  </Button>
                )}

                {test.status === "running" && test.participants > 100 && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      const bestVariant = test.variants.reduce(
                        (best, current) =>
                          current.conversionRate > best.conversionRate
                            ? current
                            : best
                      );
                      declareWinner(test.id, bestVariant.id);
                    }}
                  >
                    Declare Winner
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTest === "new" && (
        <CreateTestModal
          onClose={() => setSelectedTest(null)}
          onCreate={createTest}
        />
      )}

      {selectedTest && selectedTest !== "new" && (
        <TestDetailsModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}
    </div>
  );
};
```

---

## **WOCHE 6: PERFORMANCE & SCALING**

### **DevOps Engineer - Infrastructure Scaling**

**Daily Tasks:**

- **Tag 1**: Auto-scaling Configuration
- **Tag 2**: Database Performance Optimization
- **Tag 3**: CDN & Caching Strategy Implementation
- **Tag 4**: Monitoring & Alerting Enhancement
- **Tag 5**: Security Hardening & Compliance

**Code Example - Auto-scaling Configuration:**

```yaml
# terraform/auto-scaling.tf
resource "aws_autoscaling_group" "autocare_api" {
  name                = "autocare-api-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.api.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  min_size         = 2
  max_size         = 20
  desired_capacity = 3

  launch_template {
    id      = aws_launch_template.api.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "autocare-api"
    propagate_at_launch = true
  }

  # Scaling policies
  enabled_metrics = [
    "GroupMinSize",
    "GroupMaxSize",
    "GroupDesiredCapacity",
    "GroupInServiceInstances",
    "GroupTotalInstances"
  ]
}

# Scale up policy
resource "aws_autoscaling_policy" "scale_up" {
  name                   = "autocare-scale-up"
  scaling_adjustment     = 2
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 300
  autoscaling_group_name# AutoCare Advisor - SaaS Full-Stack Development Blueprint
## Detaillierte Phasenplanung für 7-köpfiges Entwicklungsteam

---

# PROJECT OVERVIEW

**Projekt**: AutoCare Advisor - B2B SaaS Autopflege-Beratungsplatform
**Team**: 7 Entwickler (1 CTO, 2 Backend, 2 Frontend, 1 DevOps, 1 Data Scientist)
**Timeline**: 16 Wochen MVP + 32 Wochen Skalierung
**Tech Stack**: Node.js, React, PostgreSQL, MongoDB, AWS, Docker

---

# TECHNICAL ARCHITECTURE

## **System Architecture**

```

┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Customer │ │ Partner │ │ Admin │
│ Widget │ │ Dashboard │ │ Panel │
│ (React) │ │ (React) │ │ (React) │
└─────────────────┘ └──────────────────┘ └─────────────────┘
│ │ │
└───────────────────────┼───────────────────────┘
│
┌─────────────────────────┐
│ API Gateway │
│ (Express.js) │
└─────────────────────────┘
│
┌───────────────────────┼───────────────────────┐
│ │ │
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Recommendation │ │ User Management │ │ Analytics │
│ Service │ │ Service │ │ Service │
│ (Node.js) │ │ (Node.js) │ │ (Python) │
└─────────────────┘ └──────────────────┘ └─────────────────┘
│ │ │
│ │ │
┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ MongoDB │ │ PostgreSQL │ │ ClickHouse │
│ (Products) │ │ (Users/Orders) │ │ (Analytics) │
└─────────────────┘ └──────────────────┘ └─────────────────┘

````

## **Database Schema Design**

### **PostgreSQL (Transactional Data)**
```sql
-- Users & Authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    tier_level VARCHAR(20) NOT NULL DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions & Billing
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    tier_level VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    stripe_subscription_id VARCHAR(255),
    current_period_start DATE,
    current_period_end DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Widget Configurations
CREATE TABLE widget_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    domain VARCHAR(255) NOT NULL,
    widget_style JSON,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Click Tracking & Billing
CREATE TABLE click_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    widget_id UUID REFERENCES widget_configs(id),
    product_id VARCHAR(255),
    clicked_at TIMESTAMP DEFAULT NOW(),
    cost_per_click DECIMAL(5,2),
    billed BOOLEAN DEFAULT false
);
````

### **MongoDB (Product Catalog)**

```javascript
// Products Collection
{
  _id: ObjectId,
  partnerId: String,
  name: String,
  description: String,
  price: Number,
  images: [String],
  category: String,
  tags: [String],
  compatibility: {
    vehicleTypes: [String],
    paintTypes: [String],
    materials: [String]
  },
  specifications: {
    volume: String,
    application: String,
    season: String,
    environmentFriendly: Boolean
  },
  analytics: {
    views: Number,
    clicks: Number,
    conversions: Number,
    rating: Number
  },
  createdAt: Date,
  updatedAt: Date
}

// Questionnaire Templates
{
  _id: ObjectId,
  version: String,
  questions: [{
    id: String,
    type: String, // radio, checkbox, select
    text: String,
    options: [String],
    scoring: Object,
    conditions: Object // for conditional questions
  }],
  scoringRules: Object,
  active: Boolean,
  createdAt: Date
}
```

---

# PHASE 1: FOUNDATION & CORE (Wochen 1-4)

## **Team Allocation**

- **CTO**: Architecture, Code Reviews, Technical Leadership
- **Backend Dev 1**: User Management & Authentication
- **Backend Dev 2**: Product Management & API Foundation
- **Frontend Dev 1**: Partner Dashboard Foundation
- **Frontend Dev 2**: Customer Widget Foundation
- **DevOps**: Infrastructure Setup & CI/CD
- **Data Scientist**: Recommendation Algorithm Foundation

---

## **WOCHE 1: PROJECT SETUP & INFRASTRUCTURE**

### **DevOps Engineer Tasks**

```bash
# Infrastructure as Code Setup
├── terraform/
│   ├── vpc.tf              # VPC with public/private subnets
│   ├── rds.tf              # PostgreSQL RDS instance
│   ├── documentdb.tf       # MongoDB-compatible DocumentDB
│   ├── elasticache.tf      # Redis for caching
│   ├── ecs.tf              # ECS cluster for containers
│   ├── alb.tf              # Application Load Balancer
│   └── cloudfront.tf       # CDN for widget delivery
```

**Daily Tasks:**

- **Tag 1**: AWS Account Setup + Terraform Infrastructure
- **Tag 2**: CI/CD Pipeline (GitHub Actions)
- **Tag 3**: Development Environment Setup
- **Tag 4**: Staging Environment Setup
- **Tag 5**: Monitoring Setup (CloudWatch + DataDog)

**Deliverables:**

- ✅ Dev/Staging/Prod Environments laufen
- ✅ CI/CD Pipeline funktioniert
- ✅ Monitoring & Alerting aktiv
- ✅ SSL Certificates & Domains konfiguriert

### **Backend Dev 1 Tasks - User Management**

```javascript
// Project Structure Setup
src/
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   └── subscription.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   └── rateLimit.middleware.js
├── models/
│   ├── User.js
│   ├── Subscription.js
│   └── WidgetConfig.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   └── subscription.routes.js
├── services/
│   ├── auth.service.js
│   ├── email.service.js
│   └── stripe.service.js
└── utils/
    ├── database.js
    ├── logger.js
    └── validators.js
```

**Daily Tasks:**

- **Tag 1**: Express.js Setup + Database Connection
- **Tag 2**: User Registration/Login API
- **Tag 3**: JWT Authentication Middleware
- **Tag 4**: Password Reset Functionality
- **Tag 5**: Email Service Integration (SendGrid)

**Deliverables:**

- ✅ RESTful User API (CRUD operations)
- ✅ JWT-basierte Authentication
- ✅ Password Reset via Email
- ✅ Input Validation & Sanitization

### **Backend Dev 2 Tasks - Product Management**

```javascript
// MongoDB Connection & Models
├── models/
│   ├── Product.js
│   ├── Category.js
│   ├── Questionnaire.js
│   └── Analytics.js
├── controllers/
│   ├── product.controller.js
│   ├── category.controller.js
│   └── analytics.controller.js
├── services/
│   ├── product.service.js
│   ├── search.service.js
│   └── imageUpload.service.js
```

**Daily Tasks:**

- **Tag 1**: MongoDB Connection + Product Schema
- **Tag 2**: Product CRUD API Implementation
- **Tag 3**: Category Management System
- **Tag 4**: Image Upload Service (AWS S3)
- **Tag 5**: Search & Filtering API

**Deliverables:**

- ✅ Product Management API
- ✅ Category System
- ✅ Image Upload Pipeline
- ✅ Basic Search Functionality

### **Frontend Dev 1 Tasks - Dashboard Foundation**

```javascript
// React Dashboard Structure
src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ForgotPassword.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Input.jsx
│       └── Modal.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Analytics.jsx
│   └── Settings.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useApi.js
│   └── useLocalStorage.js
├── services/
│   ├── api.js
│   ├── auth.js
│   └── storage.js
└── utils/
    ├── constants.js
    ├── helpers.js
    └── validators.js
```

**Daily Tasks:**

- **Tag 1**: React App Setup + Routing (React Router)
- **Tag 2**: Authentication Pages (Login/Register)
- **Tag 3**: Dashboard Layout & Navigation
- **Tag 4**: Basic Product Management Interface
- **Tag 5**: State Management Setup (Redux Toolkit)

**Deliverables:**

- ✅ Authentication Flow komplett
- ✅ Dashboard Layout responsive
- ✅ Basic Product Management UI
- ✅ State Management konfiguriert

### **Frontend Dev 2 Tasks - Widget Foundation**

```javascript
// Widget Structure (Embeddable)
widget/
├── src/
│   ├── components/
│   │   ├── Questionnaire.jsx
│   │   ├── QuestionStep.jsx
│   │   ├── ProductCard.jsx
│   │   └── ResultsDisplay.jsx
│   ├── hooks/
│   │   ├── useQuestionnaire.js
│   │   ├── useRecommendations.js
│   │   └── useAnalytics.js
│   ├── services/
│   │   ├── widgetApi.js
│   │   └── analytics.js
│   └── styles/
│       ├── widget.css
│       └── themes.css
├── public/
│   └── embed.js              # Widget Embed Script
└── build/
    └── widget.min.js         # Production Build
```

**Daily Tasks:**

- **Tag 1**: Widget React App Setup (separates Build)
- **Tag 2**: Questionnaire Component Structure
- **Tag 3**: Embed Script Development
- **Tag 4**: PostMessage Communication Setup
- **Tag 5**: Widget Styling System

**Deliverables:**

- ✅ Embeddable Widget Framework
- ✅ Basic Questionnaire Flow
- ✅ Parent-Widget Communication
- ✅ Responsive Widget Design

### **Data Scientist Tasks - Algorithm Foundation**

```python
# Recommendation Engine Setup
recommendation_engine/
├── src/
│   ├── models/
│   │   ├── scoring.py
│   │   ├── compatibility.py
│   │   └── ranking.py
│   ├── services/
│   │   ├── recommendation.py
│   │   ├── analytics.py
│   │   └── learning.py
│   ├── utils/
│   │   ├── data_processing.py
│   │   ├── feature_engineering.py
│   │   └── evaluation.py
│   └── api/
│       ├── recommendation_api.py
│       └── analytics_api.py
```

**Daily Tasks:**

- **Tag 1**: Python Environment + Dependencies Setup
- **Tag 2**: Scoring Algorithm Development
- **Tag 3**: Product Compatibility Matrix
- **Tag 4**: Basic Recommendation API
- **Tag 5**: Testing & Validation Framework

**Deliverables:**

- ✅ Scoring Algorithm (v1)
- ✅ Product Compatibility Engine
- ✅ Recommendation API Endpoint
- ✅ Algorithm Testing Suite

### **CTO Tasks - Architecture & Coordination**

**Daily Tasks:**

- **Tag 1**: Final Architecture Review & Team Alignment
- **Tag 2**: Code Review Standards & Guidelines
- **Tag 3**: API Design Standards & Documentation
- **Tag 4**: Security Best Practices Implementation
- **Tag 5**: Weekly Sprint Planning & Retrospective

**Deliverables:**

- ✅ Technical Documentation Complete
- ✅ Development Standards Defined
- ✅ Security Guidelines Implemented
- ✅ Team Coordination Processes

---

## **WOCHE 2: CORE FUNCTIONALITY DEVELOPMENT**

### **Backend Dev 1 - Subscription & Billing**

```javascript
// Stripe Integration
├── controllers/
│   ├── billing.controller.js
│   ├── subscription.controller.js
│   └── webhook.controller.js
├── services/
│   ├── stripe.service.js
│   ├── billing.service.js
│   └── usage.service.js
├── models/
│   ├── BillingEvent.js
│   ├── UsageRecord.js
│   └── Invoice.js
```

**Daily Tasks:**

- **Tag 1**: Stripe Integration Setup
- **Tag 2**: Subscription Management API
- **Tag 3**: Usage-based Billing System
- **Tag 4**: Webhook Handler für Stripe Events
- **Tag 5**: Billing Dashboard API

**Code Example - Subscription Service:**

```javascript
class SubscriptionService {
  async createSubscription(userId, tierId, paymentMethodId) {
    try {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        payment_method: paymentMethodId,
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: this.getTierPriceId(tierId) }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });

      // Save to database
      await Subscription.create({
        userId,
        stripeSubscriptionId: subscription.id,
        tierLevel: tierId,
        status: subscription.status,
      });

      return subscription;
    } catch (error) {
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }

  async recordUsage(userId, clicks) {
    const subscription = await this.getUserSubscription(userId);
    const costPerClick = this.getTierCostPerClick(subscription.tierLevel);

    await UsageRecord.create({
      userId,
      subscriptionId: subscription.id,
      clicks,
      cost: clicks * costPerClick,
      recordedAt: new Date(),
    });
  }
}
```

### **Backend Dev 2 - Recommendation Engine Integration**

```javascript
// Recommendation System
├── controllers/
│   ├── recommendation.controller.js
│   ├── questionnaire.controller.js
│   └── analytics.controller.js
├── services/
│   ├── recommendation.service.js
│   ├── scoring.service.js
│   └── personalization.service.js
```

**Daily Tasks:**

- **Tag 1**: Questionnaire Management API
- **Tag 2**: Recommendation Engine Integration
- **Tag 3**: Scoring Algorithm Implementation
- **Tag 4**: Real-time Analytics Collection
- **Tag 5**: Performance Optimization

**Code Example - Recommendation Controller:**

```javascript
class RecommendationController {
  async getRecommendations(req, res) {
    try {
      const { answers, partnerId, limit = 6 } = req.body;

      // Validate questionnaire answers
      const validation = await QuestionnaireService.validateAnswers(answers);
      if (!validation.valid) {
        return res.status(400).json({ error: validation.errors });
      }

      // Get partner's products
      const partnerProducts = await ProductService.getPartnerProducts(
        partnerId
      );

      // Calculate scores for each product
      const scoredProducts = await ScoringService.scoreProducts(
        partnerProducts,
        answers,
        partnerId
      );

      // Apply tier-based ranking boost
      const rankedProducts = await RankingService.applyTierBoost(
        scoredProducts,
        partnerId
      );

      // Return top recommendations
      const recommendations = rankedProducts.slice(0, limit);

      // Record analytics
      await AnalyticsService.recordRecommendation({
        partnerId,
        answers,
        recommendations: recommendations.map((p) => p.id),
      });

      res.json({
        success: true,
        recommendations,
        metadata: {
          totalScored: scoredProducts.length,
          averageScore: this.calculateAverageScore(scoredProducts),
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

### **Frontend Dev 1 - Product Management Interface**

```jsx
// Product Management Components
├── components/
│   ├── products/
│   │   ├── ProductList.jsx
│   │   ├── ProductForm.jsx
│   │   ├── ProductCard.jsx
│   │   └── BulkActions.jsx
│   ├── categories/
│   │   ├── CategoryManager.jsx
│   │   └── CategoryForm.jsx
│   └── upload/
│       ├── ImageUpload.jsx
│       ├── CSVUpload.jsx
│       └── BulkImport.jsx
```

**Daily Tasks:**

- **Tag 1**: Product List Interface mit Pagination
- **Tag 2**: Product Add/Edit Forms
- **Tag 3**: Image Upload Component
- **Tag 4**: Category Management Interface
- **Tag 5**: Bulk Import/Export Functionality

**Code Example - Product Form:**

```jsx
const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category: product?.category || "",
    compatibility: product?.compatibility || {
      vehicleTypes: [],
      paintTypes: [],
      materials: [],
    },
    images: product?.images || [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validation = validateProduct(formData);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      await productApi.saveProduct(formData);
      toast.success("Product saved successfully");
      onSave();
    } catch (error) {
      toast.error("Failed to save product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <div className="form-section">
        <h3>Basic Information</h3>
        <Input
          label="Product Name"
          value={formData.name}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, name: value }))
          }
          required
        />

        <TextArea
          label="Description"
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
          rows={4}
        />

        <Select
          label="Category"
          value={formData.category}
          options={categories}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
          required
        />
      </div>

      <div className="form-section">
        <h3>Compatibility</h3>
        <MultiSelect
          label="Vehicle Types"
          value={formData.compatibility.vehicleTypes}
          options={vehicleTypeOptions}
          onChange={(values) =>
            setFormData((prev) => ({
              ...prev,
              compatibility: { ...prev.compatibility, vehicleTypes: values },
            }))
          }
        />
      </div>

      <div className="form-section">
        <h3>Images</h3>
        <ImageUpload
          images={formData.images}
          onImagesChange={(images) =>
            setFormData((prev) => ({ ...prev, images }))
          }
          maxImages={5}
        />
      </div>

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Save Product
        </Button>
      </div>
    </form>
  );
};
```

### **Frontend Dev 2 - Interactive Questionnaire**

```jsx
// Questionnaire Components
├── components/
│   ├── questionnaire/
│   │   ├── QuestionnaireFlow.jsx
│   │   ├── QuestionStep.jsx
│   │   ├── ProgressBar.jsx
│   │   └── NavigationButtons.jsx
│   ├── questions/
│   │   ├── RadioQuestion.jsx
│   │   ├── CheckboxQuestion.jsx
│   │   └── SelectQuestion.jsx
│   └── results/
│       ├── ResultsDisplay.jsx
│       ├── ProductCard.jsx
│       └── ComparisonTable.jsx
```

**Daily Tasks:**

- **Tag 1**: Question Components (Radio, Checkbox, Select)
- **Tag 2**: Questionnaire Flow Logic
- **Tag 3**: Progress Indicator & Navigation
- **Tag 4**: Results Display Interface
- **Tag 5**: Mobile Responsiveness

**Code Example - Questionnaire Flow:**

```jsx
const QuestionnaireFlow = ({ partnerId, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadQuestionnaire = async () => {
      try {
        const questionnaireData = await questionnaireApi.getActive();
        setQuestions(questionnaireData.questions);
      } catch (error) {
        console.error("Failed to load questionnaire:", error);
      }
    };

    loadQuestionnaire();
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const recommendations = await recommendationApi.getRecommendations({
        answers,
        partnerId,
        limit: 6,
      });

      onComplete(recommendations);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (questions.length === 0) {
    return <div className="loading">Loading questionnaire...</div>;
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="questionnaire-flow">
      <ProgressBar progress={progress} />

      <div className="question-container">
        <QuestionStep
          question={currentQuestion}
          answer={answers[currentQuestion.id]}
          onAnswerChange={(answer) =>
            handleAnswerChange(currentQuestion.id, answer)
          }
        />
      </div>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={questions.length}
        canProceed={!!answers[currentQuestion.id]}
        onPrevious={() => setCurrentStep((prev) => prev - 1)}
        onNext={handleNext}
        loading={loading}
      />
    </div>
  );
};
```

### **Data Scientist - Advanced Scoring Algorithm**

```python
# Advanced Recommendation Engine
class RecommendationEngine:
    def __init__(self):
        self.compatibility_weights = {
            'vehicleType': 0.25,
            'paintType': 0.20,
            'experienceLevel': 0.15,
            'budget': 0.15,
            'application': 0.10,
            'season': 0.10,
            'environmental': 0.05
        }

    def score_product(self, product, answers, partner_tier):
        """
        Calculate comprehensive product score based on user answers
        """
        compatibility_score = self._calculate_compatibility(product, answers)
        quality_score = self._calculate_quality_score(product)
        tier_boost = self._get_tier_boost(partner_tier)
        price_score = self._calculate_price_score(product, answers.get('budget'))

        # Weighted final score
        final_score = (
            compatibility_score * 0.40 +
            quality_score * 0.20 +
            price_score * 0.10 +
            tier_boost * 0.25 +
            self._calculate_availability_score(product) * 0.05
        )

        return min(100, max(0, final_score))

    def _calculate_compatibility(self, product, answers):
        """Calculate how well product matches user needs"""
        score = 0
        total_weight = 0

        for criteria, weight in self.compatibility_weights.items():
            if criteria in answers:
                match_score = self._get_criteria_match(
                    product, criteria, answers[criteria]
                )
                score += match_score * weight
                total_weight += weight

        return (score / total_weight) * 100 if total_weight > 0 else 0

    def _get_tier_boost(self, partner_tier):
        """Apply tier-based ranking boost"""
        tier_multipliers = {
            'basic': 1.0,
            'professional': 1.5,
            'enterprise': 2.0
        }
        return tier_multipliers.get(partner_tier, 1.0) * 25

    def get_recommendations(self, products, answers, partner_id, limit=6):
        """Get top product recommendations"""
        partner = self.get_partner_info(partner_id)

        scored_products = []
        for product in products:
            if product['partnerId'] == partner_id:
                score = self.score_product(product, answers, partner['tier'])
                scored_products.append({
                    **product,
                    'score': score,
                    'reasons': self._get_recommendation_reasons(product, answers)
                })

        # Sort by score and apply tier-based distribution
        scored_products.sort(key=lambda x: x['score'], reverse=True)

        return self._apply_tier_distribution(scored_products, limit)
```

---

## **WOCHE 3: INTEGRATION & TESTING**

### **Backend Dev 1 - API Integration & Security**

**Daily Tasks:**

- **Tag 1**: API Gateway Setup mit Rate Limiting
- **Tag 2**: CORS & Security Headers Implementation
- **Tag 3**: API Documentation (Swagger/OpenAPI)
- **Tag 4**: Authentication Middleware Testing
- **Tag 5**: Security Audit & Penetration Testing

**Code Example - API Security Middleware:**

```javascript
// Security Middleware Stack
const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),

  cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),

  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
      // Different limits based on tier
      const userTier = req.user?.tierLevel || "basic";
      const limits = {
        basic: 100,
        professional: 500,
        enterprise: 2000,
      };
      return limits[userTier];
    },
    message: "Too many requests from this IP",
    standardHeaders: true,
    legacyHeaders: false,
  }),
];
```

### **Backend Dev 2 - Analytics & Monitoring**

**Daily Tasks:**

- **Tag 1**: ClickHouse Analytics Database Setup
- **Tag 2**: Real-time Event Tracking Implementation
- **Tag 3**: Dashboard Analytics API
- **Tag 4**: Performance Monitoring Integration
- **Tag 5**: Data Export & Reporting Features

**Code Example - Analytics Service:**

```javascript
class AnalyticsService {
  constructor() {
    this.clickhouse = new ClickHouse({
      url: process.env.CLICKHOUSE_URL,
      database: "autocare_analytics",
    });
  }

  async trackWidgetImpression(data) {
    const event = {
      event_type: "widget_impression",
      timestamp: new Date(),
      partner_id: data.partnerId,
      widget_id: data.widgetId,
      user_agent: data.userAgent,
      ip_address: this.hashIP(data.ipAddress),
      referrer: data.referrer,
      page_url: data.pageUrl,
    };

    await this.insertEvent(event);
  }

  async trackQuestionnaireStart(data) {
    const event = {
      event_type: "questionnaire_start",
      timestamp: new Date(),
      partner_id: data.partnerId,
      session_id: data.sessionId,
      questions_version: data.questionnaireVersion,
    };

    await this.insertEvent(event);
  }

  async generatePartnerReport(partnerId, dateRange) {
    const query = `
      SELECT 
        toDate(timestamp) as date,
        count(*) as total_events,
        countIf(event_type = 'widget_impression') as impressions,
        countIf(event_type = 'questionnaire_complete') as completions,
        countIf(event_type = 'product_click') as clicks,
        round(countIf(event_type = 'questionnaire_complete') / countIf(event_type = 'widget_impression') * 100, 2) as completion_rate,
        round(countIf(event_type = 'product_click') / countIf(event_type = 'questionnaire_complete') * 100, 2) as click_through_rate
      FROM analytics_events 
      WHERE partner_id = {partnerId:String}
        AND timestamp >= {startDate:DateTime}
        AND timestamp <= {endDate:DateTime}
      GROUP BY date
      ORDER BY date DESC
    `;

    return await this.clickhouse
      .query(query, {
        partnerId,
        startDate: dateRange.start,
        endDate: dateRange.end,
      })
      .toPromise();
  }
}
```

### **Frontend Dev 1 - Dashboard Analytics & Billing**

**Daily Tasks:**

- **Tag 1**: Analytics Dashboard Components
- **Tag 2**: Billing Interface & Payment Methods
- **Tag 3**: Subscription Management Interface
- **Tag 4**: Usage Monitoring Dashboard
- **Tag 5**: Reports & Data Export Features

**Code Example - Analytics Dashboard:**

```jsx
const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics", dateRange],
    queryFn: () => analyticsApi.getPartnerAnalytics(dateRange),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const chartData = useMemo(() => {
    if (!analyticsData) return [];

    return analyticsData.map((day) => ({
      date: format(parseISO(day.date), "MMM dd"),
      impressions: day.impressions,
      completions: day.completions,
      clicks: day.clicks,
      conversionRate: day.completion_rate,
      ctr: day.click_through_rate,
    }));
  }, [analyticsData]);

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          maxDate={new Date()}
        />
      </div>

      <div className="kpi-grid">
        <KPICard
          title="Total Impressions"
          value={analytics?.totalImpressions}
          change={analytics?.impressionsChange}
          trend="up"
        />
        <KPICard
          title="Completion Rate"
          value={`${analytics?.completionRate}%`}
          change={analytics?.completionRateChange}
          trend="up"
        />
        <KPICard
          title="Click-Through Rate"
          value={`${analytics?.clickThroughRate}%`}
          change={analytics?.ctrChange}
          trend="up"
        />
        <KPICard
          title="Revenue Generated"
          value={`€${analytics?.revenue}`}
          change={analytics?.revenueChange}
          trend="up"
        />
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="impressions"
                stroke="#8884d8"
                name="Impressions"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="completions"
                stroke="#82ca9d"
                name="Completions"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversionRate"
                stroke="#ffc658"
                name="Conversion Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Top Performing Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="detailed-table">
        <AnalyticsTable data={analyticsData} />
      </div>
    </div>
  );
};
```

### **Frontend Dev 2 - Widget Optimization & Testing**

**Daily Tasks:**

- **Tag 1**: Widget Performance Optimization
- **Tag 2**: Cross-browser Testing & Fixes
- **Tag 3**: Mobile Responsiveness Testing
- **Tag 4**: A/B Testing Framework Implementation
- **Tag 5**: Widget Analytics Integration

**Code Example - Widget A/B Testing:**

```jsx
const WidgetManager = () => {
  const [variant, setVariant] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // Determine A/B test variant
    const determineVariant = () => {
      const userId = getWidgetUserId();
      const hash = hashCode(userId + "questionnaire_v1");
      return Math.abs(hash) % 2 === 0 ? "control" : "treatment";
    };

    const currentVariant = determineVariant();
    setVariant(currentVariant);

    // Track variant assignment
    analytics.track("widget_variant_assigned", {
      variant: currentVariant,
      test_name: "questionnaire_v1",
    });
  }, []);

  const WidgetComponent =
    variant === "treatment" ? QuestionnaireV2 : QuestionnaireV1;

  return (
    <div className="widget-container">
      <WidgetComponent
        onComplete={(results) => {
          analytics.track("questionnaire_completed", {
            variant,
            time_to_complete: results.timeToComplete,
            answers_count: results.answers.length,
          });
        }}
        onAbandon={(step) => {
          analytics.track("questionnaire_abandoned", {
            variant,
            abandon_step: step,
            progress_percentage: (step / totalSteps) * 100,
          });
        }}
      />
    </div>
  );
};
```

### **Data Scientist - ML Model Training & Optimization**

**Daily Tasks:**

- **Tag 1**: Data Collection Pipeline Setup
- **Tag 2**: Feature Engineering & Data Preprocessing
- **Tag 3**: Model Training & Validation
- **Tag 4**: A/B Testing for Algorithm Variants
- **Tag 5**: Performance Monitoring & Alerting

**Code Example - ML Pipeline:**

```python
class MLRecommendationPipeline:
    def __init__(self):
        self.feature_extractor = FeatureExtractor()
        self.model = None
        self.scaler = StandardScaler()

    def prepare_training_data(self, start_date, end_date):
        """Prepare training data from historical interactions"""

        # Get historical questionnaire responses and outcomes
        query = """
        SELECT
            qr.answers,
            qr.partner_id,
            pr.product_id,
            CASE WHEN ce.id IS NOT NULL THEN 1 ELSE 0 END as clicked,
            p.category,
            p.price,
            p.rating,
            p.compatibility
        FROM questionnaire_responses qr
        LEFT JOIN product_recommendations pr ON qr.session_id = pr.session_id
        LEFT JOIN click_events ce ON pr.product_id = ce.product_id
            AND pr.session_id = ce.session_id
        LEFT JOIN products p ON pr.product_id = p.id
        WHERE qr.created_at BETWEEN %s AND %s
        """

        raw_data = self.db.execute(query, [start_date, end_date])

        # Feature engineering
        features = []
        labels = []

        for row in raw_data:
            feature_vector = self.feature_extractor.extract_features(
                answers=row['answers'],
                product=row,
                partner_context=row['partner_id']
            )

            features.append(feature_vector)
            labels.append(row['clicked'])

        return np.array(features), np.array(labels)

    def train_model(self, X, y):
        """Train the recommendation model"""

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        # Train ensemble model
        models = {
            'xgboost': XGBClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42
            ),
            'lightgbm': LGBMClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42
            ),
            'neural_net': MLPClassifier(
                hidden_layer_sizes=(128, 64, 32),
                random_state=42,
                max_iter=1000
            )
        }

        trained_models = {}
        for name, model in models.items():
            model.fit(X_train_scaled, y_train)
            y_pred = model.predict_proba(X_test_scaled)[:, 1]

            auc_score = roc_auc_score(y_test, y_pred)
            print(f"{name} AUC: {auc_score:.4f}")

            trained_models[name] = model

        # Create ensemble
        self.model = VotingClassifier(
            estimators=[(name, model) for name, model in trained_models.items()],
            voting='soft'
        )

        self.model.fit(X_train_scaled, y_train)

        # Validate ensemble
        ensemble_pred = self.model.predict_proba(X_test_scaled)[:, 1]
        ensemble_auc = roc_auc_score(y_test, ensemble_pred)
        print(f"Ensemble AUC: {ensemble_auc:.4f}")

        return ensemble_auc

    def predict_click_probability(self, answers, products, partner_id):
        """Predict click probability for products given answers"""

        predictions = []
        for product in products:
            features = self.feature_extractor.extract_features(
                answers=answers,
                product=product,
                partner_context=partner_id
            )

            scaled_features = self.scaler.transform([features])
            click_prob = self.model.predict_proba(scaled_features)[0][1]

            predictions.append({
                'product_id': product['id'],
                'click_probability': float(click_prob),
                'confidence': self._calculate_confidence(scaled_features)
            })

        return sorted(predictions, key=lambda x: x['click_probability'], reverse=True)

class FeatureExtractor:
    def extract_features(self, answers, product, partner_context):
        """Extract features for ML model"""

        features = []

        # Answer-based features
        features.extend(self._extract_answer_features(answers))

        # Product-based features
        features.extend(self._extract_product_features(product))

        # Compatibility features
        features.extend(self._extract_compatibility_features(answers, product))

        # Partner-based features
        features.extend(self._extract_partner_features(partner_context))

        # Interaction features
        features.extend(self._extract_interaction_features(answers, product))

        return features

    def _extract_answer_features(self, answers):
        """Extract features from questionnaire answers"""
        features = []

        # Vehicle type encoding
        vehicle_types = ['PKW', 'SUV', 'Oldtimer', 'Motorrad']
        for vtype in vehicle_types:
            features.append(1 if answers.get('vehicleType') == vtype else 0)

        # Experience level (ordinal)
        experience_map = {'beginner': 1, 'intermediate': 2, 'expert': 3}
        features.append(experience_map.get(answers.get('experience'), 1))

        # Budget (normalized)
        budget_ranges = {'<50': 25, '50-100': 75, '100-200': 150, '200+': 250}
        budget_value = budget_ranges.get(answers.get('budget'), 50)
        features.append(budget_value / 250)  # Normalize to 0-1

        return features

    def _extract_product_features(self, product):
        """Extract features from product data"""
        features = []

        # Price (normalized)
        features.append(product.get('price', 0) / 100)  # Normalize by typical max price

        # Rating
        features.append(product.get('rating', 0) / 5)  # Normalize to 0-1

        # Category encoding
        categories = ['shampoo', 'wax', 'polish', 'cleaner', 'protection']
        for cat in categories:
            features.append(1 if product.get('category') == cat else 0)

        return features

    def _extract_compatibility_features(self, answers, product):
        """Extract compatibility-based features"""
        features = []

        # Vehicle type compatibility
        user_vehicle = answers.get('vehicleType', '')
        product_vehicles = product.get('compatibility', {}).get('vehicleTypes', [])
        features.append(1 if user_vehicle in product_vehicles else 0)

        # Paint type compatibility
        user_paint = answers.get('paintType', '')
        product_paints = product.get('compatibility', {}).get('paintTypes', [])
        features.append(1 if user_paint in product_paints else 0)

        return features
```

---

## **WOCHE 4: TESTING & LAUNCH PREPARATION**

### **DevOps Engineer - Production Deployment**

**Daily Tasks:**

- **Tag 1**: Production Environment Finalization
- **Tag 2**: Load Testing & Performance Optimization
- **Tag 3**: Security Audit & Penetration Testing
- **Tag 4**: Backup & Disaster Recovery Testing
- **Tag 5**: Monitoring & Alerting Setup

**Code Example - Deployment Pipeline:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}

      - name: Run security audit
        run: npm audit --audit-level high

      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: eu-central-1

      - name: Deploy to ECS
        run: |
          # Build and push Docker image
          docker build -t autocare-advisor:${{ github.sha }} .
          docker tag autocare-advisor:${{ github.sha }} $ECR_REGISTRY/autocare-advisor:latest
          docker push $ECR_REGISTRY/autocare-advisor:latest

          # Update ECS service
          aws ecs update-service \
            --cluster autocare-production \
            --service autocare-api \
            --force-new-deployment

      - name: Run database migrations
        run: |
          npm run migrate:production
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}

      - name: Health check
        run: |
          # Wait for deployment to complete
          sleep 60

          # Check API health
          curl -f https://api.autocare-advisor.com/health || exit 1

          # Check widget availability
          curl -f https://widget.autocare-advisor.com/health || exit 1

      - name: Notify team
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: "#deployments"
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### **Backend Team - End-to-End Testing**

**Daily Tasks:**

- **Tag 1**: API Integration Testing
- **Tag 2**: Load Testing & Performance Benchmarks
- **Tag 3**: Security Testing & Vulnerability Assessment
- **Tag 4**: Database Performance Optimization
- **Tag 5**: Error Handling & Edge Cases

**Code Example - Integration Tests:**

```javascript
// tests/integration/recommendation.test.js
describe("Recommendation API Integration", () => {
  let testUser, testProducts;

  beforeAll(async () => {
    // Setup test data
    testUser = await createTestUser({
      tierLevel: "professional",
      email: "test@autocare.com",
    });

    testProducts = await createTestProducts([
      {
        name: "Premium Car Shampoo",
        category: "shampoo",
        price: 25.99,
        compatibility: {
          vehicleTypes: ["PKW", "SUV"],
          paintTypes: ["metallic", "solid"],
        },
      },
      {
        name: "Professional Wax",
        category: "wax",
        price: 45.99,
        compatibility: {
          vehicleTypes: ["PKW"],
          paintTypes: ["metallic"],
        },
      },
    ]);
  });

  describe("POST /api/recommendations", () => {
    test("should return personalized recommendations", async () => {
      const questionnaire = {
        vehicleType: "PKW",
        paintType: "metallic",
        experience: "beginner",
        budget: "50-100",
        timeAvailable: "1-2hours",
      };

      const response = await request(app)
        .post("/api/recommendations")
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({
          answers: questionnaire,
          partnerId: testUser.id,
          limit: 5,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.recommendations).toHaveLength(2);
      expect(response.body.recommendations[0].score).toBeGreaterThan(70);

      // Verify tier boost is applied
      const professionalProducts = response.body.recommendations.filter(
        (p) => p.partnerId === testUser.id
      );
      expect(professionalProducts.length).toBeGreaterThan(0);
    });

    test("should handle invalid questionnaire data", async () => {
      const response = await request(app)
        .post("/api/recommendations")
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({
          answers: { invalid: "data" },
          partnerId: testUser.id,
        })
        .expect(400);

      expect(response.body.error).toContain("validation");
    });

    test("should respect rate limits", async () => {
      // Make multiple requests quickly
      const promises = Array(200)
        .fill()
        .map(() =>
          request(app)
            .post("/api/recommendations")
            .set("Authorization", `Bearer ${testUser.token}`)
            .send({
              answers: { vehicleType: "PKW" },
              partnerId: testUser.id,
            })
        );

      const results = await Promise.allSettled(promises);
      const rateLimited = results.filter(
        (r) => r.status === "fulfilled" && r.value.status === 429
      );

      expect(rateLimited.length).toBeGreaterThan(0);
    });
  });

  describe("Performance Benchmarks", () => {
    test("should respond within 200ms for recommendations", async () => {
      const start = Date.now();

      await request(app)
        .post("/api/recommendations")
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({
          answers: { vehicleType: "PKW" },
          partnerId: testUser.id,
        })
        .expect(200);

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(200);
    });

    test("should handle concurrent requests efficiently", async () => {
      const concurrentRequests = 50;
      const start = Date.now();

      const promises = Array(concurrentRequests)
        .fill()
        .map(() =>
          request(app)
            .post("/api/recommendations")
            .set("Authorization", `Bearer ${testUser.token}`)
            .send({
              answers: { vehicleType: "PKW" },
              partnerId: testUser.id,
            })
        );

      const results = await Promise.all(promises);
      const duration = Date.now() - start;

      // All requests should succeed
      results.forEach((result) => {
        expect(result.status).toBe(200);
      });

      // Average response time should be reasonable
      const avgResponseTime = duration / concurrentRequests;
      expect(avgResponseTime).toBeLessThan(500);
    });
  });
});
```

### **Frontend Team - User Acceptance Testing**

**Daily Tasks:**

- **Tag 1**: Cross-browser Testing (Chrome, Firefox, Safari, Edge)
- **Tag 2**: Mobile Responsiveness Testing
- **Tag 3**: Widget Integration Testing
- **Tag 4**: Performance Optimization
- **Tag 5**: User Experience Testing

**Code Example - E2E Tests:**

```javascript
// cypress/integration/widget.spec.js
describe("AutoCare Widget Integration", () => {
  beforeEach(() => {
    cy.visit("/test-site");
    cy.window().then((win) => {
      // Mock partner configuration
      win.AutoCareConfig = {
        partnerId: "test-partner-123",
        theme: "default",
        language: "de",
      };
    });
  });

  it("should load widget on test site", () => {
    cy.get("#autocare-widget").should("be.visible");
    cy.get(".questionnaire-start").should("contain", "Produktberatung starten");
  });

  it("should complete full questionnaire flow", () => {
    // Start questionnaire
    cy.get(".questionnaire-start").click();

    // Answer questions
    cy.get('[data-cy="question-1"]').within(() => {
      cy.get('input[value="PKW"]').check();
      cy.get(".next-button").click();
    });

    cy.get('[data-cy="question-2"]').within(() => {
      cy.get('input[value="metallic"]').check();
      cy.get(".next-button").click();
    });

    cy.get('[data-cy="question-3"]').within(() => {
      cy.get("select").select("beginner");
      cy.get(".next-button").click();
    });

    // Continue through all questions...

    // Verify recommendations appear
    cy.get(".recommendations-container").should("be.visible");
    cy.get(".product-card").should("have.length.at.least", 3);

    // Test product click tracking
    cy.get(".product-card")
      .first()
      .within(() => {
        cy.get(".product-link").click();
      });

    // Verify analytics tracking
    cy.window().its("dataLayer").should("not.be.empty");
  });

  it("should be responsive on mobile devices", () => {
    cy.viewport("iphone-x");

    cy.get("#autocare-widget").should("be.visible");
    cy.get(".questionnaire-container").should("have.css", "max-width");

    // Test touch interactions
    cy.get(".questionnaire-start").click();
    cy.get('[data-cy="question-1"] input[value="PKW"]').check();

    // Verify mobile-optimized layout
    cy.get(".question-step").should("have.css", "flex-direction", "column");
  });

  it("should handle slow network conditions", () => {
    // Simulate slow 3G
    cy.intercept("POST", "/api/recommendations", (req) => {
      req.reply((res) => {
        res.delay(2000); // 2 second delay
        res.send({ fixture: "recommendations.json" });
      });
    });

    cy.get(".questionnaire-start").click();
    // Complete questionnaire...

    // Verify loading state
    cy.get(".loading-spinner").should("be.visible");
    cy.get(".recommendations-container").should("not.exist");

    // Wait for results
    cy.get(".recommendations-container", { timeout: 5000 }).should(
      "be.visible"
    );
    cy.get(".loading-spinner").should("not.exist");
  });
});
```

---

# PHASE 2: SCALING & OPTIMIZATION (Wochen 5-8)

## **Team Allocation**

- **CTO**: Technical Strategy & Architecture Reviews
- **Backend Dev 1**: Advanced Features & Optimization
- **Backend Dev 2**: ML Integration & Analytics Enhancement
- **Frontend Dev 1**: Advanced Dashboard Features
- **Frontend Dev 2**: Widget Optimization & A/B Testing
- **DevOps**: Scaling Infrastructure & Performance
- **Data Scientist**: ML Model Optimization & Personalization

---

## **WOCHE 5: ADVANCED FEATURES DEVELOPMENT**

### **Backend Dev 1 - Advanced Subscription Features**

**Daily Tasks:**

- **Tag 1**: Multi-tier Usage Analytics
- **Tag 2**: Advanced Billing Features (Credits, Overages)
- **Tag 3**: Enterprise API Features
- **Tag 4**: Webhook System for Partner Integration
- **Tag 5**: Advanced Security Features (2FA, SSO)

**Code Example - Enterprise API Features:**

```javascript
// Enterprise API with Custom Analytics
class EnterpriseController {
  async getCustomAnalytics(req, res) {
    try {
      const { partnerId } = req.user;
      const { metrics, dateRange, granularity } = req.body;

      // Verify enterprise tier
      if (req.user.tierLevel !== "enterprise") {
        return res.status(403).json({
          error: "Enterprise features require enterprise subscription",
        });
      }

      const analytics = await AnalyticsService.getCustomMetrics({
        partnerId,
        metrics,
        dateRange,
        granularity,
      });

      res.json({ success: true, analytics });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createCustomDashboard(req, res) {
    try {
      const { partnerId } = req.user;
      const { name, widgets, layout } = req.body;

      const dashboard = await DashboardService.createCustom({
        partnerId,
        name,
        widgets,
        layout,
      });

      res.json({ success: true, dashboard });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async setupWebhook(req, res) {
    try {
      const { partnerId } = req.user;
      const { url, events, secret } = req.body;

      // Validate webhook URL
      const validation = await WebhookService.validateEndpoint(url);
      if (!validation.valid) {
        return res.status(400).json({
          error: "Webhook endpoint validation failed",
        });
      }

      const webhook = await WebhookService.create({
        partnerId,
        url,
        events,
        secret,
      });

      res.json({ success: true, webhook });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// Webhook Service
class WebhookService {
  static async trigger(event, data) {
    const webhooks = await this.getActiveWebhooks(data.partnerId, event);

    const promises = webhooks.map((webhook) =>
      this.sendWebhook(webhook, event, data)
    );

    await Promise.allSettled(promises);
  }

  static async sendWebhook(webhook, event, data) {
    try {
      const payload = {
        event,
        timestamp: new Date().toISOString(),
        data,
      };

      const signature = this.generateSignature(payload, webhook.secret);

      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AutoCare-Signature": signature,
          "X-AutoCare-Event": event,
          "User-Agent": "AutoCare-Webhook/1.0",
        },
        body: JSON.stringify(payload),
        timeout: 10000,
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      await WebhookLog.create({
        webhookId: webhook.id,
        event,
        status: "success",
        responseStatus: response.status,
      });
    } catch (error) {
      await WebhookLog.create({
        webhookId: webhook.id,
        event,
        status: "failed",
        error: error.message,
      });

      // Implement retry logic for failed webhooks
      await this.scheduleRetry(webhook, event, data);
    }
  }
}
```

### **Backend Dev 2 - ML Integration & Advanced Analytics**

**Daily Tasks:**

- **Tag 1**: Real-time ML Model Integration
- **Tag 2**: Advanced Analytics Pipeline
- **Tag 3**: Personalization Engine
- **Tag 4**: Predictive Analytics Features
- **Tag 5**: A/B Testing Backend Infrastructure

**Code Example - Real-time ML Integration:**

```javascript
// ML Service Integration
class MLRecommendationService {
  constructor() {
    this.pythonAPI = new PythonMLAPI();
    this.fallbackAlgorithm = new RuleBasedAlgorithm();
    this.cache = new Redis();
  }

  async getRecommendations(answers, products, partnerId, options = {}) {
    const cacheKey = this.generateCacheKey(answers, partnerId);

    try {
      // Check cache first
      const cached = await this.cache.get(cacheKey);
      if (cached && !options.bypassCache) {
        return JSON.parse(cached);
      }

      // Try ML model first
      const mlRecommendations = await this.pythonAPI.predict({
        answers,
        products,
        partnerId,
        context: options.context,
      });

      if (mlRecommendations.success) {
        const enriched = await this.enrichRecommendations(
          mlRecommendations.data,
          answers,
          partnerId
        );

        // Cache results for 1 hour
        await this.cache.setex(cacheKey, 3600, JSON.stringify(enriched));

        return enriched;
      }

      throw new Error("ML model unavailable");
    } catch (error) {
      console.warn(
        "ML model failed, falling back to rule-based:",
        error.message
      );

      // Fallback to rule-based algorithm
      const fallbackRecommendations = await this.fallbackAlgorithm.recommend(
        answers,
        products,
        partnerId
      );

      return this.enrichRecommendations(
        fallbackRecommendations,
        answers,
        partnerId
      );
    }
  }

  async enrichRecommendations(recommendations, answers, partnerId) {
    // Add explanation for each recommendation
    const enriched = await Promise.all(
      recommendations.map(async (rec) => {
        const explanation = await this.generateExplanation(rec, answers);
        const confidence = await this.calculateConfidence(rec, answers);

        return {
          ...rec,
          explanation,
          confidence,
          reasoning: this.generateReasoning(rec, answers),
        };
      })
    );

    // Apply tier-based boosting
    return this.applyTierBoosting(enriched, partnerId);
  }

  async generateExplanation(recommendation, answers) {
    const reasons = [];

    if (this.isVehicleMatch(recommendation, answers)) {
      reasons.push(`Perfekt für ${answers.vehicleType}`);
    }

    if (this.isPaintTypeMatch(recommendation, answers)) {
      reasons.push(`Speziell für ${answers.paintType} Lack`);
    }

    if (this.isExperienceMatch(recommendation, answers)) {
      reasons.push(`Ideal für ${answers.experience} Anwender`);
    }

    if (this.isBudgetMatch(recommendation, answers)) {
      reasons.push("Passt zu Ihrem Budget");
    }

    return reasons.join(" • ");
  }
}

// Python ML API Client
class PythonMLAPI {
  constructor() {
    this.baseURL = process.env.ML_API_URL || "http://ml-service:8000";
    this.timeout = 5000;
  }

  async predict(data) {
    try {
      const response = await fetch(`${this.baseURL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ML_API_TOKEN}`,
        },
        body: JSON.stringify(data),
        timeout: this.timeout,
      });

      if (!response.ok) {
        throw new Error(`ML API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`ML API request failed: ${error.message}`);
    }
  }

  async trainModel(trainingData) {
    const response = await fetch(`${this.baseURL}/train`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ML_API_TOKEN}`,
      },
      body: JSON.stringify(trainingData),
    });

    return await response.json();
  }

  async getModelMetrics() {
    const response = await fetch(`${this.baseURL}/metrics`, {
      headers: {
        Authorization: `Bearer ${process.env.ML_API_TOKEN}`,
      },
    });

    return await response.json();
  }
}
```

### **Frontend Dev 1 - Advanced Dashboard Features**

**Daily Tasks:**

- **Tag 1**: Real-time Analytics Dashboard
- **Tag 2**: Custom Report Builder
- **Tag 3**: Advanced Filtering & Search
- **Tag 4**: Data Export Features
- **Tag 5**: Mobile Dashboard Optimization

**Code Example - Real-time Analytics Dashboard:**

```jsx
// Real-time Analytics Dashboard
const RealTimeAnalytics = () => {
  const [realTimeData, setRealTimeData] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const token = localStorage.getItem("authToken");
      wsRef.current = new WebSocket(
        `ws://localhost:8080/analytics?token=${token}`
      );

      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setRealTimeData((prev) => ({
          ...prev,
          [data.metric]: data.value,
          lastUpdate: new Date(),
        }));
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        // Reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="real-time-analytics">
      <div className="connection-status">
        <div
          className={`status-indicator ${
            isConnected ? "connected" : "disconnected"
          }`}
        >
          {isConnected ? "🟢 Live" : "🔴 Disconnected"}
        </div>
        {realTimeData.lastUpdate && (
          <span className="last-update">
            Last update: {format(realTimeData.lastUpdate, "HH:mm:ss")}
          </span>
        )}
      </div>

      <div className="real-time-metrics">
        <MetricCard
          title="Active Sessions"
          value={realTimeData.activeSessions || 0}
          trend={realTimeData.sessionsTrend}
          icon="👥"
        />

        <MetricCard
          title="Recommendations/Min"
          value={realTimeData.recommendationsPerMinute || 0}
          trend={realTimeData.recommendationsTrend}
          icon="🎯"
        />

        <MetricCard
          title="Clicks/Min"
          value={realTimeData.clicksPerMinute || 0}
          trend={realTimeData.clicksTrend}
          icon="👆"
        />

        <MetricCard
          title="Revenue Today"
          value={`€${realTimeData.revenueToday || 0}`}
          trend={realTimeData.revenueTrend}
          icon="💰"
        />
      </div>

      <div className="real-time-charts">
        <div className="chart-container">
          <h3>Live Activity</h3>
          <LiveActivityChart data={realTimeData.activityData} />
        </div>

        <div className="chart-container">
          <h3>Conversion Funnel</h3>
          <LiveFunnelChart data={realTimeData.funnelData} />
        </div>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <ActivityFeed data={realTimeData.recentActivity} />
      </div>
    </div>
  );
};

// Custom Report Builder
const ReportBuilder = () => {
  const [reportConfig, setReportConfig] = useState({
    metrics: [],
    dimensions: [],
    filters: [],
    dateRange: { start: subDays(new Date(), 30), end: new Date() },
    visualization: "table",
  });

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const availableMetrics = [
    { id: "impressions", name: "Impressions", type: "number" },
    { id: "completions", name: "Completions", type: "number" },
    { id: "clicks", name: "Clicks", type: "number" },
    { id: "conversion_rate", name: "Conversion Rate", type: "percentage" },
    { id: "revenue", name: "Revenue", type: "currency" },
  ];

  const availableDimensions = [
    { id: "date", name: "Date" },
    { id: "product_category", name: "Product Category" },
    { id: "user_segment", name: "User Segment" },
    { id: "device_type", name: "Device Type" },
  ];

  const generateReport = async () => {
    setLoading(true);

    try {
      const response = await analyticsApi.generateCustomReport(reportConfig);
      setReportData(response.data);
    } catch (error) {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (format) => {
    try {
      const blob = await analyticsApi.exportReport(reportConfig, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${format}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    }
  };

  return (
    <div className="report-builder">
      <div className="builder-sidebar">
        <div className="section">
          <h4>Metrics</h4>
          <MetricSelector
            metrics={availableMetrics}
            selected={reportConfig.metrics}
            onChange={(metrics) =>
              setReportConfig((prev) => ({ ...prev, metrics }))
            }
          />
        </div>

        <div className="section">
          <h4>Dimensions</h4>
          <DimensionSelector
            dimensions={availableDimensions}
            selected={reportConfig.dimensions}
            onChange={(dimensions) =>
              setReportConfig((prev) => ({ ...prev, dimensions }))
            }
          />
        </div>

        <div className="section">
          <h4>Filters</h4>
          <FilterBuilder
            filters={reportConfig.filters}
            onChange={(filters) =>
              setReportConfig((prev) => ({ ...prev, filters }))
            }
          />
        </div>

        <div className="section">
          <h4>Date Range</h4>
          <DateRangePicker
            value={reportConfig.dateRange}
            onChange={(dateRange) =>
              setReportConfig((prev) => ({ ...prev, dateRange }))
            }
          />
        </div>

        <div className="section">
          <h4>Visualization</h4>
          <VisualizationSelector
            value={reportConfig.visualization}
            onChange={(visualization) =>
              setReportConfig((prev) => ({ ...prev, visualization }))
            }
          />
        </div>

        <div className="actions">
          <Button
            onClick={generateReport}
            loading={loading}
            disabled={reportConfig.metrics.length === 0}
          >
            Generate Report
          </Button>
        </div>
      </div>

      <div className="report-content">
        {reportData && (
          <>
            <div className="report-header">
              <h2>Custom Report</h2>
              <div className="export-options">
                <Button variant="outline" onClick={() => exportReport("csv")}>
                  Export CSV
                </Button>
                <Button variant="outline" onClick={() => exportReport("xlsx")}>
                  Export Excel
                </Button>
                <Button variant="outline" onClick={() => exportReport("pdf")}>
                  Export PDF
                </Button>
              </div>
            </div>

            <div className="report-visualization">
              <ReportVisualization data={reportData} config={reportConfig} />
            </div>
          </>
        )}

        {!reportData && (
          <div className="empty-state">
            <h3>Build Your Custom Report</h3>
            <p>
              Select metrics and dimensions from the sidebar to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
```

### **Frontend Dev 2 - Widget Advanced Features**

**Daily Tasks:**

- **Tag 1**: Widget Customization Interface
- **Tag 2**: Advanced A/B Testing Framework
- **Tag 3**: Widget Performance Optimization
- **Tag 4**: Multi-language Support
- **Tag 5**: Widget Analytics Enhancement

**Code Example - Widget Customization Interface:**

```jsx
// Widget Customization Interface
const WidgetCustomizer = () => {
  const [config, setConfig] = useState({
    theme: "default",
    colors: {
      primary: "#007bff",
      secondary: "#6c757d",
      success: "#28a745",
      background: "#ffffff",
      text: "#333333",
    },
    typography: {
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      fontWeight: "400",
    },
    layout: {
      style: "card",
      width: "100%",
      maxWidth: "600px",
      padding: "20px",
      borderRadius: "8px",
    },
    content: {
      title: "Finden Sie das perfekte Pflegeprodukt",
      subtitle: "Beantworten Sie 6 kurze Fragen",
      buttonText: "Beratung starten",
      thankYouMessage: "Vielen Dank! Hier sind Ihre Empfehlungen:",
    },
    features: {
      progressBar: true,
      questionNumbers: true,
      backButton: true,
      skipOption: false,
      socialShare: false,
    },
  });

  const [previewMode, setPreviewMode] = useState("desktop");
  const [livePreview, setLivePreview] = useState(true);

  const updateConfig = (path, value) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      const keys = path.split(".");
      let current = newConfig;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const generateEmbedCode = () => {
    return `
<!-- AutoCare Advisor Widget -->
<script>
  window.AutoCareConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="https://widget.autocare-advisor.com/embed.js" async></script>
<div id="autocare-widget"></div>
<!-- End AutoCare Advisor Widget -->
    `.trim();
  };

  const saveConfiguration = async () => {
    try {
      await widgetApi.saveConfiguration(config);
      toast.success("Widget configuration saved successfully");
    } catch (error) {
      toast.error("Failed to save configuration");
    }
  };

  return (
    <div className="widget-customizer">
      <div className="customizer-sidebar">
        <div className="section">
          <h4>Theme & Colors</h4>
          <div className="form-group">
            <label>Theme</label>
            <Select
              value={config.theme}
              onChange={(value) => updateConfig("theme", value)}
              options={[
                { value: "default", label: "Default" },
                { value: "minimal", label: "Minimal" },
                { value: "modern", label: "Modern" },
                { value: "automotive", label: "Automotive" },
              ]}
            />
          </div>

          <div className="color-grid">
            <ColorPicker
              label="Primary Color"
              value={config.colors.primary}
              onChange={(color) => updateConfig("colors.primary", color)}
            />
            <ColorPicker
              label="Background"
              value={config.colors.background}
              onChange={(color) => updateConfig("colors.background", color)}
            />
            <ColorPicker
              label="Text Color"
              value={config.colors.text}
              onChange={(color) => updateConfig("colors.text", color)}
            />
          </div>
        </div>

        <div className="section">
          <h4>Typography</h4>
          <div className="form-group">
            <label>Font Family</label>
            <Select
              value={config.typography.fontFamily}
              onChange={(value) => updateConfig("typography.fontFamily", value)}
              options={[
                { value: "Inter, sans-serif", label: "Inter" },
                { value: "Roboto, sans-serif", label: "Roboto" },
                { value: "Open Sans, sans-serif", label: "Open Sans" },
                { value: "Arial, sans-serif", label: "Arial" },
              ]}
            />
          </div>

          <div className="form-group">
            <label>Font Size</label>
            <input
              type="range"
              min="12"
              max="18"
              value={parseInt(config.typography.fontSize)}
              onChange={(e) =>
                updateConfig("typography.fontSize", `${e.target.value}px`)
              }
            />
            <span>{config.typography.fontSize}</span>
          </div>
        </div>

        <div className="section">
          <h4>Layout</h4>
          <div className="form-group">
            <label>Style</label>
            <RadioGroup
              value={config.layout.style}
              onChange={(value) => updateConfig("layout.style", value)}
              options={[
                { value: "card", label: "Card" },
                { value: "inline", label: "Inline" },
                { value: "modal", label: "Modal" },
              ]}
            />
          </div>

          <div className="form-group">
            <label>Max Width</label>
            <input
              type="text"
              value={config.layout.maxWidth}
              onChange={(e) => updateConfig("layout.maxWidth", e.target.value)}
              placeholder="600px"
            />
          </div>
        </div>

        <div className="section">
          <h4>Content</h4>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={config.content.title}
              onChange={(e) => updateConfig("content.title", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              value={config.content.subtitle}
              onChange={(e) => updateConfig("content.subtitle", e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Button Text</label>
            <input
              type="text"
              value={config.content.buttonText}
              onChange={(e) =>
                updateConfig("content.buttonText", e.target.value)
              }
            />
          </div>
        </div>

        <div className="section">
          <h4>Features</h4>
          <div className="feature-toggles">
            <Toggle
              label="Progress Bar"
              checked={config.features.progressBar}
              onChange={(checked) =>
                updateConfig("features.progressBar", checked)
              }
            />
            <Toggle
              label="Question Numbers"
              checked={config.features.questionNumbers}
              onChange={(checked) =>
                updateConfig("features.questionNumbers", checked)
              }
            />
            <Toggle
              label="Back Button"
              checked={config.features.backButton}
              onChange={(checked) =>
                updateConfig("features.backButton", checked)
              }
            />
            <Toggle
              label="Skip Option"
              checked={config.features.skipOption}
              onChange={(checked) =>
                updateConfig("features.skipOption", checked)
              }
            />
          </div>
        </div>

        <div className="actions">
          <Button onClick={saveConfiguration} variant="primary">
            Save Configuration
          </Button>
        </div>
      </div>

      <div className="preview-area">
        <div className="preview-header">
          <h3>Live Preview</h3>
          <div className="preview-controls">
            <div className="device-selector">
              <button
                className={previewMode === "desktop" ? "active" : ""}
                onClick={() => setPreviewMode("desktop")}
              >
                🖥️ Desktop
              </button>
              <button
                className={previewMode === "tablet" ? "active" : ""}
                onClick={() => setPreviewMode("tablet")}
              >
                📱 Tablet
              </button>
              <button
                className={previewMode === "mobile" ? "active" : ""}
                onClick={() => setPreviewMode("mobile")}
              >
                📱 Mobile
              </button>
            </div>

            <Toggle
              label="Live Preview"
              checked={livePreview}
              onChange={setLivePreview}
            />
          </div>
        </div>

        <div className={`preview-container ${previewMode}`}>
          {livePreview ? (
            <WidgetPreview config={config} />
          ) : (
            <div className="preview-placeholder">Live preview disabled</div>
          )}
        </div>

        <div className="embed-code-section">
          <h4>Embed Code</h4>
          <CodeBlock code={generateEmbedCode()} language="html" copyable />
        </div>
      </div>
    </div>
  );
};

// Widget A/B Testing Framework
const ABTestManager = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTests = async () => {
      try {
        const response = await abTestApi.getActiveTests();
        setTests(response.data);
      } catch (error) {
        console.error("Failed to load A/B tests:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  const createTest = async (testConfig) => {
    try {
      const response = await abTestApi.createTest(testConfig);
      setTests((prev) => [...prev, response.data]);
      toast.success("A/B test created successfully");
    } catch (error) {
      toast.error("Failed to create A/B test");
    }
  };

  const pauseTest = async (testId) => {
    try {
      await abTestApi.pauseTest(testId);
      setTests((prev) =>
        prev.map((test) =>
          test.id === testId ? { ...test, status: "paused" } : test
        )
      );
      toast.success("A/B test paused");
    } catch (error) {
      toast.error("Failed to pause A/B test");
    }
  };

  const declareWinner = async (testId, winningVariant) => {
    try {
      await abTestApi.declareWinner(testId, winningVariant);
      setTests((prev) =>
        prev.map((test) =>
          test.id === testId
            ? { ...test, status: "completed", winner: winningVariant }
            : test
        )
      );
      toast.success(`Variant ${winningVariant} declared winner`);
    } catch (error) {
      toast.error("Failed to declare winner");
    }
  };

  if (loading) {
    return <div className="loading">Loading A/B tests...</div>;
  }

  return (
    <div className="ab-test-manager">
      <div className="tests-list">
        <div className="list-header">
          <h2>A/B Tests</h2>
          <Button onClick={() => setSelectedTest("new")}>
            Create New Test
          </Button>
        </div>

        <div className="tests-grid">
          {tests.map((test) => (
            <div key={test.id} className="test-card">
              <div className="test-header">
                <h3>{test.name}</h3>
                <span className={`status ${test.status}`}>{test.status}</span>
              </div>

              <div className="test-stats">
                <div className="stat">
                  <span className="label">Traffic Split</span>
                  <span className="value">{test.trafficSplit}%</span>
                </div>
                <div className="stat">
                  <span className="label">Participants</span>
                  <span className="value">{test.participants}</span>
                </div>
                <div className="stat">
                  <span className="label">Conversion Rate</span>
                  <span className="value">{test.conversionRate}%</span>
                </div>
              </div>

              <div className="variants">
                {test.variants.map((variant) => (
                  <div key={variant.id} className="variant">
                    <span className="variant-name">{variant.name}</span>
                    <span className="conversion-rate">
                      {variant.conversionRate}%
                    </span>
                    {test.winner === variant.id && (
                      <span className="winner-badge">Winner</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="test-actions">
                <Button variant="outline" onClick={() => setSelectedTest(test)}>
                  View Details
                </Button>

                {test.status === "running" && (
                  <Button variant="outline" onClick={() => pauseTest(test.id)}>
                    Pause
                  </Button>
                )}

                {test.status === "running" && test.participants > 100 && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      const bestVariant = test.variants.reduce(
                        (best, current) =>
                          current.conversionRate > best.conversionRate
                            ? current
                            : best
                      );
                      declareWinner(test.id, bestVariant.id);
                    }}
                  >
                    Declare Winner
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTest === "new" && (
        <CreateTestModal
          onClose={() => setSelectedTest(null)}
          onCreate={createTest}
        />
      )}

      {selectedTest && selectedTest !== "new" && (
        <TestDetailsModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
        />
      )}
    </div>
  );
};
```

---

## **WOCHE 6: PERFORMANCE & SCALING**

### **DevOps Engineer - Infrastructure Scaling**

**Daily Tasks:**

- **Tag 1**: Auto-scaling Configuration
- **Tag 2**: Database Performance Optimization
- **Tag 3**: CDN & Caching Strategy Implementation
- **Tag 4**: Monitoring & Alerting Enhancement
- **Tag 5**: Security Hardening & Compliance

**Code Example - Auto-scaling Configuration:**

```yaml
# terraform/auto-scaling.tf
resource "aws_autoscaling_group" "autocare_api" {
  name                = "autocare-api-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.api.arn]
  health_check_type   = "ELB"
  health_check_grace_period = 300

  min_size         = 2
  max_size         = 20
  desired_capacity = 3

  launch_template {
    id      = aws_launch_template.api.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "autocare-api"
    propagate_at_launch = true
  }

  # Scaling policies
  enabled_metrics = [
    "GroupMinSize",
    "GroupMaxSize",
    "GroupDesiredCapacity",
    "GroupInServiceInstances",
    "GroupTotalInstances"
  ]
}

# Scale up policy
resource "aws_autoscaling_policy" "scale_up" {
  name                   = "autocare-scale-up"
  scaling_adjustment     = 2
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 300
  autoscaling_group_name = aws_autoscaling_group.autocare_api.name
}

# Scale down policy
resource "aws_autoscaling_policy" "scale_down" {
  name                   = "autocare-scale-down"
  scaling_adjustment     = -1
  adjustment_type        = "ChangeInCapacity"
  cooldown              = 300
  autoscaling_group_name = aws_autoscaling_group.autocare_api.name
}

# CloudWatch alarms
resource "aws_cloudwatch_metric_alarm" "cpu_high" {
  alarm_name          = "autocare-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ec2 cpu utilization"
  alarm_actions       = [aws_autoscaling_policy.scale_up.arn]

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.autocare_api.name
  }
}

resource "aws_cloudwatch_metric_alarm" "cpu_low" {
  alarm_name          = "autocare-cpu-low"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/EC2"
  period              = "120"
  statistic           = "Average"
  threshold           = "25"
  alarm_description   = "This metric monitors ec2 cpu utilization"
  alarm_actions       = [aws_autoscaling_policy.scale_down.arn]

  dimensions = {
    AutoScalingGroupName = aws_autoscaling_group.autocare_api.name
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "autocare-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = var.public_subnet_ids

  enable_deletion_protection = false

  tags = {
    Environment = var.environment
  }
}

# Redis Cluster for Caching
resource "aws_elasticache_replication_group" "redis" {
  description          = "AutoCare Redis cluster"
  replication_group_id = "autocare-redis"

  node_type            = "cache.r6g.large"
  port                 = 6379
  parameter_group_name = "default.redis7"

  num_cache_clusters   = 3
  automatic_failover_enabled = true
  multi_az_enabled     = true

  subnet_group_name = aws_elasticache_subnet_group.redis.name
  security_group_ids = [aws_security_group.redis.id]

  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  tags = {
    Name = "autocare-redis"
  }
}

# Database Performance Monitoring
resource "aws_cloudwatch_log_group" "rds_slowquery" {
  name              = "/aws/rds/instance/autocare-postgres/slowquery"
  retention_in_days = 7

  tags = {
    Environment = var.environment
    Application = "autocare"
  }
}
```

### **Data Scientist - ML Model Optimization**

**Daily Tasks:**

- **Tag 1**: Model Performance Analysis & Optimization
- **Tag 2**: Real-time Feature Engineering
- **Tag 3**: A/B Testing for ML Models
- **Tag 4**: Automated Model Retraining Pipeline
- **Tag 5**: Model Monitoring & Drift Detection

**Code Example - ML Model Optimization:**

```python
# Advanced ML Pipeline with Online Learning
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import roc_auc_score, precision_recall_curve
import joblib
import mlflow
import mlflow.sklearn
from datetime import datetime, timedelta
import asyncio
import aioredis
from typing import Dict, List, Tuple

class OnlineLearningPipeline:
    def __init__(self):
        self.model = None
        self.feature_importance = {}
        self.model_version = "1.0.0"
        self.performance_metrics = {}
        self.drift_detector = DriftDetector()

    async def initialize_model(self):
        """Initialize model with historical data"""
        # Load historical training data
        training_data = await self.load_training_data()

        # Feature engineering
        X, y = self.prepare_features(training_data)

        # Train initial model
        self.model = self.train_model(X, y)

        # Save model artifacts
        await self.save_model_artifacts()

        print(f"Model initialized with {len(training_data)} samples")

    def prepare_features(self, data: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray]:
        """Advanced feature engineering"""
        features = []
        labels = []

        for _, row in data.iterrows():
            # Extract features from questionnaire answers
            answer_features = self.extract_answer_features(row['answers'])

            # Product features
            product_features = self.extract_product_features(row['product'])

            # Compatibility features
            compatibility_features = self.calculate_compatibility_score(
                row['answers'], row['product']
            )

            # Temporal features
            temporal_features = self.extract_temporal_features(row['timestamp'])

            # Partner context features
            partner_features = self.extract_partner_features(row['partner_id'])

            # Interaction features (cross-products)
            interaction_features = self.create_interaction_features(
                answer_features, product_features
            )

            # Combine all features
            feature_vector = np.concatenate([
                answer_features,
                product_features,
                compatibility_features,
                temporal_features,
                partner_features,
                interaction_features
            ])

            features.append(feature_vector)
            labels.append(row['clicked'])

        return np.array(features), np.array(labels)

    def extract_answer_features(self, answers: Dict) -> np.ndarray:
        """Extract features from questionnaire answers"""
        features = []

        # Vehicle type (one-hot encoded)
        vehicle_types = ['PKW', 'SUV', 'Oldtimer', 'Motorrad', 'Nutzfahrzeug']
        for vtype in vehicle_types:
            features.append(1 if answers.get('vehicleType') == vtype else 0)

        # Paint type (one-hot encoded)
        paint_types = ['solid', 'metallic', 'pearl', 'matte']
        for ptype in paint_types:
            features.append(1 if answers.get('paintType') == ptype else 0)

        # Experience level (ordinal)
        experience_map = {'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4}
        features.append(experience_map.get(answers.get('experience'), 1) / 4)

        # Budget (normalized)
        budget_map = {'<25': 12.5, '25-50': 37.5, '50-100': 75, '100-200': 150, '200+': 300}
        budget_value = budget_map.get(answers.get('budget'), 50)
        features.append(budget_value / 300)

        # Time available (ordinal)
        time_map = {'<30min': 1, '30min-1h': 2, '1-2h': 3, '2h+': 4}
        features.append(time_map.get(answers.get('timeAvailable'), 2) / 4)

        # Environmental preference (binary)
        features.append(1 if answers.get('environmentallyFriendly') else 0)

        # Season (one-hot encoded)
        seasons = ['spring', 'summer', 'autumn', 'winter']
        current_season = self.get_current_season()
        for season in seasons:
            features.append(1 if current_season == season else 0)

        return np.array(features)

    def extract_product_features(self, product: Dict) -> np.ndarray:
        """Extract features from product data"""
        features = []

        # Price (normalized by category average)
        category_avg_price = self.get_category_average_price(product['category'])
        features.append(product['price'] / max(category_avg_price, 1))

        # Rating (normalized)
        features.append(product.get('rating', 0) / 5)

        # Number of reviews (log-normalized)
        review_count = product.get('reviewCount', 0)
        features.append(np.log1p(review_count) / 10)

        # Category (one-hot encoded)
        categories = ['shampoo', 'wax', 'polish', 'cleaner', 'protection', 'tools']
        for category in categories:
            features.append(1 if product['category'] == category else 0)

        # Brand popularity (normalized)
        brand_popularity = self.get_brand_popularity(product.get('brand', ''))
        features.append(brand_popularity / 100)

        # Product age (days since launch, log-normalized)
        days_since_launch = (datetime.now() - product['launchDate']).days
        features.append(np.log1p(days_since_launch) / 10)

        # Inventory status
        features.append(1 if product.get('inStock', True) else 0)

        return np.array(features)

    def calculate_compatibility_score(self, answers: Dict, product: Dict) -> np.ndarray:
        """Calculate compatibility between user needs and product"""
        features = []

        compatibility = product.get('compatibility', {})

        # Vehicle type compatibility
        user_vehicle = answers.get('vehicleType', '')
        compatible_vehicles = compatibility.get('vehicleTypes', [])
        features.append(1 if user_vehicle in compatible_vehicles else 0)

        # Paint type compatibility
        user_paint = answers.get('paintType', '')
        compatible_paints = compatibility.get('paintTypes', [])
        features.append(1 if user_paint in compatible_paints else 0)

        # Experience level compatibility
        user_experience = answers.get('experience', 'beginner')
        product_difficulty = product.get('difficultyLevel', 'beginner')
        experience_scores = {'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4}
        compatibility_score = 1 - abs(
            experience_scores[user_experience] - experience_scores[product_difficulty]
        ) / 3
        features.append(max(0, compatibility_score))

        # Application method compatibility
        preferred_method = answers.get('applicationMethod', 'hand')
        product_methods = product.get('applicationMethods', ['hand'])
        features.append(1 if preferred_method in product_methods else 0)

        return np.array(features)

    def extract_temporal_features(self, timestamp: datetime) -> np.ndarray:
        """Extract time-based features"""
        features = []

        # Hour of day (cyclical encoding)
        hour = timestamp.hour
        features.append(np.sin(2 * np.pi * hour / 24))
        features.append(np.cos(2 * np.pi * hour / 24))

        # Day of week (cyclical encoding)
        day = timestamp.weekday()
        features.append(np.sin(2 * np.pi * day / 7))
        features.append(np.cos(2 * np.pi * day / 7))

        # Month (cyclical encoding)
        month = timestamp.month
        features.append(np.sin(2 * np.pi * month / 12))
        features.append(np.cos(2 * np.pi * month / 12))

        # Is weekend
        features.append(1 if day >= 5 else 0)

        return np.array(features)

    def create_interaction_features(self, answer_features: np.ndarray,
                                  product_features: np.ndarray) -> np.ndarray:
        """Create interaction features between answers and products"""
        interactions = []

        # Key interaction: budget vs price
        budget_feature = answer_features[10]  # Normalized budget
        price_feature = product_features[0]   # Normalized price
        interactions.append(budget_feature * price_feature)

        # Experience vs product complexity
        experience_feature = answer_features[9]  # Normalized experience
        # Assuming we have complexity in product features
        complexity_feature = product_features[7] if len(product_features) > 7 else 0.5
        interactions.append(experience_feature * complexity_feature)

        # Environmental preference vs eco-friendly product
        env_preference = answer_features[11]
        eco_friendly = 1 if 'eco' in str(product_features).lower() else 0
        interactions.append(env_preference * eco_friendly)

        return np.array(interactions)

    async def online_learning_update(self, new_data: List[Dict]):
        """Update model with new interaction data"""
        if len(new_data) < 10:  # Need minimum samples for update
            return

        # Prepare new features
        df = pd.DataFrame(new_data)
        X_new, y_new = self.prepare_features(df)

        # Detect drift
        drift_detected = await self.drift_detector.detect_drift(X_new)

        if drift_detected:
            print("Concept drift detected, triggering full retrain")
            await self.full_retrain()
        else:
            # Partial fit for compatible models
            if hasattr(self.model, 'partial_fit'):
                self.model.partial_fit(X_new, y_new)
            else:
                # For models without partial_fit, use incremental learning
                await self.incremental_update(X_new, y_new)

        # Update performance metrics
        await self.update_performance_metrics(X_new, y_new)

        # Save updated model
        await self.save_model_artifacts()

    async def incremental_update(self, X_new: np.ndarray, y_new: np.ndarray):
        """Incremental learning for models without partial_fit"""
        # Load recent historical data
        historical_data = await self.load_recent_training_data(days=30)
        X_hist, y_hist = self.prepare_features(historical_data)

        # Combine with new data
        X_combined = np.vstack([X_hist, X_new])
        y_combined = np.hstack([y_hist, y_new])

        # Retrain with combined data
        self.model = self.train_model(X_combined, y_combined)

    def train_model(self, X: np.ndarray, y: np.ndarray):
        """Train the recommendation model"""
        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # Initialize model with optimized hyperparameters
        model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=10,
            min_samples_leaf=5,
            max_features='sqrt',
            random_state=42,
            n_jobs=-1,
            class_weight='balanced'
        )

        # Train model
        model.fit(X_train, y_train)

        # Validate performance
        y_pred_proba = model.predict_proba(X_val)[:, 1]
        auc_score = roc_auc_score(y_val, y_pred_proba)

        print(f"Model AUC: {auc_score:.4f}")

        # Log with MLflow
        with mlflow.start_run():
            mlflow.log_param("n_estimators", 200)
            mlflow.log_param("max_depth", 15)
            mlflow.log_metric("auc", auc_score)
            mlflow.sklearn.log_model(model, "model")

        return model

    async def predict_batch(self, features_batch: List[np.ndarray]) -> List[float]:
        """Batch prediction for multiple feature vectors"""
        if not self.model:
            raise ValueError("Model not initialized")

        # Stack features
        X = np.vstack(features_batch)

        # Predict probabilities
        probabilities = self.model.predict_proba(X)[:, 1]

        return probabilities.tolist()

    async def get_feature_importance(self) -> Dict[str, float]:
        """Get current model feature importance"""
        if not self.model:
            return {}

        feature_names = self.get_feature_names()
        importance_scores = self.model.feature_importances_

        importance_dict = dict(zip(feature_names, importance_scores))

        # Sort by importance
        sorted_importance = dict(sorted(
            importance_dict.items(),
            key=lambda x: x[1],
            reverse=True
        ))

        return sorted_importance

class DriftDetector:
    def __init__(self):
        self.reference_distribution = None
        self.drift_threshold = 0.05

    async def detect_drift(self, new_features: np.ndarray) -> bool:
        """Detect concept drift using statistical tests"""
        if self.reference_distribution is None:
            self.reference_distribution = new_features
            return False

        # Use Kolmogorov-Smirnov test for drift detection
        from scipy import stats

        drift_detected = False

        for i in range(new_features.shape[1]):
            ks_statistic, p_value = stats.ks_2samp(
                self.reference_distribution[:, i],
                new_features[:, i]
            )

            if p_value < self.drift_threshold:
                print(f"Drift detected in feature {i}: p-value = {p_value}")
                drift_detected = True
                break

        return drift_detected

# Automated Model Training Pipeline
class ModelTrainingPipeline:
    def __init__(self):
        self.redis = None
        self.db = None

    async def initialize(self):
        self.redis = await aioredis.from_url("redis://localhost")
        # Initialize DB connection

    async def daily_retrain_job(self):
        """Daily automated retraining job"""
        try:
            # Get yesterday's interaction data
            yesterday = datetime.now() - timedelta(days=1)
            training_data = await self.fetch_training_data(yesterday)

            if len(training_data) < 100:
                print("Insufficient data for retraining")
                return

            # Initialize pipeline
            pipeline = OnlineLearningPipeline()
            await pipeline.initialize_model()

            # Update with new data
            await pipeline.online_learning_update(training_data)

            # Evaluate model performance
            performance = await self.evaluate_model_performance(pipeline)

            # Deploy if performance is good
            if performance['auc'] > 0.75:
                await self.deploy_model(pipeline)
                print(f"Model deployed with AUC: {performance['auc']}")
            else:
                print(f"Model performance too low: {performance['auc']}")

        except Exception as e:
            print(f"Daily retrain job failed: {e}")
            # Send alert to team
            await self.send_alert(f"Model training failed: {e}")

    async def evaluate_model_performance(self, pipeline) -> Dict:
        """Evaluate model on recent data"""
        # Get test data from last week
        test_data = await self.fetch_test_data()

        if len(test_data) == 0:
            return {'auc': 0.0}

        X_test, y_test = pipeline.prepare_features(pd.DataFrame(test_data))
        y_pred_proba = await pipeline.predict_batch([x for x in X_test])

        auc = roc_auc_score(y_test, y_pred_proba)

        return {
            'auc': auc,
            'samples': len(test_data),
            'positive_rate': np.mean(y_test)
        }

    async def deploy_model(self, pipeline):
        """Deploy model to production"""
        # Save model artifacts
        model_path = f"models/autocare_model_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pkl"
        joblib.dump(pipeline.model, model_path)

        # Update model version in Redis
        await self.redis.set("current_model_path", model_path)
        await self.redis.set("model_deployed_at", datetime.now().isoformat())

        print(f"Model deployed to {model_path}")

# Usage in production
async def main():
    # Initialize training pipeline
    training_pipeline = ModelTrainingPipeline()
    await training_pipeline.initialize()

    # Schedule daily retraining
    import schedule
    schedule.every().day.at("02:00").do(training_pipeline.daily_retrain_job)

    # Initialize online learning pipeline
    online_pipeline = OnlineLearningPipeline()
    await online_pipeline.initialize_model()

    # Start serving predictions
    print("ML Pipeline ready for production")

if __name__ == "__main__":
    asyncio.run(main())
```

---

## **WOCHE 7: INTEGRATION & TESTING**

### **Full Stack Team - Integration Testing**

**Daily Tasks für alle Devs:**

- **Tag 1**: End-to-End Integration Testing
- **Tag 2**: Performance Load Testing
- **Tag 3**: Security Penetration Testing
- **Tag 4**: User Acceptance Testing
- **Tag 5**: Bug Fixes & Optimization

### **Backend Dev 1 - API Integration & Security**

**Daily Tasks:**

- **Tag 1**: API Gateway Setup mit Rate Limiting
- **Tag 2**: CORS & Security Headers Implementation
- **Tag 3**: API Documentation (Swagger/OpenAPI)
- **Tag 4**: Authentication Middleware Testing
- **Tag 5**: Security Audit & Penetration Testing

**Code Example - API Security Middleware:**

```javascript
// Security Middleware Stack
const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),

  cors({
    origin: (origin, callback) => {
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),

  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
      // Different limits based on tier
      const userTier = req.user?.tierLevel || "basic";
      const limits = {
        basic: 100,
        professional: 500,
        enterprise: 2000,
      };
      return limits[userTier];
    },
    message: "Too many requests from this IP",
    standardHeaders: true,
    legacyHeaders: false,
  }),
];
```

### **Backend Dev 2 - Analytics & Monitoring**

**Daily Tasks:**

- **Tag 1**: ClickHouse Analytics Database Setup
- **Tag 2**: Real-time Event Tracking Implementation
- **Tag 3**: Dashboard Analytics API
- **Tag 4**: Performance Monitoring Integration
- **Tag 5**: Data Export & Reporting Features

**Code Example - Analytics Service:**

```javascript
class AnalyticsService {
  constructor() {
    this.clickhouse = new ClickHouse({
      url: process.env.CLICKHOUSE_URL,
      database: "autocare_analytics",
    });
  }

  async trackWidgetImpression(data) {
    const event = {
      event_type: "widget_impression",
      timestamp: new Date(),
      partner_id: data.partnerId,
      widget_id: data.widgetId,
      user_agent: data.userAgent,
      ip_address: this.hashIP(data.ipAddress),
      referrer: data.referrer,
      page_url: data.pageUrl,
    };

    await this.insertEvent(event);
  }

  async trackQuestionnaireStart(data) {
    const event = {
      event_type: "questionnaire_start",
      timestamp: new Date(),
      partner_id: data.partnerId,
      session_id: data.sessionId,
      questions_version: data.questionnaireVersion,
    };

    await this.insertEvent(event);
  }

  async generatePartnerReport(partnerId, dateRange) {
    const query = `
      SELECT 
        toDate(timestamp) as date,
        count(*) as total_events,
        countIf(event_type = 'widget_impression') as impressions,
        countIf(event_type = 'questionnaire_complete') as completions,
        countIf(event_type = 'product_click') as clicks,
        round(countIf(event_type = 'questionnaire_complete') / countIf(event_type = 'widget_impression') * 100, 2) as completion_rate,
        round(countIf(event_type = 'product_click') / countIf(event_type = 'questionnaire_complete') * 100, 2) as click_through_rate
      FROM analytics_events 
      WHERE partner_id = {partnerId:String}
        AND timestamp >= {startDate:DateTime}
        AND timestamp <= {endDate:DateTime}
      GROUP BY date
      ORDER BY date DESC
    `;

    return await this.clickhouse
      .query(query, {
        partnerId,
        startDate: dateRange.start,
        endDate: dateRange.end,
      })
      .toPromise();
  }
}
```

### **Frontend Dev 1 - Dashboard Analytics & Billing**

**Daily Tasks:**

- **Tag 1**: Analytics Dashboard Components
- **Tag 2**: Billing Interface & Payment Methods
- **Tag 3**: Subscription Management Interface
- **Tag 4**: Usage Monitoring Dashboard
- **Tag 5**: Reports & Data Export Features

**Code Example - Analytics Dashboard:**

```jsx
const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState({
    start: subDays(new Date(), 30),
    end: new Date(),
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ["analytics", dateRange],
    queryFn: () => analyticsApi.getPartnerAnalytics(dateRange),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const chartData = useMemo(() => {
    if (!analyticsData) return [];

    return analyticsData.map((day) => ({
      date: format(parseISO(day.date), "MMM dd"),
      impressions: day.impressions,
      completions: day.completions,
      clicks: day.clicks,
      conversionRate: day.completion_rate,
      ctr: day.click_through_rate,
    }));
  }, [analyticsData]);

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          maxDate={new Date()}
        />
      </div>

      <div className="kpi-grid">
        <KPICard
          title="Total Impressions"
          value={analytics?.totalImpressions}
          change={analytics?.impressionsChange}
          trend="up"
        />
        <KPICard
          title="Completion Rate"
          value={`${analytics?.completionRate}%`}
          change={analytics?.completionRateChange}
          trend="up"
        />
        <KPICard
          title="Click-Through Rate"
          value={`${analytics?.clickThroughRate}%`}
          change={analytics?.ctrChange}
          trend="up"
        />
        <KPICard
          title="Revenue Generated"
          value={`€${analytics?.revenue}`}
          change={analytics?.revenueChange}
          trend="up"
        />
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Performance Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="impressions"
                stroke="#8884d8"
                name="Impressions"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="completions"
                stroke="#82ca9d"
                name="Completions"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="conversionRate"
                stroke="#ffc658"
                name="Conversion Rate %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Top Performing Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics?.topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clicks" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="detailed-table">
        <AnalyticsTable data={analyticsData} />
      </div>
    </div>
  );
};
```

### **Frontend Dev 2 - Widget Performance & Testing**

**Daily Tasks:**

- **Tag 1**: Widget Performance Optimization
- **Tag 2**: Cross-browser Testing & Fixes
- **Tag 3**: Mobile Responsiveness Testing
- **Tag 4**: A/B Testing Framework Implementation
- **Tag 5**: Widget Analytics Integration

**Code Example - Widget A/B Testing:**

```jsx
const WidgetManager = () => {
  const [variant, setVariant] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    // Determine A/B test variant
    const determineVariant = () => {
      const userId = getWidgetUserId();
      const hash = hashCode(userId + "questionnaire_v1");
      return Math.abs(hash) % 2 === 0 ? "control" : "treatment";
    };

    const currentVariant = determineVariant();
    setVariant(currentVariant);

    // Track variant assignment
    analytics.track("widget_variant_assigned", {
      variant: currentVariant,
      test_name: "questionnaire_v1",
    });
  }, []);

  const WidgetComponent =
    variant === "treatment" ? QuestionnaireV2 : QuestionnaireV1;

  return (
    <div className="widget-container">
      <WidgetComponent
        onComplete={(results) => {
          analytics.track("questionnaire_completed", {
            variant,
            time_to_complete: results.timeToComplete,
            answers_count: results.answers.length,
          });
        }}
        onAbandon={(step) => {
          analytics.track("questionnaire_abandoned", {
            variant,
            abandon_step: step,
            progress_percentage: (step / totalSteps) * 100,
          });
        }}
      />
    </div>
  );
};
```

### **Data Scientist - ML Model Training & Optimization**

**Daily Tasks:**

- **Tag 1**: Data Collection Pipeline Setup
- **Tag 2**: Feature Engineering & Data Preprocessing
- **Tag 3**: Model Training & Validation
- **Tag 4**: A/B Testing for Algorithm Variants
- **Tag 5**: Performance Monitoring & Alerting

### **DevOps Engineer - Infrastructure Testing**

**Daily Tasks:**

- **Tag 1**: Load Testing Infrastructure
- **Tag 2**: Disaster Recovery Testing
- **Tag 3**: Security Penetration Testing
- **Tag 4**: Backup System Validation
- **Tag 5**: Monitoring & Alerting Final Setup

### **CTO Tasks - Quality Assurance**

**Daily Tasks:**

- **Tag 1**: Code Quality Review & Refactoring
- **Tag 2**: Security Audit Coordination
- **Tag 3**: Performance Benchmarking
- **Tag 4**: Team Coordination & Issue Resolution
- **Tag 5**: Launch Readiness Assessment

**Deliverables Woche 7:**

- ✅ Complete E2E Testing Suite
- ✅ Security Audit Passed
- ✅ Performance Benchmarks Met
- ✅ Cross-browser Compatibility Verified
- ✅ All Critical Bugs Fixed

---

## **WOCHE 8: LAUNCH PREPARATION & OPTIMIZATION**

### **DevOps Engineer - Production Readiness**

**Daily Tasks:**

- **Tag 1**: Final Production Environment Setup
- **Tag 2**: Security Hardening & Compliance Audit
- **Tag 3**: Backup & Disaster Recovery Final Testing
- **Tag 4**: Monitoring & Alerting Optimization
- **Tag 5**: Launch Day Preparation & Runbooks

**Code Example - Production Deployment Checklist:**

```bash
#!/bin/bash
# Production Deployment Checklist

echo "🚀 AutoCare Advisor Production Deployment Checklist"

# Database Migration Check
echo "Checking database migrations..."
npm run migrate:status
if [ $? -ne 0 ]; then
    echo "❌ Database migrations pending"
    exit 1
fi

# Security Scan
echo "Running security scan..."
npm audit --audit-level high
if [ $? -ne 0 ]; then
    echo "❌ Security vulnerabilities found"
    exit 1
fi

# Performance Benchmark
echo "Running performance tests..."
npm run test:performance
if [ $? -ne 0 ]; then
    echo "❌ Performance tests failed"
    exit 1
fi

# SSL Certificate Check
echo "Checking SSL certificates..."
openssl s_client -connect api.autocare-advisor.com:443 -servername api.autocare-advisor.com < /dev/null 2>/dev/null | openssl x509 -noout -dates
if [ $? -ne 0 ]; then
    echo "❌ SSL certificate issues"
    exit 1
fi

# Backup Verification
echo "Verifying backup systems..."
aws s3 ls s3://autocare-backups/$(date +%Y-%m-%d)/ > /dev/null
if [ $? -ne 0 ]; then
    echo "❌ Daily backup missing"
    exit 1
fi

# Monitoring Check
echo "Verifying monitoring systems..."
curl -f https://api.datadog.com/api/v1/check_status || {
    echo "❌ Monitoring not responding"
    exit 1
}

# Load Test
echo "Running final load test..."
artillery run load-test.yml
if [ $? -ne 0 ]; then
    echo "❌ Load test failed"
    exit 1
fi

echo "✅ All production readiness checks passed!"

# Deploy to production
echo "🚀 Deploying to production..."
terraform apply -auto-approve
kubectl apply -f k8s/production/

echo "🎉 Production deployment completed!"
```

### **Backend Team - API Documentation & Final Optimization**

**Daily Tasks:**

- **Tag 1**: Complete API Documentation (Swagger/OpenAPI)
- **Tag 2**: Performance Optimization & Caching
- **Tag 3**: Security Headers & Rate Limiting Final Setup
- **Tag 4**: Error Handling & Monitoring Enhancement
- **Tag 5**: Production Configuration & Environment Variables

**Code Example - Complete API Documentation:**

```javascript
// Swagger API Documentation
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "AutoCare Advisor API",
    version: "1.0.0",
    description: "API for intelligent automotive care product recommendations",
    contact: {
      name: "AutoCare Advisor Team",
      email: "api@autocare-advisor.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "https://api.autocare-advisor.com/v1",
      description: "Production server",
    },
    {
      url: "https://staging-api.autocare-advisor.com/v1",
      description: "Staging server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
    },
    schemas: {
      Product: {
        type: "object",
        required: ["name", "category", "price"],
        properties: {
          id: { type: "string", example: "507f1f77bcf86cd799439011" },
          name: { type: "string", example: "Premium Car Shampoo" },
          description: { type: "string" },
          category: {
            type: "string",
            enum: ["shampoo", "wax", "polish", "cleaner"],
          },
          price: { type: "number", example: 29.99 },
          images: { type: "array", items: { type: "string" } },
          compatibility: {
            type: "object",
            properties: {
              vehicleTypes: { type: "array", items: { type: "string" } },
              paintTypes: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
      Recommendation: {
        type: "object",
        properties: {
          product: { $ref: "#/components/schemas/Product" },
          score: { type: "number", minimum: 0, maximum: 100 },
          explanation: { type: "string" },
          confidence: { type: "number", minimum: 0, maximum: 1 },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" },
          code: { type: "number" },
        },
      },
    },
  },
  paths: {
    "/recommendations": {
      post: {
        summary: "Get product recommendations",
        description:
          "Generate personalized product recommendations based on user questionnaire answers",
        security: [{ apiKey: [] }],
        tags: ["Recommendations"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["answers", "partnerId"],
                properties: {
                  answers: {
                    type: "object",
                    properties: {
                      vehicleType: {
                        type: "string",
                        enum: ["PKW", "SUV", "Oldtimer", "Motorrad"],
                      },
                      paintType: {
                        type: "string",
                        enum: ["solid", "metallic", "pearl", "matte"],
                      },
                      experience: {
                        type: "string",
                        enum: ["beginner", "intermediate", "expert"],
                      },
                      budget: {
                        type: "string",
                        enum: ["<25", "25-50", "50-100", "100+"],
                      },
                    },
                  },
                  partnerId: { type: "string" },
                  limit: { type: "number", default: 6, maximum: 20 },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful recommendations",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    recommendations: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Recommendation" },
                    },
                    metadata: {
                      type: "object",
                      properties: {
                        totalScored: { type: "number" },
                        averageScore: { type: "number" },
                        processingTime: { type: "number" },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Bad request",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
          429: {
            description: "Rate limit exceeded",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
              },
            },
          },
        },
      },
    },
  },
};
```

### **Frontend Team - Production Build & Final Polish**

**Daily Tasks:**

- **Tag 1**: Production Build Optimization
- **Tag 2**: Performance Auditing & Lighthouse Optimization
- **Tag 3**: Cross-browser Final Testing
- **Tag 4**: Accessibility Audit & Fixes
- **Tag 5**: User Experience Final Polish

**Code Example - Production Build Configuration:**

```javascript
// Webpack Production Configuration
const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  mode: "production",
  entry: {
    dashboard: "./src/dashboard/index.js",
    widget: "./src/widget/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].chunk.js",
    publicPath: "https://cdn.autocare-advisor.com/",
    clean: true,
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
        common: {
          name: "common",
          minChunks: 2,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.API_URL": JSON.stringify("https://api.autocare-advisor.com"),
    }),
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "bundle-report.html",
    }),
  ],
};
```

### **Data Scientist - Final Model Validation & Deployment**

**Daily Tasks:**

- **Tag 1**: Final Model Performance Validation
- **Tag 2**: A/B Test Results Analysis
- **Tag 3**: Production Model Deployment
- **Tag 4**: Model Monitoring Setup
- **Tag 5**: Documentation & Handover

### **CTO Tasks - Launch Coordination**

**Daily Tasks:**

- **Tag 1**: Final Architecture Review
- **Tag 2**: Launch Strategy Coordination
- **Tag 3**: Risk Assessment & Mitigation
- **Tag 4**: Team Readiness Validation
- **Tag 5**: Go/No-Go Decision & Launch

**Deliverables Woche 8:**

- ✅ Production Environment Ready
- ✅ Security Compliance Verified
- ✅ Performance Benchmarks Achieved
- ✅ Documentation Complete
- ✅ Launch Plan Approved

---

## **PHASE 2 SUCCESS METRICS**

### **Technical Metrics:**

```javascript
const phase2SuccessMetrics = {
  performance: {
    apiResponseTime: "<150ms (95th percentile)",
    widgetLoadTime: "<1.5s",
    uptime: ">99.9%",
    errorRate: "<0.05%",
  },
  scalability: {
    concurrentUsers: ">500",
    requestsPerSecond: ">1000",
    autoScalingWorking: true,
    cachingEffective: ">80% hit rate",
  },
  security: {
    penetrationTestPassed: true,
    vulnerabilityScanClean: true,
    dataEncrypted: true,
    accessControlsVerified: true,
  },
};
```

### **Business Metrics:**

```javascript
const businessMetrics = {
  customerSuccess: {
    partnerOnboarding: ">10 partners",
    widgetInstallations: ">25 widgets",
    dailyRecommendations: ">500",
    customerSatisfaction: ">4.5/5",
  },
  revenue: {
    mrr: ">15000€",
    conversionImprovement: ">75% for customers",
    churnRate: "<5%",
    upsellRate: ">15%",
  },
};
```

---

# PHASE 3: POST-LAUNCH OPTIMIZATION (Wochen 9-12)

## **Team Fokus nach Launch:**

### **Woche 9-10: Monitoring & Bug Fixes**

- **DevOps**: 24/7 Monitoring Setup, Performance Tuning
- **Backend**: Hot-fixes, API Optimization, Real-time Support
- **Frontend**: UI/UX Improvements basierend auf User Feedback
- **Data Scientist**: Model Performance Monitoring & Optimization

### **Woche 11-12: Feature Enhancements**

- **Advanced Analytics Dashboard**
- **Mobile App Development Start**
- **A/B Testing Optimization**
- **International Preparation (Multi-language)**

**Erfolgsmetriken für MVP (Woche 16):**

```javascript
const mvpSuccessMetrics = {
  technical: {
    uptime: ">99.5%",
    apiResponseTime: "<200ms (95th percentile)",
    widgetLoadTime: "<2s",
    errorRate: "<0.1%",
  },
  business: {
    signedPartners: ">25",
    activeWidgets: ">50",
    dailyRecommendations: ">1000",
    customerSatisfaction: ">4.5/5",
  },
  performance: {
    conversionImprovement: ">100% for pilot customers",
    clickThroughRate: ">20%",
    questionnaireCompletion: ">75%",
  },
};
```

PHASE 3: POST-LAUNCH OPTIMIZATION & SCALING (Wochen 9-16)
Team Allocation Phase 3

CTO: Strategic Growth Planning & Advanced Architecture
Backend Dev 1: Enterprise Features & API Scaling
Backend Dev 2: Advanced Analytics & ML Integration
Frontend Dev 1: Mobile App Development & Advanced Dashboard
Frontend Dev 2: International Expansion & Widget 2.0
DevOps: Global Infrastructure & Enterprise Scaling
Data Scientist: Advanced AI/ML Features & Predictive Analytics

WOCHE 9: POST-LAUNCH MONITORING & IMMEDIATE OPTIMIZATION
DevOps Engineer - 24/7 Operations Setup
Daily Tasks:

Tag 1: Real-time Monitoring Dashboard Setup
Tag 2: Automated Alerting & Incident Response
Tag 3: Performance Baseline Establishment
Tag 4: Capacity Planning & Auto-scaling Tuning
Tag 5: Week 1 Performance Review & Optimization

Code Example - Advanced Monitoring Setup:

```yaml monitoring/grafana-dashboard.yml
apiVersion: v1
kind: ConfigMap
metadata:
  name: autocare-dashboard
data:
  dashboard.json: |
    {
      "dashboard": {
        "title": "AutoCare Advisor Production Metrics",
        "panels": [
          {
            "title": "API Response Times",
            "type": "graph",
            "targets": [
              {
                "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
                "legendFormat": "95th percentile"
              },
              {
                "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
                "legendFormat": "50th percentile"
              }
            ]
          },
          {
            "title": "Widget Load Performance",
            "type": "stat",
            "targets": [
              {
                "expr": "avg(widget_load_time_seconds)",
                "legendFormat": "Average Load Time"
              }
            ]
          },
          {
            "title": "Business Metrics",
            "type": "table",
            "targets": [
              {
                "expr": "increase(recommendations_generated_total[1h])",
                "legendFormat": "Hourly Recommendations"
              },
              {
                "expr": "increase(widget_clicks_total[1h])",
                "legendFormat": "Hourly Clicks"
              }
            ]
          }
        ]
      }
    }
```

---

# monitoring/alerts.yml

apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
name: autocare-alerts
spec:
groups:

- name: autocare.critical
  rules: - alert: HighResponseTime
  expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5
  for: 2m
  labels:
  severity: critical
  annotations:
  summary: "High API response time detected"
  description: "95th percentile response time is {{ $value }}s"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"

      - alert: DatabaseConnections
        expr: pg_stat_database_numbackends > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High database connection count"

  Backend Dev 1 - Production Support & Hot-fixes
  Daily Tasks:

Tag 1: Live Issue Monitoring & Quick Fixes
Tag 2: API Performance Optimization
Tag 3: Database Query Optimization
Tag 4: Rate Limiting Fine-tuning
Tag 5: User Feedback Implementation

Code Example - Production Monitoring Service:

```javascript
class ProductionMonitoringService {
  constructor() {
    this.metrics = new PrometheusMetrics();
    this.healthChecks = new Map();
    this.performanceThresholds = {
      apiResponseTime: 200, // ms
      dbQueryTime: 100, // ms
      cacheHitRate: 0.85,
      errorRate: 0.001,
    };
  }

  async initializeHealthChecks() {
    // Database health check
    this.healthChecks.set("database", async () => {
      const start = Date.now();
      try {
        await db.query("SELECT 1");
        const responseTime = Date.now() - start;
        return {
          status: "healthy",
          responseTime,
          healthy: responseTime < this.performanceThresholds.dbQueryTime,
        };
      } catch (error) {
        return {
          status: "unhealthy",
          error: error.message,
          healthy: false,
        };
      }
    });

    // Redis health check
    this.healthChecks.set("redis", async () => {
      const start = Date.now();
      try {
        await redis.ping();
        const responseTime = Date.now() - start;
        return {
          status: "healthy",
          responseTime,
          healthy: responseTime < 50,
        };
      } catch (error) {
        return {
          status: "unhealthy",
          error: error.message,
          healthy: false,
        };
      }
    });

    // ML Service health check
    this.healthChecks.set("ml-service", async () => {
      try {
        const response = await fetch(`${process.env.ML_API_URL}/health`, {
          timeout: 5000,
        });
        return {
          status: response.ok ? "healthy" : "unhealthy",
          healthy: response.ok,
        };
      } catch (error) {
        return {
          status: "unhealthy",
          error: error.message,
          healthy: false,
        };
      }
    });
  }

  async runHealthCheck() {
    const results = {};
    let overallHealth = true;

    for (const [service, checkFn] of this.healthChecks) {
      try {
        const result = await checkFn();
        results[service] = result;
        if (!result.healthy) {
          overallHealth = false;
        }
      } catch (error) {
        results[service] = {
          status: "error",
          error: error.message,
          healthy: false,
        };
        overallHealth = false;
      }
    }

    // Record metrics
    this.metrics.recordHealthCheck(results, overallHealth);

    return {
      status: overallHealth ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      services: results,
    };
  }

  // Performance Monitoring Middleware
  createPerformanceMiddleware() {
    return (req, res, next) => {
      const start = Date.now();

      // Capture original res.end
      const originalEnd = res.end;

      res.end = (...args) => {
        const responseTime = Date.now() - start;

        // Record metrics
        this.metrics.recordApiRequest({
          method: req.method,
          route: req.route?.path || req.path,
          statusCode: res.statusCode,
          responseTime,
          userAgent: req.get("User-Agent"),
          partnerId: req.user?.id,
        });

        // Check for performance issues
        if (responseTime > this.performanceThresholds.apiResponseTime) {
          console.warn(
            `Slow API response: ${req.method} ${req.path} - ${responseTime}ms`
          );

          // Alert if critical
          if (responseTime > this.performanceThresholds.apiResponseTime * 2) {
            this.sendAlert({
              type: "performance",
              severity: "high",
              message: `Critical slow response: ${responseTime}ms for ${req.method} ${req.path}`,
              metadata: { responseTime, path: req.path, method: req.method },
            });
          }
        }

        // Call original end
        originalEnd.apply(res, args);
      };

      next();
    };
  }

  async sendAlert(alert) {
    // Send to Slack
    await this.sendSlackAlert(alert);

    // Send to PagerDuty for critical issues
    if (alert.severity === "critical") {
      await this.sendPagerDutyAlert(alert);
    }
  }
}

// Usage in Express app
const monitoringService = new ProductionMonitoringService();
await monitoringService.initializeHealthChecks();

app.use(monitoringService.createPerformanceMiddleware());

app.get("/health", async (req, res) => {
  const health = await monitoringService.runHealthCheck();
  res.status(health.status === "healthy" ? 200 : 503).json(health);
});
```

Backend Dev 2 - Real-time Analytics Enhancement
Daily Tasks:

Tag 1: Real-time Analytics Pipeline Optimization
Tag 2: Advanced Reporting Features
Tag 3: Customer Success Metrics Implementation
Tag 4: Data Export & API Integration Features
Tag 5: Performance Analytics Deep Dive

Frontend Dev 1 - User Experience Optimization
Daily Tasks:

Tag 1: User Feedback Collection & Analysis
Tag 2: Dashboard Performance Optimization
Tag 3: Mobile Responsiveness Improvements
Tag 4: Accessibility Enhancements
Tag 5: UI/UX Quick Wins Implementation

Frontend Dev 2 - Widget Performance Enhancement
Daily Tasks:

Tag 1: Widget Load Time Optimization
Tag 2: Cross-browser Compatibility Fixes
Tag 3: Widget Analytics Enhancement
Tag 4: A/B Testing Results Analysis
Tag 5: Widget Customization Features

Data Scientist - Model Performance Monitoring
Daily Tasks:

Tag 1: Live Model Performance Analysis
Tag 2: Recommendation Quality Assessment
Tag 3: User Behavior Pattern Analysis
Tag 4: Model Drift Detection Setup
Tag 5: Algorithm Performance Optimization

WOCHE 10: CUSTOMER SUCCESS & OPTIMIZATION
Backend Dev 1 - Customer Success Features
Daily Tasks:

Tag 1: Customer Onboarding API Enhancements
Tag 2: Usage Analytics & Billing Optimization
Tag 3: Partner Success Dashboard API
Tag 4: Advanced Integration Features
Tag 5: Customer Support Tool Integration

Code Example - Customer Success Tracking:

```javascript // Customer Success Tracking Service
class CustomerSuccessService {
  constructor() {
    this.onboardingSteps = [
      "account_created",
      "first_product_added",
      "widget_configured",
      "widget_embedded",
      "first_recommendation",
      "first_click",
      "billing_setup",
    ];
  }

  async trackOnboardingProgress(partnerId, step) {
    const progress = await OnboardingProgress.findOne({ partnerId });

    if (!progress) {
      await OnboardingProgress.create({
        partnerId,
        steps: { [step]: new Date() },
        currentStep: step,
        completionRate: this.calculateCompletionRate([step]),
      });
    } else {
      progress.steps[step] = new Date();
      progress.currentStep = step;
      progress.completionRate = this.calculateCompletionRate(
        Object.keys(progress.steps)
      );
      await progress.save();
    }

    // Trigger success milestones
    await this.checkSuccessMilestones(partnerId, progress);
  }

  async checkSuccessMilestones(partnerId, progress) {
    const completedSteps = Object.keys(progress.steps);

    // First recommendation milestone
    if (
      completedSteps.includes("first_recommendation") &&
      !progress.milestones?.first_recommendation
    ) {
      await this.triggerMilestone(partnerId, "first_recommendation", {
        emailTemplate: "first_recommendation_success",
        slackNotification: true,
        customerSuccessAction: "schedule_check_in",
      });
    }

    // Full onboarding completion
    if (
      progress.completionRate === 100 &&
      !progress.milestones?.onboarding_complete
    ) {
      await this.triggerMilestone(partnerId, "onboarding_complete", {
        emailTemplate: "onboarding_complete",
        unlockFeatures: ["advanced_analytics", "custom_branding"],
        assignCSM: true,
      });
    }

    // Success metrics tracking
    const monthlyStats = await this.getMonthlySuccessStats(partnerId);
    if (
      monthlyStats.recommendationsGenerated > 1000 &&
      !progress.milestones?.power_user
    ) {
      await this.triggerMilestone(partnerId, "power_user", {
        emailTemplate: "power_user_recognition",
        unlockFeatures: ["enterprise_features"],
        scheduleUpgradeCall: true,
      });
    }
  }

  async getCustomerHealthScore(partnerId) {
    const partner = await User.findById(partnerId);
    const stats = await this.getMonthlySuccessStats(partnerId);
    const onboarding = await OnboardingProgress.findOne({ partnerId });

    let score = 0;

    // Onboarding completion (30 points)
    score += (onboarding?.completionRate || 0) * 0.3;

    // Usage frequency (25 points)
    const usageScore = Math.min(stats.recommendationsGenerated / 500, 1) * 25;
    score += usageScore;

    // Engagement quality (20 points)
    const engagementScore = (stats.averageClickThroughRate || 0) * 20;
    score += engagementScore;

    // Feature adoption (15 points)
    const featuresUsed = [
      stats.customizationUsed,
      stats.analyticsAccessed,
      stats.apiIntegrationActive,
    ].filter(Boolean).length;
    score += (featuresUsed / 3) * 15;

    // Support interactions (10 points)
    const supportScore =
      stats.supportTickets === 0 ? 10 : stats.supportTickets <= 2 ? 7 : 3;
    score += supportScore;

    return {
      score: Math.round(score),
      category: this.getHealthCategory(score),
      recommendations: this.getHealthRecommendations(score, stats),
      trend: await this.getHealthTrend(partnerId),
    };
  }

  getHealthCategory(score) {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "at_risk";
    return "critical";
  }

  async generateSuccessReport(partnerId, period = "30d") {
    const stats = await this.getPeriodStats(partnerId, period);
    const healthScore = await this.getCustomerHealthScore(partnerId);
    const benchmarks = await this.getIndustryBenchmarks();

    return {
      partner: {
        id: partnerId,
        tier: stats.tierLevel,
        joinDate: stats.createdAt,
      },
      metrics: {
        recommendationsGenerated: stats.recommendationsGenerated,
        clickThroughRate: stats.averageClickThroughRate,
        conversionImprovement: stats.conversionImprovement,
        revenueGenerated: stats.revenueGenerated,
      },
      healthScore,
      benchmarks: {
        industryAvgCTR: benchmarks.averageClickThroughRate,
        topQuartileCTR: benchmarks.topQuartileClickThroughRate,
        yourPerformance: this.compareToIndustry(stats, benchmarks),
      },
      recommendations: await this.getPersonalizedRecommendations(
        partnerId,
        stats
      ),
      nextSteps: await this.getNextSteps(partnerId, healthScore),
    };
  }
}
```

Frontend Dev 1 - Mobile App Foundation
Daily Tasks:

Tag 1: React Native Project Setup
Tag 2: Core Navigation & Authentication
Tag 3: Dashboard Mobile Interface
Tag 4: Analytics Mobile Views
Tag 5: Push Notifications Setup

Code Example - React Native App Structure:

```javascript
// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/store';
import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import { useAuth } from './src/hooks/useAuth';
import LoadingScreen from './src/screens/LoadingScreen';

const Stack = createStackNavigator();

const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}

// src/screens/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAnalytics } from '../store/slices/analyticsSlice';
import MetricCard from '../components/MetricCard';
import ChartContainer from '../components/ChartContainer';

const { width: screenWidth } = Dimensions.get('window');

const DashboardScreen = () => {
  const dispatch = useDispatch();
  const { analytics, loading } = useSelector(state => state.analytics);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    await dispatch(fetchAnalytics());
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const chartData = {
    labels: analytics?.chartData?.labels || [],
    datasets: [{
      data: analytics?.chartData?.values || [],
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      strokeWidth: 2
    }]
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Letzte 30 Tage</Text>
      </View>

      <View style={styles.metricsContainer}>
        <MetricCard
          title="Impressions"
          value={analytics?.totalImpressions || 0}
          change={analytics?.impressionsChange || 0}
          icon="eye"
        />
        <MetricCard
          title="Empfehlungen"
          value={analytics?.totalRecommendations || 0}
          change={analytics?.recommendationsChange || 0}
          icon="target"
        />
        <MetricCard
          title="CTR"
          value={`${analytics?.clickThroughRate || 0}%`}
          change={analytics?.ctrChange || 0}
          icon="hand-pointer"
        />
        <MetricCard
          title="Revenue"
          value={`€${analytics?.revenue || 0}`}
          change={analytics?.revenueChange || 0}
          icon="euro-sign"
        />
      </View>

      <ChartContainer title="Performance Trend">
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#8641f4'
            }
          }}
          bezier
          style={styles.chart}
        />
      </ChartContainer>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default DashboardScreen;
```

# WOCHE 11: ENTERPRISE FEATURES & SCALING

Backend Dev 1 - Enterprise API Features
Daily Tasks:

Tag 1: Multi-tenant Architecture Implementation
Tag 2: Advanced API Rate Limiting & Quotas
Tag 3: Enterprise Authentication (SSO, SAML)
Tag 4: Advanced Webhook System
Tag 5: API Versioning & Backward Compatibility

Code Example - Multi-tenant Architecture:

```javascript
class TenantService {
  constructor() {
    this.tenantCache = new Map();
  }

  async getTenantConfig(tenantId) {
    // Check cache first
    if (this.tenantCache.has(tenantId)) {
      const cached = this.tenantCache.get(tenantId);
      if (Date.now() - cached.timestamp < 300000) {
        // 5 min cache
        return cached.config;
      }
    }

    // Fetch from database
    const tenant = await Tenant.findById(tenantId).populate("features");
    if (!tenant) {
      throw new Error("Tenant not found");
    }

    const config = {
      id: tenant.id,
      name: tenant.name,
      tier: tenant.tier,
      features: tenant.features.map((f) => f.name),
      limits: {
        apiCallsPerHour: this.getTierLimit(tenant.tier, "apiCalls"),
        recommendationsPerMonth: this.getTierLimit(
          tenant.tier,
          "recommendations"
        ),
        widgetsAllowed: this.getTierLimit(tenant.tier, "widgets"),
        customBranding: tenant.tier !== "basic",
        advancedAnalytics: ["professional", "enterprise"].includes(tenant.tier),
        whiteLabeling: tenant.tier === "enterprise",
      },
      settings: {
        dataRetentionDays: this.getTierLimit(tenant.tier, "dataRetention"),
        supportLevel: this.getTierLimit(tenant.tier, "support"),
        customDomain: tenant.customDomain,
        ssoEnabled: tenant.ssoConfig?.enabled || false,
      },
    };

    // Cache the config
    this.tenantCache.set(tenantId, {
      config,
      timestamp: Date.now(),
    });

    return config;
  }

  // Middleware for tenant context
  createTenantMiddleware() {
    return async (req, res, next) => {
      try {
        const tenantId = req.user?.tenantId || req.headers["x-tenant-id"];

        if (!tenantId) {
          return res.status(400).json({ error: "Tenant ID required" });
        }

        const tenantConfig = await this.getTenantConfig(tenantId);
        req.tenant = tenantConfig;

        // Check feature access
        const requiredFeature = req.route?.path?.split("/")[1];
        if (
          requiredFeature &&
          !this.hasFeatureAccess(tenantConfig, requiredFeature)
        ) {
          return res.status(403).json({
            error: "Feature not available in your plan",
            requiredTier: this.getRequiredTier(requiredFeature),
          });
        }

        next();
      } catch (error) {
        res.status(500).json({ error: "Tenant configuration error" });
      }
    };
  }

  hasFeatureAccess(tenantConfig, feature) {
    const featureMap = {
      "advanced-analytics": tenantConfig.limits.advancedAnalytics,
      "custom-branding": tenantConfig.limits.customBranding,
      "white-labeling": tenantConfig.limits.whiteLabeling,
      "api-webhooks": tenantConfig.tier !== "basic",
      "bulk-operations": tenantConfig.tier === "enterprise",
    };

    return featureMap[feature] !== false;
  }
}

// Enterprise Authentication with SSO
class EnterpriseAuthService {
  constructor() {
    this.samlStrategy = new SamlStrategy();
    this.oidcStrategy = new OIDCStrategy();
  }

  async setupSSOForTenant(tenantId, ssoConfig) {
    const tenant = await Tenant.findById(tenantId);

    if (tenant.tier !== "enterprise") {
      throw new Error("SSO is only available for Enterprise customers");
    }

    // Validate SSO configuration
    const validation = await this.validateSSOConfig(ssoConfig);
    if (!validation.valid) {
      throw new Error(
        `SSO configuration invalid: ${validation.errors.join(", ")}`
      );
    }

    // Setup SAML strategy for tenant
    if (ssoConfig.type === "saml") {
      await this.setupSAMLStrategy(tenant, ssoConfig);
    }

    // Setup OIDC strategy for tenant
    if (ssoConfig.type === "oidc") {
      await this.setupOIDCStrategy(tenant, ssoConfig);
    }

    // Save configuration
    tenant.ssoConfig = {
      ...ssoConfig,
      enabled: true,
      configuredAt: new Date(),
    };

    await tenant.save();

    return {
      success: true,
      loginUrl: this.generateSSOLoginUrl(tenant),
      callbackUrl: this.generateSSOCallbackUrl(tenant),
    };
  }

  async handleSSOCallback(tenantId, profile) {
    const tenant = await Tenant.findById(tenantId);

    // Map SSO attributes to user profile
    const userProfile = this.mapSSOProfile(
      profile,
      tenant.ssoConfig.attributeMapping
    );

    // Find or create user
    let user = await User.findOne({
      email: userProfile.email,
      tenantId,
    });

    if (!user) {
      user = await User.create({
        ...userProfile,
        tenantId,
        authProvider: "sso",
        emailVerified: true, // Trust SSO provider
      });
    } else {
      // Update user profile from SSO
      Object.assign(user, userProfile);
      await user.save();
    }

    // Generate JWT token
    const token = this.generateJWT(user);

    return {
      user,
      token,
      redirectUrl: tenant.ssoConfig.postLoginRedirect || "/dashboard",
    };
  }
}
```

# Backend Dev 2 - Advanced Analytics & ML Integration

## Daily Tasks:

- Tag 1: Predictive Analytics Implementation
- Tag 2: Advanced Segmentation & Cohort Analysis
- Tag 3: Real-time Personalization Engine
- Tag 4: Advanced A/B Testing Framework
- iTag 5: Customer Lifetime Value Prediction

### Code Example - Predictive Analytics Engine:

```python
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from datetime import datetime, timedelta
import asyncio
import aioredis

class PredictiveAnalyticsEngine:
    def __init__(self):
        self.models = {
            'churn_prediction': None,
            'ltv_prediction': None,
            'conversion_optimization': None,
            'demand_forecasting': None
        }
        self.scalers = {}
        self.redis = None

    async def initialize(self):
        self.redis = await aioredis.from_url("redis://localhost")
        await self.load_models()

    async def predict_customer_churn(self, partner_id):
        """Predict likelihood of customer churn"""
        features = await self.extract_churn_features(partner_id)

        if self.models['churn_prediction'] is None:
            await self.train_churn_model()

        churn_probability = self.models['churn_prediction'].predict_proba([features])[0][1]

        risk_level = 'low'
        if churn_probability > 0.7:
            risk_level = 'high'
        elif churn_probability > 0.4:
            risk_level = 'medium'

        recommendations = await self.generate_retention_recommendations(
            partner_id, churn_probability, features
        )

        return {
            'partner_id': partner_id,
            'churn_probability':
            'churn_probability': float(churn_probability),
           'risk_level': risk_level,
           'key_risk_factors': await self.identify_risk_factors(features),
           'recommendations': recommendations,
           'confidence': self.calculate_prediction_confidence(features),
           'predicted_churn_date': self.estimate_churn_date(churn_probability)
       }

   async def predict_customer_lifetime_value(self, partner_id):
       """Predict Customer Lifetime Value"""
       features = await self.extract_ltv_features(partner_id)

       if self.models['ltv_prediction'] is None:
           await self.train_ltv_model()

       predicted_ltv = self.models['ltv_prediction'].predict([features])[0]

       # Segment customer based on LTV
       ltv_segment = self.categorize_ltv(predicted_ltv)

       return {
           'partner_id': partner_id,
           'predicted_ltv': float(predicted_ltv),
           'ltv_segment': ltv_segment,
           'months_to_achieve': self.estimate_ltv_timeline(predicted_ltv),
           'optimization_opportunities': await self.find_ltv_optimization_opportunities(partner_id, features)
       }

   async def extract_churn_features(self, partner_id):
       """Extract features for churn prediction"""
       # Get partner data from last 90 days
       partner_data = await self.get_partner_analytics(partner_id, days=90)

       features = [
           # Usage patterns
           partner_data.get('avg_daily_recommendations', 0),
           partner_data.get('days_since_last_login', 0),
           partner_data.get('widget_usage_frequency', 0),
           partner_data.get('dashboard_visits_per_week', 0),

           # Engagement metrics
           partner_data.get('click_through_rate', 0),
           partner_data.get('conversion_improvement', 0),
           partner_data.get('support_tickets_count', 0),
           partner_data.get('feature_adoption_score', 0),

           # Business metrics
           partner_data.get('monthly_revenue_generated', 0),
           partner_data.get('roi_score', 0),
           partner_data.get('plan_utilization_rate', 0),

           # Behavioral indicators
           partner_data.get('customization_level', 0),
           partner_data.get('integration_depth', 0),
           partner_data.get('team_size', 1),

           # Trend indicators
           partner_data.get('usage_trend_30d', 0),  # positive/negative trend
           partner_data.get('performance_trend_30d', 0),
           partner_data.get('satisfaction_score', 5)  # from surveys
       ]

       return np.array(features)

   async def generate_retention_recommendations(self, partner_id, churn_prob, features):
       """Generate personalized retention recommendations"""
       recommendations = []

       # High churn risk interventions
       if churn_prob > 0.7:
           recommendations.extend([
               {
                   'type': 'immediate_intervention',
                   'action': 'schedule_success_call',
                   'priority': 'critical',
                   'message': 'Schedule immediate customer success call'
               },
               {
                   'type': 'value_demonstration',
                   'action': 'send_roi_report',
                   'priority': 'high',
                   'message': 'Send personalized ROI analysis'
               }
           ])

       # Feature adoption recommendations
       if features[7] < 0.5:  # Low feature adoption
           recommendations.append({
               'type': 'feature_education',
               'action': 'onboarding_webinar',
               'priority': 'medium',
               'message': 'Invite to advanced features webinar'
           })

       # Usage pattern recommendations
       if features[1] > 7:  # Days since last login > 7
           recommendations.append({
               'type': 'engagement',
               'action': 'send_usage_insights',
               'priority': 'high',
               'message': 'Send weekly usage insights email'
           })

       return recommendations

   async def optimize_conversion_rates(self, partner_id):
       """Optimize conversion rates using ML"""
       # Get historical data
       historical_data = await self.get_conversion_data(partner_id)

       # Feature engineering for conversion optimization
       features = []
       conversion_rates = []

       for session in historical_data:
           session_features = [
               session['questionnaire_version'],
               session['widget_position'],
               session['page_type'],
               session['device_type'],
               session['traffic_source'],
               session['time_of_day'],
               session['day_of_week'],
               session['user_segment']
           ]

           features.append(session_features)
           conversion_rates.append(session['converted'])

       # Train conversion optimization model
       if len(features) > 100:  # Sufficient data
           X = np.array(features)
           y = np.array(conversion_rates)

           model = GradientBoostingClassifier(n_estimators=100, random_state=42)
           model.fit(X, y)

           # Generate optimization recommendations
           feature_importance = model.feature_importances_

           recommendations = self.generate_conversion_recommendations(
               feature_importance, historical_data
           )

           return {
               'current_conversion_rate': np.mean(conversion_rates),
               'predicted_improvement': self.estimate_improvement_potential(model, X, y),
               'recommendations': recommendations,
               'confidence': model.score(X, y)
           }

       return {'error': 'Insufficient data for optimization'}

   async def customer_segmentation(self):
       """Advanced customer segmentation using ML"""
       # Get all partner data
       partners_data = await self.get_all_partners_data()

       # Feature engineering for segmentation
       features = []
       partner_ids = []

       for partner_id, data in partners_data.items():
           partner_features = [
               data.get('monthly_revenue', 0),
               data.get('usage_frequency', 0),
               data.get('feature_adoption_score', 0),
               data.get('support_interaction_frequency', 0),
               data.get('team_size', 1),
               data.get('industry_vertical', 0),  # encoded
               data.get('company_size', 0),  # encoded
               data.get('conversion_rate', 0),
               data.get('satisfaction_score', 5)
           ]

           features.append(partner_features)
           partner_ids.append(partner_id)

       # Normalize features
       scaler = StandardScaler()
       features_scaled = scaler.fit_transform(features)

       # K-means clustering
       kmeans = KMeans(n_clusters=5, random_state=42)
       segments = kmeans.fit_predict(features_scaled)

       # Analyze segments
       segment_analysis = {}
       for i in range(5):
           segment_partners = [pid for pid, seg in zip(partner_ids, segments) if seg == i]
           segment_data = [features[j] for j, seg in enumerate(segments) if seg == i]

           segment_analysis[f'segment_{i}'] = {
               'size': len(segment_partners),
               'characteristics': {
                   'avg_revenue': np.mean([d[0] for d in segment_data]),
                   'avg_usage': np.mean([d[1] for d in segment_data]),
                   'avg_adoption': np.mean([d[2] for d in segment_data]),
                   'avg_satisfaction': np.mean([d[8] for d in segment_data])
               },
               'partners': segment_partners[:10],  # Sample partners
               'recommendations': self.generate_segment_strategies(i, segment_data)
           }

       return segment_analysis

   async def demand_forecasting(self, partner_id, forecast_days=30):
       """Forecast demand and usage patterns"""
       # Get historical usage data
       usage_history = await self.get_usage_history(partner_id, days=90)

       # Time series features
       df = pd.DataFrame(usage_history)
       df['date'] = pd.to_datetime(df['date'])
       df = df.set_index('date').sort_index()

       # Feature engineering for time series
       df['day_of_week'] = df.index.dayofweek
       df['month'] = df.index.month
       df['is_weekend'] = (df.index.dayofweek >= 5).astype(int)

       # Rolling averages
       df['usage_7d_avg'] = df['daily_usage'].rolling(7).mean()
       df['usage_30d_avg'] = df['daily_usage'].rolling(30).mean()

       # Prepare features for prediction
       feature_cols = ['day_of_week', 'month', 'is_weekend', 'usage_7d_avg', 'usage_30d_avg']
       X = df[feature_cols].dropna()
       y = df['daily_usage'].loc[X.index]

       # Train forecasting model
       model = RandomForestRegressor(n_estimators=100, random_state=42)
       model.fit(X, y)

       # Generate forecasts
       forecasts = []
       last_date = df.index[-1]

       for i in range(1, forecast_days + 1):
           forecast_date = last_date + timedelta(days=i)

           # Create features for forecast date
           forecast_features = [
               forecast_date.dayofweek,
               forecast_date.month,
               1 if forecast_date.dayofweek >= 5 else 0,
               df['daily_usage'].tail(7).mean(),  # Recent 7-day average
               df['daily_usage'].tail(30).mean()  # Recent 30-day average
           ]

           predicted_usage = model.predict([forecast_features])[0]

           forecasts.append({
               'date': forecast_date.strftime('%Y-%m-%d'),
               'predicted_usage': max(0, predicted_usage),
               'confidence_interval': self.calculate_confidence_interval(model, forecast_features)
           })

       return {
           'partner_id': partner_id,
           'forecast_period': f'{forecast_days} days',
           'forecasts': forecasts,
           'trend': self.analyze_trend(forecasts),
           'seasonality': self.detect_seasonality(df),
           'recommendations': self.generate_capacity_recommendations(forecasts)
       }

class CohortAnalysisEngine:
   """Advanced cohort analysis for customer behavior"""

   def __init__(self):
       self.db = None

   async def analyze_retention_cohorts(self, cohort_period='monthly'):
       """Analyze customer retention by cohorts"""
       # Get all partner registration and activity data
       cohort_data = await self.get_cohort_data()

       # Create cohort table
       cohort_table = self.create_cohort_table(cohort_data, cohort_period)

       # Calculate retention rates
       retention_rates = self.calculate_retention_rates(cohort_table)

       # Analyze cohort performance
       cohort_analysis = {
           'retention_table': retention_rates.to_dict(),
           'average_retention': {
               'month_1': retention_rates.iloc[:, 1].mean(),
               'month_3': retention_rates.iloc[:, 3].mean(),
               'month_6': retention_rates.iloc[:, 6].mean() if retention_rates.shape[1] > 6 else None,
               'month_12': retention_rates.iloc[:, 12].mean() if retention_rates.shape[1] > 12 else None
           },
           'best_performing_cohort': self.identify_best_cohort(retention_rates),
           'retention_insights': self.generate_retention_insights(retention_rates),
           'improvement_opportunities': self.identify_improvement_opportunities(retention_rates)
       }

       return cohort_analysis

   async def revenue_cohort_analysis(self):
       """Analyze revenue patterns by customer cohorts"""
       revenue_data = await self.get_revenue_cohort_data()

       # Calculate cumulative revenue by cohort
       revenue_cohorts = self.calculate_revenue_cohorts(revenue_data)

       # LTV analysis by cohort
       ltv_analysis = self.calculate_cohort_ltv(revenue_cohorts)

       return {
           'revenue_cohorts': revenue_cohorts.to_dict(),
           'ltv_by_cohort': ltv_analysis,
           'payback_period': self.calculate_payback_periods(revenue_cohorts),
           'revenue_insights': self.generate_revenue_insights(revenue_cohorts)
       }
```

# Usage in API

```async def main():
analytics_engine = PredictiveAnalyticsEngine()
cohort_engine = CohortAnalysisEngine()

await analytics_engine.initialize()
```

# Example usage

````
churn_prediction = await analytics_engine.predict_customer_churn('partner_123')
ltv_prediction = await analytics_engine.predict_customer_lifetime_value('partner_123')
conversion_optimization = await analytics_engine.optimize_conversion_rates('partner_123')

print("Analytics engine ready for production")

if __name__ == "__main__":
   asyncio.run(main())
´´´
Frontend Dev 1 - Mobile App Advanced Features
Daily Tasks:

Tag 1: Push Notifications & Real-time Updates
Tag 2: Offline Capability & Data Sync
Tag 3: Advanced Chart & Analytics Views
Tag 4: Mobile-Optimized Widget Manager
Tag 5: App Store Preparation & Beta Testing

Code Example - Mobile Push Notifications:

```javascript
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PushNotificationService {
  constructor() {
    this.configure();
    this.createChannels();
  }

  configure() {
    PushNotification.configure({
      onRegister: async (token) => {
        console.log('Push notification token:', token);
        await this.savePushToken(token.token);
      },

      onNotification: (notification) => {
        console.log('Notification received:', notification);
        this.handleNotification(notification);
      },

      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Firebase messaging setup
    messaging().onMessage(async (remoteMessage) => {
      this.handleFirebaseMessage(remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }

  createChannels() {
    // Create notification channels for Android
    PushNotification.createChannel({
      channelId: 'analytics-alerts',
      channelName: 'Analytics Alerts',
      channelDescription: 'Important analytics and performance alerts',
      importance: 4,
      vibrate: true,
    });

    PushNotification.createChannel({
      channelId: 'recommendations',
      channelName: 'Recommendations',
      channelDescription: 'New recommendations and insights',
      importance: 3,
    });

    PushNotification.createChannel({
      channelId: 'system-updates',
      channelName: 'System Updates',
      channelDescription: 'System maintenance and update notifications',
      importance: 2,
    });
  }

  async savePushToken(token) {
    try {
      await AsyncStorage.setItem('pushToken', token);

      // Send token to backend
      const userToken = await AsyncStorage.getItem('authToken');
      if (userToken) {
        await fetch(`${API_URL}/user/push-token`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pushToken: token,
            platform: Platform.OS
          }),
        });
      }
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  handleNotification(notification) {
    const { data, userInteraction } = notification;

    if (userInteraction) {
      // User tapped the notification
      this.navigateFromNotification(data);
    } else {
      // Notification received while app is in foreground
      this.showInAppNotification(notification);
    }
  }

  navigateFromNotification(data) {
    switch (data.type) {
      case 'analytics_alert':
        // Navigate to analytics dashboard
        this.navigation.navigate('Analytics', {
          alert: data.alertId
        });
        break;

      case 'new_recommendation':
        // Navigate to recommendations
        this.navigation.navigate('Recommendations');
        break;

      case 'performance_issue':
        // Navigate to performance dashboard
        this.navigation.navigate('Performance', {
          issue: data.issueId
        });
        break;

      default:
        // Navigate to dashboard
        this.navigation.navigate('Dashboard');
    }
  }

  // Method to send targeted notifications from backend
  static async sendNotification(userId, notification) {
    const payload = {
      notification: {
        title: notification.title,
        body: notification.body,
        sound: 'default',
      },
      data: {
        type: notification.type,
        ...notification.data,
      },
      android: {
        channelId: notification.channelId || 'default',
        priority: 'high',
        notification: {
          color: '#8641f4',
          icon: 'ic_notification',
        },
      },
      apns: {
        payload: {
          aps: {
            badge: notification.badge || 1,
            sound: 'default',
          },
        },
      },
    };

    return await messaging().sendToDevice(notification.pushToken, payload);
  }
}

// Real-time Data Sync Service
class DataSyncService {
  constructor() {
    this.syncQueue = [];
    this.isOnline = true;
    this.syncInterval = null;
  }

  async initialize() {
    // Check network status
    this.setupNetworkListener();

    // Start periodic sync
    this.startPeriodicSync();

    // Handle app state changes
    this.setupAppStateListener();
  }

  setupNetworkListener() {
    import('@react-native-async-storage/async-storage').then(({ default: NetInfo }) => {
      NetInfo.addEventListener(state => {
        const wasOnline = this.isOnline;
        this.isOnline = state.isConnected;

        if (!wasOnline && this.isOnline) {
          // Came back online, sync pending data
          this.syncPendingData();
        }
      });
    });
  }

  async syncPendingData() {
    if (!this.isOnline || this.syncQueue.length === 0) {
      return;
    }

    const pendingActions = [...this.syncQueue];
    this.syncQueue = [];

    for (const action of pendingActions) {
      try {
        await this.executeAction(action);
      } catch (error) {
        console.error('Sync error:', error);
        // Re-queue failed actions
        this.syncQueue.push(action);
      }
    }

    // Save updated queue
    await this.saveSyncQueue();
  }

  async executeAction(action) {
    switch (action.type) {
      case 'analytics_view':
        return await this.syncAnalyticsView(action.data);

      case 'settings_update':
        return await this.syncSettingsUpdate(action.data);

      case 'feedback_submit':
        return await this.syncFeedback(action.data);

      default:
        console.warn('Unknown sync action:', action.type);
    }
  }

  async queueAction(type, data) {
    const action = {
      id: Date.now().toString(),
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    if (this.isOnline) {
      // Execute immediately if online
      try {
        await this.executeAction(action);
        return true;
      } catch (error) {
        console.error('Immediate sync failed:', error);
        // Queue for later if immediate sync fails
      }
    }

    // Queue for later sync
    this.syncQueue.push(action);
    await this.saveSyncQueue();
    return false;
  }

  async saveSyncQueue() {
    try {
      await AsyncStorage.setItem('syncQueue', JSON.stringify(this.syncQueue));
    } catch (error) {
      console.error('Error saving sync queue:', error);
    }
  }

  async loadSyncQueue() {
    try {
      const queue = await AsyncStorage.getItem('syncQueue');
      this.syncQueue = queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error loading sync queue:', error);
      this.syncQueue = [];
    }
  }
}

export { PushNotificationService, DataSyncService };
´´´
---
Frontend Dev 2 - International Expansion
---
Daily Tasks:

Tag 1: Multi-language Support Implementation (i18n)
Tag 2: RTL Language Support
Tag 3: Currency & Date Localization
Tag 4: Cultural Adaptation Features
Tag 5: International Widget Variants

Code Example - Internationalization System:

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Language resources

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.analytics': 'Analytics',
      'nav.products': 'Products',
      'nav.settings': 'Settings',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.welcome': 'Welcome back, {{name}}!',
      'dashboard.metrics.impressions': 'Impressions',
      'dashboard.metrics.recommendations': 'Recommendations',
      'dashboard.metrics.clicks': 'Clicks',
      'dashboard.metrics.revenue': 'Revenue',

      // Widget
      'widget.title': 'Find the perfect car care product',
      'widget.subtitle': 'Answer {{count}} quick questions',
      'widget.start': 'Start Consultation',
      'widget.next': 'Next',
      'widget.previous': 'Previous',
      'widget.finish': 'Get Recommendations',

      // Questions
      'questions.vehicle_type': 'What type of vehicle do you have?',
      'questions.paint_type': 'What type of paint does your vehicle have?',
      'questions.experience': 'How experienced are you with car care?',
      'questions.budget': 'What is your budget range?',

      // Results
      'results.title': 'Perfect matches for your {{vehicleType}}',
      'results.score': 'Match Score: {{score}}%',
      'results.reason': 'Why this product?',
      'results.learn_more': 'Learn More',
      'results.buy_now': 'Buy Now',

      // Common
      'common.loading': 'Loading...',
      'common.error': 'Something went wrong',
      'common.retry': 'Try Again',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
    }
  },
  de: {
    translation: {
      // Navigation
      'nav.dashboard': 'Dashboard',
      'nav.analytics': 'Analytik',
      'nav.products': 'Produkte',
      'nav.settings': 'Einstellungen',

      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.welcome': 'Willkommen zurück, {{name}}!',
      'dashboard.metrics.impressions': 'Impressionen',
      'dashboard.metrics.recommendations': 'Empfehlungen',
      'dashboard.metrics.clicks': 'Klicks',
      'dashboard.metrics.revenue': 'Umsatz',

      // Widget
      'widget.title': 'Finden Sie das perfekte Autopflegeprodukt',
      'widget.subtitle': 'Beantworten Sie {{count}} kurze Fragen',
      'widget.start': 'Beratung starten',
      'widget.next': 'Weiter',
      'widget.previous': 'Zurück',
      'widget.finish': 'Empfehlungen erhalten',

      // Questions
      'questions.vehicle_type': 'Welchen Fahrzeugtyp haben Sie?',
      'questions.paint_type': 'Welche Lackart hat Ihr Fahrzeug?',
      'questions.experience': 'Wie erfahren sind Sie in der Autopflege?',
      'questions.budget': 'Wie hoch ist Ihr Budget?',

      // Results
      'results.title': 'Perfekte Treffer für Ihren {{vehicleType}}',
      'results.score': 'Übereinstimmung: {{score}}%',
      'results.reason': 'Warum dieses Produkt?',
      'results.learn_more': 'Mehr erfahren',
      'results.buy_now': 'Jetzt kaufen',

      // Common
      'common.loading': 'Wird geladen...',
      'common.error': 'Ein Fehler ist aufgetreten',
      'common.retry': 'Erneut versuchen',
      'common.cancel': 'Abbrechen',
      'common.save': 'Speichern',
      'common.delete': 'Löschen',
      'common.edit': 'Bearbeiten',
    }
  },
  fr: {
    translation: {
      // Navigation
      'nav.dashboard': 'Tableau de bord',
      'nav.analytics': 'Analytique',
      'nav.products': 'Produits',
      'nav.settings': 'Paramètres',

      // Widget
      'widget.title': 'Trouvez le produit d\'entretien automobile parfait',
      'widget.subtitle': 'Répondez à {{count}} questions rapides',
      'widget.start': 'Commencer la consultation',

      // Add more French translations...
    }
  },
  es: {
    translation: {
      // Spanish translations
      'widget.title': 'Encuentra el producto perfecto para el cuidado del automóvil',
      'widget.subtitle': 'Responde {{count}} preguntas rápidas',

      // Add more Spanish translations...
    }
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false,
    },

    resources,

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;

// Localization Hook for Components
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useLocalization = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
    // Update widget configuration
    window.postMessage({
      type: 'LANGUAGE_CHANGED',
      language: lng
    }, '*');
  }, [i18n]);

  const formatCurrency = useCallback((amount, currency = 'EUR') => {
    const locale = i18n.language === 'de' ? 'de-DE' :
                  i18n.language === 'fr' ? 'fr-FR' :
                  i18n.language === 'es' ? 'es-ES' : 'en-US';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  }, [i18n.language]);

  const formatDate = useCallback((date) => {
    const locale = i18n.language === 'de' ? 'de-DE' :
                  i18n.language === 'fr' ? 'fr-FR' :
                  i18n.language === 'es' ? 'es-ES' : 'en-US';

    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  }, [i18n.language]);

  const isRTL = useCallback(() => {
    return ['ar', 'he', 'fa'].includes(i18n.language);
  }, [i18n.language]);

  return {
    t,
    currentLanguage: i18n.language,
    changeLanguage,
    formatCurrency,
    formatDate,
    isRTL,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'es', name: 'Español', flag: '🇪🇸' }
    ]
  };
};

// International Widget Component
const InternationalWidget = ({ config }) => {
  const { t, currentLanguage, isRTL } = useLocalization();

  const widgetStyles = {
    direction: isRTL() ? 'rtl' : 'ltr',
    textAlign: isRTL() ? 'right' : 'left',
    fontFamily: getLocalizedFont(currentLanguage)
  };

  return (
    <div style={widgetStyles} className={`widget-container ${currentLanguage}`}>
      <h2>{t('widget.title')}</h2>
      <p>{t('widget.subtitle', { count: config.questionCount })}</p>

      <QuestionnaireFlow
        language={currentLanguage}
        isRTL={isRTL()}
        onComplete={(results) => {
          // Handle completion with language context
          handleCompletion(results, currentLanguage);
        }}
      />
    </div>
  );
};

// Cultural Adaptation Service
class CulturalAdaptationService {
  static getLocalizedContent(language, contentType) {
    const adaptations = {
      de: {
        colors: {
          primary: '#000000', // Germans prefer more conservative colors
          accent: '#FF0000'
       },
       imagery: {
         preferredCarTypes: ['BMW', 'Mercedes', 'Audi', 'Volkswagen'],
         culturalPreferences: ['precision', 'quality', 'engineering']
       },
       messaging: {
         tone: 'formal',
         emphasize: ['quality', 'precision', 'german_engineering']
       }
     },
     fr: {
       colors: {
         primary: '#0055A4', // French blue
         accent: '#EF4135'  // French red
       },
       imagery: {
         preferredCarTypes: ['Peugeot', 'Renault', 'Citroën'],
         culturalPreferences: ['style', 'elegance', 'sophistication']
       },
       messaging: {
         tone: 'elegant',
         emphasize: ['style', 'french_design', 'luxury']
       }
     },
     es: {
       colors: {
         primary: '#C60B1E', // Spanish red
         accent: '#FFC400'   // Spanish yellow
       },
       imagery: {
         preferredCarTypes: ['SEAT', 'general'],
         culturalPreferences: ['family', 'value', 'practicality']
       },
       messaging: {
         tone: 'warm',
         emphasize: ['family_care', 'value', 'tradition']
       }
     },
     en: {
       colors: {
         primary: '#007bff',
         accent: '#28a745'
       },
       imagery: {
         preferredCarTypes: ['Ford', 'general'],
         culturalPreferences: ['efficiency', 'innovation', 'convenience']
       },
       messaging: {
         tone: 'friendly',
         emphasize: ['convenience', 'results', 'innovation']
       }
     }
   };

   return adaptations[language] || adaptations.en;
 }

 static getLocalizedQuestions(language) {
   const questionAdaptations = {
     de: {
       vehicleType: {
         options: ['PKW', 'SUV', 'Kombi', 'Oldtimer', 'Motorrad'],
         culturalNotes: 'Germans are very specific about car categories'
       },
       budget: {
         ranges: ['unter 25€', '25-50€', '50-100€', '100-200€', 'über 200€'],
         currency: 'EUR'
       }
     },
     fr: {
       vehicleType: {
         options: ['Berline', 'SUV', 'Break', 'Voiture ancienne', 'Moto'],
         culturalNotes: 'French prefer elegant terminology'
       },
       budget: {
         ranges: ['moins de 25€', '25-50€', '50-100€', '100-200€', 'plus de 200€'],
         currency: 'EUR'
       }
     },
     es: {
       vehicleType: {
         options: ['Sedán', 'SUV', 'Familiar', 'Clásico', 'Motocicleta'],
         culturalNotes: 'Spanish speakers prefer familiar terms'
       },
       budget: {
         ranges: ['menos de 25€', '25-50€', '50-100€', '100-200€', 'más de 200€'],
         currency: 'EUR'
       }
     }
   };

   return questionAdaptations[language] || questionAdaptations.en;
 }
}

export { CulturalAdaptationService };
´´´

---
WOCHE 12: ENTERPRISE SCALING & ADVANCED FEATURES
DevOps Engineer - Global Infrastructure
Daily Tasks:

Tag 1: Multi-region Deployment Setup
Tag 2: Global CDN & Edge Computing
Tag 3: Advanced Monitoring & Observability
Tag 4: Enterprise Security & Compliance
Tag 5: Disaster Recovery & Business Continuity

Code Example - Multi-region Infrastructure:
yaml# terraform/global-infrastructure.tf
# Multi-region setup for global scaling

# Primary region (EU-Central-1)
module "primary_region" {
  source = "./modules/region"

  region = "eu-central-1"
  environment = "production"
  is_primary = true

  # High availability setup
  availability_zones = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]

  # Auto-scaling configuration
  min_capacity = 3
  max_capacity = 50
  target_capacity = 5

  # Database configuration
  db_instance_class = "db.r6g.xlarge"
  db_multi_az = true
  db_backup_retention = 30

  # Cache configuration
  cache_node_type = "cache.r6g.large"
  cache_num_nodes = 3

  tags = {
    Environment = "production"
    Region = "primary"
    Service = "autocare-advisor"
  }
}

# Secondary region (US-East-1) for global expansion
module "secondary_region" {
  source = "./modules/region"

  region = "us-east-1"
  environment = "production"
  is_primary = false

  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

  # Smaller initial capacity for secondary region
  min_capacity = 2
  max_capacity = 20
  target_capacity = 3

  # Read replica configuration
  db_instance_class = "db.r6g.large"
  db_is_replica = true
  db_source_region = "eu-central-1"

  cache_node_type = "cache.r6g.medium"
  cache_num_nodes = 2

  tags = {
    Environment = "production"
    Region = "secondary"
    Service = "autocare-advisor"
  }
}

# Global CloudFront distribution
resource "aws_cloudfront_distribution" "global_cdn" {
  origin {
    domain_name = module.primary_region.alb_dns_name
    origin_id   = "primary-alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = module.secondary_region.alb_dns_name
    origin_id   = "secondary-alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "AutoCare Advisor Global CDN"
  default_root_object = "index.html"

  # Cache behaviors for different content types
  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "primary-alb"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = ["Authorization", "CloudFront-Viewer-Country"]

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Widget cache behavior (longer TTL)
  ordered_cache_behavior {
    path_pattern     = "/widget/*"
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "primary-alb"
    compress         = true

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    min_ttl                = 3600
    default_ttl            = 86400
    max_ttl                = 31536000
    viewer_protocol_policy = "redirect-to-https"
  }

  # API cache behavior (no caching)
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "primary-alb"

    forwarded_values {
      query_string = true
      headers      = ["*"]

      cookies {
        forward = "all"
      }
    }

    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
    viewer_protocol_policy = "redirect-to-https"
  }

  # Geographic restrictions
  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA", "GB", "DE", "FR", "ES", "IT", "NL", "BE", "AT", "CH"]
    }
  }

  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.global_cert.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = {
    Environment = "production"
    Service     = "autocare-advisor"
  }
}

# Route 53 health checks and failover
resource "aws_route53_health_check" "primary_health" {
  fqdn                            = module.primary_region.alb_dns_name
  port                            = 443
  type                            = "HTTPS"
  resource_path                   = "/health"
  failure_threshold               = "3"
  request_interval                = "30"
  cloudwatch_alarm_region         = "eu-central-1"
  cloudwatch_alarm_name           = "primary-region-health"
  insufficient_data_health_status = "Failure"

  tags = {
    Name = "Primary Region Health Check"
  }
}

resource "aws_route53_health_check" "secondary_health" {
  fqdn                            = module.secondary_region.alb_dns_name
  port                            = 443
  type                            = "HTTPS"
  resource_path                   = "/health"
  failure_threshold               = "3"
  request_interval                = "30"
  cloudwatch_alarm_region         = "us-east-1"
  cloudwatch_alarm_name           = "secondary-region-health"
  insufficient_data_health_status = "Failure"

  tags = {
    Name = "Secondary Region Health Check"
  }
}

# DNS failover configuration
resource "aws_route53_record" "primary" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.autocare-advisor.com"
  type    = "A"

  set_identifier = "primary"
  failover_routing_policy {
    type = "PRIMARY"
  }

  alias {
    name                   = aws_cloudfront_distribution.global_cdn.domain_name
    zone_id                = aws_cloudfront_distribution.global_cdn.hosted_zone_id
    evaluate_target_health = true
  }

  health_check_id = aws_route53_health_check.primary_health.id
}

resource "aws_route53_record" "secondary" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "api.autocare-advisor.com"
  type    = "A"

  set_identifier = "secondary"
  failover_routing_policy {
    type = "SECONDARY"
  }

  alias {
    name                   = module.secondary_region.alb_dns_name
    zone_id                = module.secondary_region.alb_zone_id
    evaluate_target_health = true
  }

  health_check_id = aws_route53_health_check.secondary_health.id
}
Backend Dev 1 - Enterprise API Gateway
Daily Tasks:

Tag 1: Advanced API Gateway with Rate Limiting
Tag 2: Enterprise Authentication & Authorization
Tag 3: API Analytics & Monitoring
Tag 4: White-label API Solutions
Tag 5: Enterprise Integration Capabilities

Code Example - Enterprise API Gateway:
javascript// Enterprise API Gateway with Advanced Features
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

class EnterpriseAPIGateway {
  constructor() {
    this.app = express();
    this.rateLimiters = new Map();
    this.metrics = new MetricsCollector();
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    // Security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }));

    // Compression
    this.app.use(compression());

    // Request logging
    this.app.use(morgan('combined', {
      stream: {
        write: (message) => {
          this.metrics.logRequest(message);
        }
      }
    }));

    // Parse JSON
    this.app.use(express.json({ limit: '10mb' }));

    // CORS with enterprise configuration
    this.app.use(this.createCORSMiddleware());

    // Tenant context
    this.app.use(this.createTenantMiddleware());

    // Authentication
    this.app.use(this.createAuthenticationMiddleware());

    // Rate limiting
    this.app.use(this.createRateLimitingMiddleware());

    // Request validation
    this.app.use(this.createValidationMiddleware());

    // Metrics collection
    this.app.use(this.createMetricsMiddleware());
  }

  createRateLimitingMiddleware() {
    return (req, res, next) => {
      const tenantId = req.tenant?.id;
      const tier = req.tenant?.tier || 'basic';

      // Get or create rate limiter for this tenant
      const limitKey = `${tenantId}_${tier}`;

      if (!this.rateLimiters.has(limitKey)) {
        const limits = this.getTierLimits(tier);

        const limiter = rateLimit({
          windowMs: 60 * 60 * 1000, // 1 hour
          max: limits.requestsPerHour,
          message: {
            error: 'Rate limit exceeded',
            tier,
            limit: limits.requestsPerHour,
            resetTime: new Date(Date.now() + 60 * 60 * 1000)
          },
          standardHeaders: true,
          legacyHeaders: false,
          keyGenerator: (req) => `${tenantId}_${req.ip}`,
          onLimitReached: (req, res, options) => {
            this.metrics.recordRateLimitHit(tenantId, tier);

            // Notify tenant about rate limit
            if (tier !== 'enterprise') {
              this.sendUpgradeNotification(tenantId, 'rate_limit_reached');
            }
          }
        });

        this.rateLimiters.set(limitKey, limiter);
      }

      const limiter = this.rateLimiters.get(limitKey);
      limiter(req, res, next);
    };
  }

  createValidationMiddleware() {
    return (req, res, next) => {
      // API version validation
      const apiVersion = req.headers['api-version'] || '1.0';
      const supportedVersions = ['1.0', '1.1', '2.0'];

      if (!supportedVersions.includes(apiVersion)) {
        return res.status(400).json({
          error: 'Unsupported API version',
          supportedVersions,
          currentVersion: apiVersion
        });
      }

      req.apiVersion = apiVersion;

      // Request size validation
      if (req.headers['content-length'] > 10485760) { // 10MB
        return res.status(413).json({
          error: 'Request too large',
          maxSize: '10MB'
        });
      }

      next();
    };
  }

  createMetricsMiddleware() {
    return (req, res, next) => {
      const startTime = Date.now();

      // Capture original end
      const originalEnd = res.end;

      res.end = (...args) => {
        const responseTime = Date.now() - startTime;

        // Collect comprehensive metrics
        this.metrics.recordAPICall({
          tenantId: req.tenant?.id,
          method: req.method,
          endpoint: req.route?.path || req.path,
          statusCode: res.statusCode,
          responseTime,
          requestSize: req.headers['content-length'] || 0,
          responseSize: res.get('content-length') || 0,
          userAgent: req.get('User-Agent'),
          apiVersion: req.apiVersion,
          tier: req.tenant?.tier,
          timestamp: new Date()
        });

        // Performance alerting
        if (responseTime > 1000) {
          this.metrics.recordSlowQuery({
            endpoint: req.path,
            responseTime,
            tenantId: req.tenant?.id
          });
        }

        originalEnd.apply(res, args);
      };

      next();
    };
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', this.createHealthCheckHandler());

    // API documentation
    this.app.get('/docs', this.createDocsHandler());

    // Metrics endpoint (enterprise only)
    this.app.get('/metrics',
      this.requireTier('enterprise'),
      this.createMetricsHandler()
    );

    // Main API routes
    this.app.use('/api/v1', this.createAPIRoutes());

    // White-label API routes
    this.app.use('/api/white-label',
      this.requireTier('enterprise'),
      this.createWhiteLabelRoutes()
    );

    // Webhook management
    this.app.use('/api/webhooks',
      this.requireTier('professional'),
      this.createWebhookRoutes()
    );

    // Error handling
    this.app.use(this.createErrorHandler());
  }

  createAPIRoutes() {
    const router = express.Router();

    // Recommendations endpoint with enterprise features
    router.post('/recommendations', async (req, res) => {
      try {
        const { answers, partnerId, options = {} } = req.body;

        // Enterprise features
        if (req.tenant.tier === 'enterprise') {
          // A/B testing
          if (options.abTest) {
            const variant = await this.getABTestVariant(partnerId, options.abTest);
            options.algorithmVariant = variant;
          }

          // Custom scoring weights
          if (options.customWeights && req.tenant.features.includes('custom_scoring')) {
            options.scoringWeights = options.customWeights;
          }

          // White-label customization
          if (options.whiteLabel && req.tenant.features.includes('white_labeling')) {
            options.brandingConfig = await this.getWhiteLabelConfig(partnerId);
          }
        }

        const recommendations = await this.recommendationService.getRecommendations(
          answers,
          partnerId,
          options
        );

        // Enterprise analytics
        if (req.tenant.tier === 'enterprise') {
          await this.analyticsService.recordEnterpriseRecommendation({
            partnerId,
            recommendations,
            options,
            metadata: {
              apiVersion: req.apiVersion,
              responseTime: Date.now() - req.startTime,
              tenantId: req.tenant.id
            }
          });
        }

        res.json({
          success: true,
          recommendations,
          metadata: {
            apiVersion: req.apiVersion,
            tier: req.tenant.tier,
            features: req.tenant.features
          }
        });

      } catch (error) {
        this.handleAPIError(error, req, res);
      }
    });

    // Bulk recommendations (enterprise only)
    router.post('/recommendations/bulk',
      this.requireTier('enterprise'),
      async (req, res) => {
        try {
          const { requests } = req.body;

          if (!Array.isArray(requests) || requests.length > 100) {
            return res.status(400).json({
              error: 'Invalid bulk request',
              maxBatchSize: 100
            });
          }

          const results = await Promise.all(
            requests.map(async (request, index) => {
              try {
                const recommendations = await this.recommendationService.getRecommendations(
                  request.answers,
                  request.partnerId,
                  request.options
                );
                return { index, success: true, recommendations };
              } catch (error) {
                return { index, success: false, error: error.message };
              }
            })
          );

          res.json({
            success: true,
            results,
            processed: results.length,
            successful: results.filter(r => r.success).length
          });

        } catch (error) {
          this.handleAPIError(error, req, res);
        }
      }
    );

    // Advanced analytics endpoint
    router.get('/analytics/advanced',
      this.requireTier('professional'),
      async (req, res) => {
        try {
          const { partnerId, dateRange, metrics, granularity } = req.query;

          const analytics = await this.analyticsService.getAdvancedAnalytics({
            partnerId,
            dateRange: JSON.parse(dateRange),
            metrics: JSON.parse(metrics),
            granularity
          });

          res.json({
            success: true,
            analytics,
            generatedAt: new Date()
          });

        } catch (error) {
          this.handleAPIError(error, req, res);
        }
      }
    );

    return router;
  }

  createWhiteLabelRoutes() {
    const router = express.Router();

    // Custom domain management
    router.post('/domains', async (req, res) => {
      try {
        const { domain, brandingConfig } = req.body;

        const result = await this.whiteLabelService.setupCustomDomain(
          req.tenant.id,
          domain,
          brandingConfig
        );

        res.json(result);
      } catch (error) {
        this.handleAPIError(error, req, res);
      }
    });

    // Branded widget generation
    router.post('/widget/generate', async (req, res) => {
      try {
        const { widgetConfig, brandingConfig } = req.body;

        const widget = await this.whiteLabelService.generateBrandedWidget(
          req.tenant.id,
          widgetConfig,
          brandingConfig
        );

        res.json({
          success: true,
          widget,
          embedCode: widget.embedCode,
          previewUrl: widget.previewUrl
        });
      } catch (error) {
        this.handleAPIError(error, req, res);
      }
    });

    return router;
  }

  requireTier(requiredTier) {
    const tierHierarchy = ['basic', 'professional', 'enterprise'];

    return (req, res, next) => {
      const userTierIndex = tierHierarchy.indexOf(req.tenant?.tier || 'basic');
      const requiredTierIndex = tierHierarchy.indexOf(requiredTier);

      if (userTierIndex < requiredTierIndex) {
        return res.status(403).json({
          error: 'Feature not available in your plan',
          currentTier: req.tenant?.tier || 'basic',
          requiredTier,
          upgradeUrl: `https://autocare-advisor.com/upgrade?tier=${requiredTier}`
        });
      }

      next();
    };
  }

  getTierLimits(tier) {
    const limits = {
      basic: {
        requestsPerHour: 1000,
        recommendationsPerMonth: 10000,
        features: ['basic_analytics']
      },
      professional: {
        requestsPerHour: 5000,
        recommendationsPerMonth: 100000,
        features: ['basic_analytics', 'advanced_analytics', 'webhooks', 'custom_branding']
      },
      enterprise: {
        requestsPerHour: 50000,
        recommendationsPerMonth: 1000000,
        features: ['all']
      }
    };

    return limits[tier] || limits.basic;
  }

  handleAPIError(error, req, res) {
    const errorId = Date.now().toString();

    // Log error with context
    console.error(`API Error [${errorId}]:`, {
      error: error.message,
      stack: error.stack,
      tenantId: req.tenant?.id,
      endpoint: req.path,
      method: req.method,
      timestamp: new Date()
    });

    // Different error responses based on environment
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({
        error: 'Internal server error',
        errorId,
        support: 'Contact support@autocare-advisor.com with this error ID'
      });
    } else {
      res.status(500).json({
        error: error.message,
        errorId,
        stack: error.stack
      });
    }
  }
}

module.exports = EnterpriseAPIGateway;
````
