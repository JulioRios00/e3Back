# Luthiers Shop API

A NestJS application for managing a luthier's shop with user registration and admin functionality.

## Features

- 🎸 User registration and authentication
- 👤 JWT-based authentication
- 👑 Admin panel for user management
- 🎂 Birthday notifications system
- 🐘 PostgreSQL database with Prisma ORM
- 🐳 Docker containerization
- ⏰ Scheduled tasks for birthday notifications

## Quick Start

### Using Docker (Recommended)

1. Clone the repository
2. Copy environment variables:
  ```bash
  cp .env.example .env
  ```

3. Start the development environment:
  ```bash
  npm run docker:dev
  ```

4. The API will be available at `http://localhost:3000`

### Manual Setup

1. Install dependencies:
  ```bash
  npm install
  ```

2. Start PostgreSQL database:
  ```bash
  npm run docker:db
  ```

3. Run database migrations:
  ```bash
  npm run prisma:migrate
  ```

4. Seed the database:
  ```bash
  npm run prisma:seed
  ```

5. Start the application:
  ```bash
  npm run start:dev
  ```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get current user profile (requires auth)

### Admin (requires admin role)
- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user by ID
- `GET /admin/birthdays/today` - Get today's birthdays
- `GET /admin/birthdays/upcoming?days=7` - Get upcoming birthdays

## Default Credentials

- **Admin**: admin@luthiersshop.com / admin123
- **User**: john.doe@example.com / user123

## Environment Variables

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/luthiers_shop?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV=development
```

## Docker Commands

```bash
# Development
npm run docker:dev

# Production
npm run docker:prod

# Database only
npm run docker:db

# Stop all containers
docker-compose down

# View logs
docker-compose logs -f app-dev
```

## Database Management

```bash
# Generate Prisma client
npm run prisma:generate

# Create and run migration
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Open Prisma Studio
npm run prisma:studio
```
