# 🔐 Admin Access 401 Error - Solution Guide

## 🚨 **Problem**: 401 Unauthorized on `/admin/users`

The 401 error occurs because:
1. **No admin users exist** in the database yet
2. **User doesn't have ADMIN role** (all registered users are USER role by default)

## ✅ **Solution Steps** (Wait 2-3 minutes for deployment first)

### **Step 1: Check Current Users**
```bash
curl https://e3-api-d64fcc5bd009.herokuapp.com/test/check-users
```

### **Step 2: Promote Existing User to Admin**
```bash
curl -X POST https://e3-api-d64fcc5bd009.herokuapp.com/test/promote-to-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "araujo-julio@hotmail.com"
  }'
```

### **Step 3: Login with Admin User**
```bash
curl -X POST https://e3-api-d64fcc5bd009.herokuapp.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "araujo-julio@hotmail.com",
    "password": "your_actual_password"
  }'
```

### **Step 4: Use JWT Token for Admin Endpoints**
Copy the `access_token` from login response and use it:

```bash
curl -X GET https://e3-api-d64fcc5bd009.herokuapp.com/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## 🎯 **Alternative: Create New Admin User**

If you prefer to register a new admin user:

1. **Register a new user** (will automatically be ADMIN if it's the first user):
```bash
curl -X POST https://e3-api-d64fcc5bd009.herokuapp.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@e3audio.com",
    "password": "securepassword123",
    "firstName": "Admin",
    "lastName": "User",
    "birthday": "1990-01-01"
  }'
```

## 📋 **New Test Endpoints Added:**

### **1. Check Users & Roles**
- **GET** `/test/check-users`
- Shows all users, their roles, and counts

### **2. Promote User to Admin**
- **POST** `/test/promote-to-admin`
- Body: `{"email": "user@example.com"}`

### **3. Enhanced Registration**
- First registered user automatically gets ADMIN role
- Subsequent users get USER role

## 🔄 **Complete Workflow:**

1. ✅ **Check existing users**: `/test/check-users`
2. ✅ **Promote user to admin**: `/test/promote-to-admin`
3. ✅ **Login with admin user**: `/auth/login`
4. ✅ **Access admin endpoints**: `/admin/users` with JWT token

## 📊 **Expected Results:**

After promotion and login, you should get:
```json
{
  "user": {
    "id": "...",
    "email": "araujo-julio@hotmail.com",
    "role": "ADMIN"
  },
  "access_token": "eyJ..."
}
```

Then admin endpoints will work:
```json
[
  {
    "id": "...",
    "email": "user1@example.com",
    "firstName": "User",
    "lastName": "One",
    "role": "USER"
  }
]
```

## 🛠️ **Update Postman Collection:**

Add these new endpoints to your Postman collection:
- `GET /test/check-users`
- `POST /test/promote-to-admin`

The 401 error will be resolved once you have an admin user and proper JWT token! 🎯
