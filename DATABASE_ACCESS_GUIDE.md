# 🗄️ Heroku Postgres Database Access Guide

## Option 1: Heroku CLI Database Access (Recommended)

### Install Heroku CLI (if not already installed)
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

### Connect to Database via Heroku CLI
```bash
# Login to Heroku
heroku login

# Connect to your database directly
heroku pg:psql --app e3-api

# Or get database info
heroku pg:info --app e3-api

# Run specific SQL commands
heroku pg:psql --app e3-api --command "SELECT * FROM users LIMIT 5;"

# Get database credentials
heroku config:get DATABASE_URL --app e3-api
```

## Option 2: DBeaver with Proper SSL Configuration

### Connection Settings:
- **Host**: c7itisjfjj8ril.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com
- **Port**: 5432
- **Database**: da0u3kpr2937jk
- **Username**: u3oq5073vesemp
- **Password**: pb687632521d6a05bfbb6762c44a45e6761f7dd930a32349f1b98a11e50b1b138

### SSL Configuration (Required):
1. **SSL Tab**:
   - ✅ Use SSL
   - SSL Mode: `require`
   - SSL Factory: Default

2. **Driver Properties Tab**:
   - Add property: `ssl` = `true`
   - Add property: `sslmode` = `require`
   - Add property: `sslrootcert` = `allow` (if needed)

### Connection URL Format:
```
jdbc:postgresql://c7itisjfjj8ril.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/da0u3kpr2937jk?ssl=true&sslmode=require
```

## Option 3: pgAdmin Configuration

### Connection Settings:
1. **General Tab**:
   - Name: E3Audio Production DB
   - Host: c7itisjfjj8ril.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com
   - Port: 5432
   - Database: da0u3kpr2937jk
   - Username: u3oq5073vesemp
   - Password: pb687632521d6a05bfbb6762c44a45e6761f7dd930a32349f1b98a11e50b1b138

2. **SSL Tab**:
   - SSL Mode: Require
   - Client Certificate: Not required for Heroku

## Option 4: Command Line psql

```bash
# Connect using psql (if you have PostgreSQL client installed)
psql "postgres://u3oq5073vesemp:pb687632521d6a05bfbb6762c44a45e6761f7dd930a32349f1b98a11e50b1b138@c7itisjfjj8ril.cluster-czrs8kj4isg7.us-east-1.rds.amazonaws.com:5432/da0u3kpr2937jk?sslmode=require"
```

## Database Schema Commands

Once connected, you can explore your E3Audio database:

```sql
-- List all tables
\dt

-- Check users table structure
\d users

-- View some user data
SELECT id, email, "firstName", "lastName", role, "createdAt" FROM users LIMIT 5;

-- Check database size
SELECT pg_size_pretty(pg_database_size('da0u3kpr2937jk'));

-- View active connections
SELECT * FROM pg_stat_activity WHERE datname = 'da0u3kpr2937jk';
```

## Security Notes

⚠️ **Important**: 
- Never commit database credentials to version control
- Use environment variables in your application
- Heroku automatically rotates these credentials periodically
- Always use SSL connections for production databases

## Troubleshooting

### If SSL connection still fails:
1. Check if your network allows outbound connections on port 5432
2. Try using `sslmode=disable` temporarily (NOT recommended for production)
3. Update DBeaver to the latest version
4. Use Heroku CLI as a fallback option

### Get fresh database credentials:
```bash
# In case credentials change
heroku config:get DATABASE_URL --app e3-api
```
