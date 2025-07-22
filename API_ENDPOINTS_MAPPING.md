# E3Audio API - Endpoints Mapping for Frontend Integration

## Base Information
- **API Base URL (Development)**: `http://localhost:3000`
- **API Base URL (Production)**: `https://e3-api-d64fcc5bd009.herokuapp.com`
- **API Name**: E3Audio API
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT Bearer Token
- **Hosting**: Heroku

## Global Configuration
- **CORS**: Enabled
- **Global Validation**: Enabled with whitelist and transform
- **Content-Type**: `application/json`

---

## 🔐 Authentication Endpoints

### Base Route: `/auth`

#### 1. Register User
- **Method**: `POST`
- **Endpoint**: `/auth/register`
- **Description**: Create a new user account
- **Authentication**: None required
- **Request Body**:
```typescript
{
  email: string;           // Valid email format
  password: string;        // Minimum 6 characters
  firstName: string;       // Required
  lastName: string;        // Required
  phone?: string;          // Optional
  birthday: string;        // ISO date string (YYYY-MM-DD)
}
```
- **Response**: User object with JWT token
- **Status Codes**: 
  - `201`: User created successfully
  - `400`: Validation error
  - `409`: Email already exists

#### 2. Login User
- **Method**: `POST`
- **Endpoint**: `/auth/login`
- **Description**: Authenticate user and get JWT token
- **Authentication**: None required
- **Request Body**:
```typescript
{
  email: string;     // Valid email format
  password: string;  // User password
}
```
- **Response**: 
```typescript
{
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    birthday: string;
    role: "USER" | "ADMIN";
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
}
```
- **Status Codes**:
  - `200`: Login successful
  - `401`: Invalid credentials
  - `400`: Validation error

#### 3. Get User Profile
- **Method**: `GET`
- **Endpoint**: `/auth/profile`
- **Description**: Get current authenticated user's profile
- **Authentication**: JWT Bearer Token required
- **Headers**: 
```
Authorization: Bearer <jwt_token>
```
- **Response**: Current user object
- **Status Codes**:
  - `200`: Profile retrieved successfully
  - `401`: Unauthorized (invalid/expired token)

---

## 👨‍💼 Admin Endpoints

### Base Route: `/admin`
**Note**: All admin endpoints require:
- JWT Bearer Token authentication
- User role must be `ADMIN`

#### 1. Get All Users
- **Method**: `GET`
- **Endpoint**: `/admin/users`
- **Description**: Retrieve all users in the system
- **Authentication**: Admin JWT required
- **Headers**: 
```
Authorization: Bearer <admin_jwt_token>
```
- **Response**: Array of user objects
- **Status Codes**:
  - `200`: Users retrieved successfully
  - `401`: Unauthorized
  - `403`: Forbidden (not admin role)

#### 2. Get User by ID
- **Method**: `GET`
- **Endpoint**: `/admin/users/:id`
- **Description**: Retrieve specific user by ID
- **Authentication**: Admin JWT required
- **Path Parameters**:
  - `id`: User ID (string)
- **Headers**: 
```
Authorization: Bearer <admin_jwt_token>
```
- **Response**: Single user object
- **Status Codes**:
  - `200`: User retrieved successfully
  - `404`: User not found
  - `401`: Unauthorized
  - `403`: Forbidden (not admin role)

#### 3. Get Today's Birthdays
- **Method**: `GET`
- **Endpoint**: `/admin/birthdays/today`
- **Description**: Get users with birthdays today
- **Authentication**: Admin JWT required
- **Headers**: 
```
Authorization: Bearer <admin_jwt_token>
```
- **Response**: Array of users with birthdays today
- **Status Codes**:
  - `200`: Birthdays retrieved successfully
  - `401`: Unauthorized
  - `403`: Forbidden (not admin role)

#### 4. Get Upcoming Birthdays
- **Method**: `GET`
- **Endpoint**: `/admin/birthdays/upcoming`
- **Description**: Get users with upcoming birthdays
- **Authentication**: Admin JWT required
- **Query Parameters**:
  - `days`: Number of days to look ahead (optional, default: 7)
