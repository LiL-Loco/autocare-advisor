# 🚀 VS Code Tasks - AutoCare Advisor Shared Services

## 📋 Überarbeitete VS Code Tasks für Shared Database Setup

Die VS Code Tasks wurden an das neue **shared services** Setup angepasst, das vorhandene PostgreSQL, Redis und MongoDB Container von anderen Projekten nutzt.

## 🆕 Neue und Geänderte Tasks:

### 🚀 Development Tasks

| Task                             | Beschreibung                                        | Änderung     |
| -------------------------------- | --------------------------------------------------- | ------------ |
| **🚀 Start Development Servers** | Startet Backend, Frontend und prüft Shared Services | ✅ Updated   |
| **Backend Server**               | Startet Backend auf Port 5001                       | ✅ No change |
| **Frontend Server**              | Startet Frontend mit `npm run dev` auf Port 5000    | ✅ Updated   |
| **Check Shared Services**        | Zeigt Status der shared database services           | ✅ New       |

### 🔍 Database Management Tasks

| Task                               | Beschreibung                             | Container              |
| ---------------------------------- | ---------------------------------------- | ---------------------- |
| **🔍 Check Database Status**       | Zeigt alle Database Container und Status | All                    |
| **🗄️ Database Shell - PostgreSQL** | Öffnet PostgreSQL Shell                  | `sync-postgres-simple` |
| **🗄️ Database Shell - MongoDB**    | Öffnet MongoDB Shell                     | `autocare-mongodb`     |
| **🗄️ Database Shell - Redis**      | Öffnet Redis CLI                         | `sync-redis-simple`    |

### 🐳 Docker Tasks

| Task                         | Beschreibung                             | Verwendung     |
| ---------------------------- | ---------------------------------------- | -------------- |
| **🐳 Start Shared Services** | Startet zusätzliche Services falls nötig | Backup MongoDB |
| **🔍 Check Database Status** | Zeigt Container Status                   | Monitoring     |

## 🎯 Usage Examples:

### 1. Standard Development Start

```
Ctrl+Shift+P → "Tasks: Run Task" → "🚀 Start Development Servers"
```

**Was passiert:**

- ✅ Prüft shared database services
- ✅ Startet Backend Server (Port 5001)
- ✅ Startet Frontend Server (Port 5000)

### 2. Database Status Check

```
Ctrl+Shift+P → "Tasks: Run Task" → "🔍 Check Database Status"
```

**Output:**

```
NAMES                  STATUS                   PORTS
autocare-mongodb       Up 7 minutes (healthy)   0.0.0.0:27017->27017/tcp
sync-redis-simple      Up 10 hours              0.0.0.0:6379->6379/tcp
sync-postgres-simple   Up 10 hours              0.0.0.0:5432->5432/tcp
```

### 3. Database Access

```
# PostgreSQL Shell
Ctrl+Shift+P → "🗄️ Database Shell - PostgreSQL"

# MongoDB Shell
Ctrl+Shift+P → "🗄️ Database Shell - MongoDB"

# Redis CLI
Ctrl+Shift+P → "🗄️ Database Shell - Redis"
```

## 🔧 Configuration Details:

### Shared Services Configuration:

- **PostgreSQL**: `sync-postgres-simple` (Port 5432, DB: `autocare_dev`)
- **Redis**: `sync-redis-simple` (Port 6379)
- **MongoDB**: `autocare-mongodb` (Port 27017, DB: `autocare_products_dev`)

### Task Dependencies:

- **🚀 Start Development Servers** → Depends on: Backend, Frontend, Check Shared Services
- **🗄️ Database Reset** → Depends on: 🔍 Check Database Status
- **🗄️ Database Seed** → Depends on: 🔍 Check Database Status

## ✅ Advantages:

- **✅ No Port Conflicts** - Uses existing services
- **✅ Resource Efficient** - Shared database containers
- **✅ Quick Status Check** - Visual container status
- **✅ Easy Database Access** - Direct shell access tasks
- **✅ Automated Checks** - Dependency validation

## 🔄 Migration Summary:

| Old Approach                                  | New Approach                     |
| --------------------------------------------- | -------------------------------- |
| `docker-compose up -d postgres mongodb redis` | Uses existing containers         |
| `npm start` (Frontend)                        | `npm run dev` (Development mode) |
| Manual container checking                     | Automated status tasks           |
| Individual service startup                    | Shared service verification      |

Die Tasks sind jetzt optimal für das shared services Setup konfiguriert! 🎯
