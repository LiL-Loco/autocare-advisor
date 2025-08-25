# 🗄️ Database Configuration

## PostgreSQL Setup

- **Type**: Lokale PostgreSQL Installation (NICHT Docker)
- **Host**: localhost
- **Port**: 5432
- **Database**: autocare_dev
- **User**: postgres

## Database Connection

- Backend connects to: `postgresql://postgres:password@localhost:5432/autocare_dev`
- No Docker containers for database
- Direct local PostgreSQL service

## Important Notes

- ⚠️ **ALWAYS use local PostgreSQL, not Docker containers**
- Users table contains admin and partner accounts
- Password hashing with bcrypt
- Separate login endpoints for admin/partner

## Test Users

- Admin: admin@autocare.de / admin123
- Partner: partner@example.com / partner123

## Database Commands

```bash
# Connect to local PostgreSQL:
psql -U postgres -d autocare_dev

# List users:
SELECT email, role, first_name FROM users;
```
