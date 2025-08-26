# AutoCare Advisor - Pterodactyl Deployment Guide

## Schnell-Deployment mit Pterodactyl

### 🚀 **5-Container Setup (Empfohlen)**

```
Container 1: PostgreSQL (Port 5432)
Container 2: MongoDB (Port 27017)
Container 3: Redis (Port 6379)
Container 4: Backend API (Port 5001)
Container 5: Frontend (Port 3000)
```

## Deployment-Optionen

### Option 1: Full-Stack Container (EMPFOHLEN ⭐)

**Ein Container für Frontend + Backend**

```bash
# Nur 4 Eggs importieren:
deployment/pterodactyl/eggs/
├── autocare-postgres.json
├── autocare-mongodb.json
├── autocare-redis.json
└── autocare-fullstack.json (Frontend + Backend + Nginx)
```

#### Container 1: PostgreSQL

```
Egg: autocare-postgres.json
RAM: 512MB, Storage: 5GB, Port: 5432
Environment Variables:
- POSTGRES_USER: autocare_user
- POSTGRES_PASSWORD: [sichere-password]
- POSTGRES_DB: autocare_db
```

#### Container 2: MongoDB

```
Egg: autocare-mongodb.json
RAM: 512MB, Storage: 10GB, Port: 27017
Environment Variables:
- MONGO_INITDB_ROOT_USERNAME: autocare_mongo
- MONGO_INITDB_ROOT_PASSWORD: [sichere-password]
- MONGO_INITDB_DATABASE: autocare_products
```

#### Container 3: Redis

```
Egg: autocare-redis.json
RAM: 256MB, Storage: 1GB, Port: 6379
Environment Variables:
- REDIS_PASSWORD: [sichere-password]
```

#### Container 4: Full-Stack Application

```
Egg: autocare-fullstack.json
RAM: 1.5GB, Storage: 3GB, Port: 80
Environment Variables:
- DATABASE_URL: postgresql://autocare_user:[password]@[postgres-container-ip]:5432/autocare_db
- MONGODB_URI: mongodb://autocare_mongo:[password]@[mongodb-container-ip]:27017/autocare_products
- REDIS_URL: redis://:[password]@[redis-container-ip]:6379/0
- JWT_SECRET: [zufalls-string-64-zeichen]
- CORS_ORIGIN: https://yourdomain.com
- LOG_LEVEL: info

Interne Services:
- Frontend (Next.js): Port 3000
- Backend API (Express): Port 5001
- Nginx Reverse Proxy: Port 80 (extern)
- Routing: / → Frontend, /api/ → Backend
```

### Option 2: Separate Container (5-Container Setup)

**Für erweiterte Konfiguration**

```bash
# Alle 5 Eggs importieren:
deployment/pterodactyl/eggs/
├── autocare-postgres.json
├── autocare-mongodb.json
├── autocare-redis.json
├── autocare-backend.json
└── autocare-frontend.json
```

#### Detaillierte 5-Container Konfiguration

```
Container 1: PostgreSQL (512MB RAM, Port 5432)
Container 2: MongoDB (512MB RAM, Port 27017)
Container 3: Redis (256MB RAM, Port 6379)
Container 4: Backend API (1GB RAM, Port 5001)
Container 5: Frontend (512MB RAM, Port 3000)
```

## Netzwerk-Konfiguration

### Internal Container IPs

Pterodactyl erstellt normalerweise ein internes Netzwerk. Die Container können sich über interne IPs erreichen:

```
postgres-container: 172.18.0.2:5432
mongodb-container: 172.18.0.3:27017
redis-container: 172.18.0.4:6379
backend-container: 172.18.0.5:5001
frontend-container: 172.18.0.6:3000
```

### External Access

```
Frontend: https://yourdomain.com (Port 3000)
API: https://api.yourdomain.com (Port 5001)
```

## Automatisierte Bereitstellung

### PowerShell Deployment Script

```powershell
# deployment/deploy-pterodactyl.ps1
param(
    [string]$PterodactylApiUrl,
    [string]$ApiKey,
    [string]$DatabasePassword,
    [string]$MongoPassword,
    [string]$RedisPassword,
    [string]$JwtSecret
)

Write-Host "🚀 Starting AutoCare Advisor Pterodactyl Deployment..." -ForegroundColor Green

# 1. Create PostgreSQL Container
Write-Host "📦 Creating PostgreSQL container..." -ForegroundColor Blue
# API calls to create containers...

# 2. Create MongoDB Container
Write-Host "📦 Creating MongoDB container..." -ForegroundColor Blue

# 3. Create Redis Container
Write-Host "📦 Creating Redis container..." -ForegroundColor Blue

# 4. Wait for databases to be ready
Write-Host "⏳ Waiting for databases to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# 5. Create Backend Container
Write-Host "📦 Creating Backend API container..." -ForegroundColor Blue

# 6. Create Frontend Container
Write-Host "📦 Creating Frontend container..." -ForegroundColor Blue

Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://[your-domain]:3000" -ForegroundColor Cyan
Write-Host "🔌 API: http://[your-domain]:5001" -ForegroundColor Cyan
```

## Kubernetes vs Pterodactyl - Wann was nutzen?

### Nutze Pterodactyl wenn:

- ✅ Schnelle Bereitstellung gewünscht
- ✅ Einfache Verwaltung ausreichend
- ✅ Mittlere Projektgröße (< 10k Nutzer)
- ✅ Budget-bewusst
- ✅ Wenig DevOps-Erfahrung

### Nutze Kubernetes wenn:

- ✅ Enterprise-Anforderungen
- ✅ Auto-Scaling notwendig
- ✅ Hohe Verfügbarkeit erforderlich
- ✅ Komplexe Deployment-Pipelines
- ✅ Multi-Environment (dev/staging/prod)

## Migration Path: Pterodactyl → Kubernetes

### Phase 1: Start mit Pterodactyl

- Schnelle Markteinführung
- Erste Nutzer gewinnen
- Feedback sammeln

### Phase 2: Hybrid (Optional)

- Pterodactyl für Entwicklung
- Kubernetes für Produktion
- Graduelle Migration

### Phase 3: Full Kubernetes

- Enterprise-Features nutzen
- Vollständige Orchestrierung
- Advanced Monitoring

## Empfehlung für dich

**Jetzt sofort starten**: Nutze Pterodactyl für MVP/Markteinführung

- Alle Eggs sind fertig ✅
- Einfache 5-Container-Bereitstellung
- Schnell produktiv

**Später erweitern**: Kubernetes für Skalierung wenn nötig

- Infrastructure ready ✅
- Nahtlose Migration möglich
- Enterprise-Features verfügbar

## Nächste Schritte

Soll ich:

1. **Pterodactyl Deployment-Script** erstellen für automatische Bereitstellung?
2. **Container-Netzwerk Konfiguration** detailliert dokumentieren?
3. **Monitoring Setup** für Pterodactyl hinzufügen?
4. **CI/CD Pipeline** für automatische Container-Updates erstellen?

Was ist dein bevorzugter Ansatz? 🎯
