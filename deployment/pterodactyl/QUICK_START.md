# AutoCare Advisor Pterodactyl Quick Start

=====================================

## 🚀 Schnelle Installation

### Schritt 1: Eggs importieren

1. Lade alle 4 Egg-Dateien hoch:
   - autocare-postgres.json
   - autocare-mongodb.json
   - autocare-redis.json
   - autocare-backend.json

### Schritt 2: Container erstellen (in dieser Reihenfolge!)

#### 1. PostgreSQL Container

- Egg: AutoCare Advisor - PostgreSQL
- Memory: 1024MB, Swap: 512MB, CPU: 100%
- Port: 5432
- Environment:
  POSTGRES_DB=autocare_prod
  POSTGRES_USER=autocare_user
  POSTGRES_PASSWORD=[STARKES_PASSWORT]

#### 2. MongoDB Container

- Egg: AutoCare Advisor - MongoDB Database
- Memory: 1024MB, Swap: 512MB, CPU: 100%
- Port: 27017
- Environment:
  MONGO_INITDB_ROOT_USERNAME=admin
  MONGO_INITDB_ROOT_PASSWORD=[STARKES_PASSWORT]
  MONGO_INITDB_DATABASE=autocare_products

#### 3. Redis Container

- Egg: AutoCare Advisor - Redis Cache
- Memory: 512MB, Swap: 256MB, CPU: 50%
- Port: 6379
- Environment:
  REDIS_PASSWORD=[STARKES_PASSWORT]
  REDIS_MAX_MEMORY=400mb

#### 4. Backend Container

- Egg: AutoCare Advisor - Node.js Backend API
- Memory: 2048MB, Swap: 1024MB, CPU: 200%
- Port: 3000
- Environment:
  NODE_ENV=production
  DATABASE_URL=postgresql://autocare_user:[POSTGRES_PASS]@autocare-postgres:5432/autocare_prod
  MONGODB_URI=mongodb://admin:[MONGO_PASS]@autocare-mongodb:27017/autocare_products?authSource=admin
  REDIS_URL=redis://:[REDIS_PASS]@autocare-redis:6379
  JWT_SECRET=[64_ZEICHEN_RANDOM_STRING]
  CORS_ORIGIN=https://ihre-domain.com

### Schritt 3: Nach dem Start

1. Warte bis alle Container "Running" sind
2. Im Backend-Container ausführen:
   npm run db:migrate
   npm run db:seed:production

### Schritt 4: Reverse Proxy Setup

- Nur Backend Container (Port 3000) öffentlich zugänglich machen
- SSL-Zertifikat für HTTPS einrichten
- Rate Limiting aktivieren

## 📋 Container Namen für interne Kommunikation

- PostgreSQL: autocare-postgres
- MongoDB: autocare-mongodb
- Redis: autocare-redis
- Backend: autocare-backend

## 🔧 Ressourcen-Übersicht

- Total RAM: ~4.5GB
- Total CPU: 450% (4.5 Kerne)
- Storage: 50GB+ empfohlen

## ⚠️ Wichtige Hinweise

- Starke Passwörter verwenden (32+ Zeichen)
- Regelmäßige Backups einrichten
- Logs regelmäßig rotieren
- Performance monitoring aktivieren
