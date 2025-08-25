# 🚀 AutoCare Advisor - Shared Development Setup

## 📊 Current Database Configuration

Das AutoCare Advisor-Projekt nutzt **shared database services** mit anderen Projekten, um Ressourcen zu sparen und Port-Konflikte zu vermeiden.

### 🗄️ Aktuelle Services:

| Service    | Container              | Port  | Database                | Status       |
| ---------- | ---------------------- | ----- | ----------------------- | ------------ |
| PostgreSQL | `sync-postgres-simple` | 5432  | `autocare_dev`          | ✅ Shared    |
| Redis      | `sync-redis-simple`    | 6379  | -                       | ✅ Shared    |
| MongoDB    | `autocare-mongodb`     | 27017 | `autocare_products_dev` | ✅ Dedicated |

### 🔗 Connection Strings:

```env
# PostgreSQL (shared)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/autocare_dev

# MongoDB (dedicated AutoCare container)
MONGODB_URI=mongodb://localhost:27017/autocare_products_dev

# Redis (shared)
REDIS_URL=redis://localhost:6379
```

## 🚀 Development Workflow

### 1. Services Status Check

```bash
# Check running containers
docker ps | findstr -E "(postgres|redis|mongo)"

# Verify databases
docker exec -it sync-postgres-simple psql -U postgres -l
docker exec -it autocare-mongodb mongosh --eval "show dbs"
```

### 2. Start AutoCare Development

```bash
# 1. Backend (uses shared services)
cd backend && npm run dev
# ✅ Runs on http://localhost:5001

# 2. Frontend
cd frontend && npm run dev
# ✅ Runs on http://localhost:5000
```

### 3. Database Management

**PostgreSQL Admin:**

```bash
# Connect to PostgreSQL
docker exec -it sync-postgres-simple psql -U postgres -d autocare_dev

# List AutoCare tables
\dt
```

**MongoDB Admin:**

```bash
# MongoDB Shell
docker exec -it autocare-mongodb mongosh autocare_products_dev

# Show collections
show collections
```

**Redis Admin:**

```bash
# Redis CLI
docker exec -it sync-redis-simple redis-cli

# Check AutoCare keys
KEYS autocare:*
```

## 🔧 Alternative Setups

### Option A: Dedicated Services (if conflicts occur)

Use different ports for dedicated AutoCare services:

```yaml
# docker-compose.dedicated.yml
services:
  postgres:
    ports:
      - '5433:5432' # Different port
  redis:
    ports:
      - '6380:6379' # Different port
```

### Option B: Database Namespacing

Keep shared services but use prefixed keys/schemas:

```env
# PostgreSQL with schema
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/autocare_dev?schema=autocare

# Redis with prefix
REDIS_KEY_PREFIX=autocare:

# MongoDB with collection prefix
MONGODB_COLLECTION_PREFIX=autocare_
```

## 📋 Advantages of Shared Setup:

✅ **Resource Efficient** - Less memory and CPU usage  
✅ **No Port Conflicts** - Uses established services  
✅ **Faster Startup** - No need to start additional containers  
✅ **Simplified Development** - Single database instance for multiple projects  
✅ **Consistent Data** - Can share reference data between projects

## ⚠️ Considerations:

- **Data Isolation**: Use different database names/schemas
- **Resource Contention**: Monitor performance with multiple projects
- **Schema Conflicts**: Ensure no table name collisions
- **Backup Strategy**: Consider project-specific backup needs

## 🧪 Testing the Setup:

```bash
# 1. Test Backend Health
curl http://localhost:5001/api/health

# 2. Test Database Connections
npm run test:db  # (when implemented)

# 3. Check Service Dependencies
docker exec autocare-mongodb mongosh --eval "db.runCommand('ping')"
docker exec sync-postgres-simple pg_isready -U postgres
docker exec sync-redis-simple redis-cli ping
```

This setup provides optimal development efficiency while maintaining proper isolation! 🎯
