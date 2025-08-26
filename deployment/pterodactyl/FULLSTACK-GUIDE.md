# AutoCare Advisor - Vereinfachtes 4-Container Deployment

## 🎯 **Optimales Setup: 4 Container statt 5**

### Warum Full-Stack Container?

- ✅ **Einfacher**: Ein Container für Frontend + Backend
- ✅ **Weniger Verwaltung**: Nur 4 statt 5 Container
- ✅ **Bessere Performance**: Nginx als Reverse Proxy integriert
- ✅ **Kostengünstiger**: Weniger RAM-Verbrauch
- ✅ **Einheitliche Logs**: Alle App-Logs in einem Container

## 🚀 **Container-Architektur**

```
Container 1: PostgreSQL     (512MB RAM, Port 5432)
Container 2: MongoDB        (512MB RAM, Port 27017)
Container 3: Redis          (256MB RAM, Port 6379)
Container 4: Full-Stack App (1.5GB RAM, Port 80)
    ├── Next.js Frontend (intern Port 3000)
    ├── Express Backend  (intern Port 5001)
    ├── Nginx Proxy      (extern Port 80)
    └── Supervisor       (Process Manager)
```

## 📋 **Deployment-Reihenfolge**

### 1. Database Container starten

```bash
# PostgreSQL
Egg: autocare-postgres.json
Environment: POSTGRES_USER=autocare_user, POSTGRES_PASSWORD=[secure], POSTGRES_DB=autocare_db

# MongoDB
Egg: autocare-mongodb.json
Environment: MONGO_INITDB_ROOT_USERNAME=autocare_mongo, MONGO_INITDB_ROOT_PASSWORD=[secure]

# Redis
Egg: autocare-redis.json
Environment: REDIS_PASSWORD=[secure]
```

### 2. Full-Stack Application

```bash
# AutoCare Full-Stack
Egg: autocare-fullstack.json
Environment:
- DATABASE_URL=postgresql://autocare_user:[pass]@[postgres-ip]:5432/autocare_db
- MONGODB_URI=mongodb://autocare_mongo:[pass]@[mongodb-ip]:27017/autocare_products
- REDIS_URL=redis://:[pass]@[redis-ip]:6379/0
- JWT_SECRET=[64-char-random-string]
- CORS_ORIGIN=https://yourdomain.com

Files to upload:
├── backend/     (Express.js API files)
└── frontend/    (Next.js React files)
```

## 🌐 **Routing & URLs**

### Public Access

```
https://yourdomain.com/          → Next.js Frontend
https://yourdomain.com/api/      → Express.js API
https://yourdomain.com/health    → Health Check
```

### Internal Services

```
127.0.0.1:3000  → Next.js (intern)
127.0.0.1:5001  → Express.js (intern)
127.0.0.1:80    → Nginx Proxy (extern)
```

## 🔧 **Full-Stack Container Features**

### Process Management (Supervisor)

```bash
nginx     → Reverse Proxy & Static Files
backend   → Express.js API Server
frontend  → Next.js Application Server
```

### Logging

```bash
/app/logs/nginx_access.log    → Web Server Access
/app/logs/nginx_error.log     → Web Server Errors
/app/logs/backend.log         → API Application Logs
/app/logs/frontend.log        → Frontend Build/Runtime
/app/logs/supervisord.log     → Process Manager
```

### Health Monitoring

```bash
# Supervisor Web Interface (optional)
http://localhost:9001

# Application Health Check
curl http://localhost/health
```

## 🆚 **4-Container vs 5-Container Vergleich**

| Feature           | 4-Container    | 5-Container        |
| ----------------- | -------------- | ------------------ |
| **Komplexität**   | ⭐⭐⭐ Einfach | ⭐⭐ Mittel        |
| **RAM Verbrauch** | ~2.75GB        | ~3.25GB            |
| **Verwaltung**    | 4 Container    | 5 Container        |
| **Netzwerk**      | Einfacher      | Mehr Konfiguration |
| **Deployment**    | Schneller      | Mehr Schritte      |
| **Flexibilität**  | ⭐⭐ Gut       | ⭐⭐⭐ Sehr gut    |
| **Skalierung**    | Begrenzt       | Einzeln skalierbar |

## 🎯 **Empfehlung**

### Nutze 4-Container wenn:

- ✅ Einfache Bereitstellung gewünscht
- ✅ Wenig DevOps-Erfahrung
- ✅ Kostenbewusst (weniger RAM)
- ✅ MVP/Prototyp Phase
- ✅ Mittlere Nutzerlast (<1k concurrent)

### Nutze 5-Container wenn:

- ✅ Maximale Flexibilität erforderlich
- ✅ Separate Skalierung von Frontend/Backend
- ✅ Komplexe CI/CD Pipeline
- ✅ Hohe Nutzerlast (>1k concurrent)
- ✅ A/B Testing verschiedener Versionen

## 🚀 **Schnell-Start Anleitung**

### Schritt 1: Eggs importieren

```bash
1. autocare-postgres.json → Pterodactyl Admin Panel
2. autocare-mongodb.json → Pterodactyl Admin Panel
3. autocare-redis.json → Pterodactyl Admin Panel
4. autocare-fullstack.json → Pterodactyl Admin Panel
```

### Schritt 2: Container erstellen

```bash
1. PostgreSQL Container erstellen & starten
2. MongoDB Container erstellen & starten
3. Redis Container erstellen & starten
4. Interne IPs notieren (z.B. 172.18.0.2, 172.18.0.3, 172.18.0.4)
5. Full-Stack Container erstellen mit korrekten Database URLs
6. Backend & Frontend Ordner hochladen
7. Container starten
```

### Schritt 3: Testen

```bash
# Health Check
curl http://[container-ip]/health

# Frontend
curl http://[container-ip]/

# API Test
curl http://[container-ip]/api/health
```

## 🔧 **Troubleshooting**

### Container startet nicht

```bash
# Logs prüfen
docker logs [container-id]

# Supervisor Status
docker exec [container-id] supervisorctl status

# Service einzeln starten
docker exec [container-id] supervisorctl start backend
```

### Database Connection Fehler

```bash
# Netzwerk-Konnektivität testen
docker exec [fullstack-container] nc -z [postgres-ip] 5432
docker exec [fullstack-container] nc -z [mongodb-ip] 27017
docker exec [fullstack-container] nc -z [redis-ip] 6379

# Environment Variables prüfen
docker exec [container-id] env | grep DATABASE_URL
```

### Frontend lädt nicht

```bash
# Build Status prüfen
docker exec [container-id] ls -la /app/frontend/.next/

# Frontend Logs
docker exec [container-id] tail -f /app/logs/frontend.log

# Nginx Configuration
docker exec [container-id] nginx -t
```

## ⚡ **Performance Tuning**

### Nginx Optimierung

- Gzip Kompression aktiviert ✅
- Static File Caching
- Connection Pooling
- Load Balancing ready

### Application Optimierung

- Next.js Production Build ✅
- Express.js Cluster Mode (optional)
- Database Connection Pooling
- Redis Session Store

### Resource Limits

```bash
# Empfohlene Container-Limits
PostgreSQL: 512MB RAM, 1 CPU
MongoDB: 512MB RAM, 1 CPU
Redis: 256MB RAM, 0.5 CPU
Full-Stack: 1.5GB RAM, 2 CPU
```

**Total: ~2.75GB RAM, 4.5 CPU für komplette Application**

Das ist deutlich effizienter als die 5-Container Lösung! 🎯