- **Example**: `/admin/birthdays/upcoming?days=14`
- **Headers**: 
```
Authorization: Bearer <admin_jwt_token>
```
- **Response**: Array of users with upcoming birthdays
- **Status Codes**:
  - `200`: Upcoming birthdays retrieved successfully
  - `401`: Unauthorized
  - `403`: Forbidden (not admin role)

---

## 📊 Data Models

### User Model
```typescript
interface User {
  id: string;              // Unique identifier (cuid)
  email: string;           // Unique email
  password: string;        // Hashed password (not returned in responses)
  firstName: string;       // User's first name
  lastName: string;        // User's last name
  phone?: string;          // Optional phone number
  birthday: Date;          // User's birthday
  role: "USER" | "ADMIN";  // User role enum
  isActive: boolean;       // Account status
  createdAt: Date;         // Account creation timestamp
  updatedAt: Date;         // Last update timestamp
}
```

### Role Enum
```typescript
enum Role {
  USER = "USER",
  ADMIN = "ADMIN"
}
```

---

## 🔒 Authentication & Authorization

### JWT Token Usage
1. **Obtain Token**: Login via `/auth/login`
2. **Include in Headers**: All protected endpoints require:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. **Token Validation**: Server validates token on each protected request

### Role-Based Access Control
- **USER role**: Can access own profile (`/auth/profile`)
- **ADMIN role**: Can access all admin endpoints (`/admin/*`) + user endpoints

---

## 🚀 Frontend Integration Examples

### JavaScript/TypeScript Examples

#### 1. User Registration
```typescript
const registerUser = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  birthday: string;
}) => {
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  
  return response.json();
};
```

#### 2. User Login
```typescript
const loginUser = async (email: string, password: string) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  // Store the token for future requests
  localStorage.setItem('token', data.access_token);
  return data;
};
```

#### 3. Authenticated Request Example
```typescript
const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/auth/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
};
```

#### 4. Admin Request Example
```typescript
const getAllUsers = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch('/admin/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  
  return response.json();
};
```

---

## 🛠 Development Notes

### Environment Setup
- **Port**: 3000 (configurable via `PORT` environment variable)
- **Database**: PostgreSQL with Prisma
- **Package Manager**: pnpm

### Running the API
```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run start:prod

# With Docker
pnpm run docker:up
```

### Key Dependencies
- NestJS framework
- Prisma ORM
- JWT authentication
- Class validation
- CORS enabled
- bcryptjs for password hashing

---

## 📝 Error Handling

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

### Error Response Format
```typescript
{
  statusCode: number;
  message: string | string[];
  error?: string;
}
```

---

## 🔄 Next Steps for Frontend Integration

1. **Set up API client** with base URL configuration
2. **Implement authentication flow** with token storage
3. **Create API service functions** for each endpoint
4. **Handle error states** and loading states
5. **Implement role-based UI** for admin features
6. **Add form validation** matching backend DTOs
7. **Test all endpoints** with different user roles

---

## 📊 Error Monitoring & Logging

### Sentry Integration (Free Tier Available)
This API includes **Sentry** integration for real-time error monitoring:

- **Free Tier**: 5,000 errors/month, 30-day history
- **Features**: Real-time error tracking, stack traces, performance monitoring
- **Setup**: Already integrated, just add your `SENTRY_DSN` to environment variables

#### Environment Setup
Add to your `.env` file:
```bash
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
NODE_ENV=production  # or development
```

#### Get Your Sentry DSN
1. Go to [sentry.io](https://sentry.io) and create a free account
2. Create a new **Node.js** project
3. Copy your DSN from the project settings
4. Add it to your `.env` file

#### Error Tracking Features
- **Automatic error capture** for unhandled exceptions
- **Registration errors** with user context (email, name)
- **Authentication failures** tracking
- **Performance monitoring** for API endpoints
- **Real-time alerting** via email/Slack

### Alternative Free Logging Services
- **LogRocket** (1,000 sessions/month)
- **Rollbar** (5,000 errors/month) 
- **Bugsnag** (2,000 errors/month)

This mapping provides everything needed to integrate your frontend application with the E3Audio API backend service.
