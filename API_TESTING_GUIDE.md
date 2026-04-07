# API Testing Guide - Admin Authentication

## Quick Start

### 1. Start the Server
```bash
npm run start:dev
```
Server runs on: `http://localhost:3000`

---

## API Endpoints

### 1. Register Admin
**Endpoint:** `POST /admin/register`  
**Authentication:** ❌ Not required  
**Body:**
```json
{
  "name": "John Admin",
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "message": "Admin registered successfully",
  "admin": {
    "id": 1,
    "name": "John Admin",
    "email": "admin@example.com",
    "password": "hashed_password_here",
    "token": null
  }
}
```

**Error (400):** Email already exists

---

### 2. Login Admin
**Endpoint:** `POST /admin/login`  
**Authentication:** ❌ Not required  
**Body:**
```json
{
  "email": "admin@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "message": "Admin logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "name": "John Admin",
    "email": "admin@example.com",
    "password": "hashed_password",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error (401):** Invalid email or password

---

### 3. Get Admin Profile
**Endpoint:** `GET /admin/profile`  
**Authentication:** ✅ **Required** (use token from login)  
**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Admin",
  "email": "admin@example.com",
  "password": "hashed_password",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401):** No token provided / Token verification failed / Invalid token

---

## Using Postman or Thunder Client

### Step 1: Register
1. Create new POST request
2. URL: `http://localhost:3000/admin/register`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "name": "Test Admin",
  "email": "test@example.com",
  "password": "password123"
}
```
5. Send

### Step 2: Login
1. Create new POST request
2. URL: `http://localhost:3000/admin/login`
3. Headers: `Content-Type: application/json`
4. Body:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
5. Send
6. **Copy the token from response**

### Step 3: Get Profile
1. Create new GET request
2. URL: `http://localhost:3000/admin/profile`
3. Headers: 
   - `Authorization: Bearer <paste-token-here>`
   - `Content-Type: application/json`
4. Send

---

## Using CURL

### Register
```bash
curl -X POST http://localhost:3000/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile (replace TOKEN)
```bash
curl -X GET http://localhost:3000/admin/profile \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## Key Points

✅ **Register**: No auth needed, stores password hashed with bcrypt  
✅ **Login**: Returns JWT token, stores it in database  
✅ **Profile**: Requires valid token, middleware validates it against DB  

⚠️ **Token Format**: Must be sent as `Authorization: Bearer <token>`  
⚠️ **Token Expiry**: 7 days (configurable in admin.module.ts)  
⚠️ **Token Storage**: Both in response AND database for security  

---

## What Happens Behind the Scenes

1. **Register**
   - Validates email/password
   - Hashes password with bcrypt
   - Saves to database
   - Token field is null

2. **Login**
   - Finds admin by email
   - Verifies password hash matches
   - Creates JWT with email and id
   - Saves token to database
   - Returns token to client

3. **Profile (with middleware)**
   - Middleware extracts token from header
   - Verifies JWT signature (JWT secret check)
   - Checks if token exists in database
   - Attaches admin data to request
   - Controller accesses via `req.user`

---

## Security Flow

```
Plaintext Password → bcrypt Hashing (10 rounds) → Stored in DB
                 ↓
            Login Request
                 ↓
Password Comparison ← bcrypt.compare(plaintext, hash)
                 ↓
       JWT Token Generated (email + id)
                 ↓
         Token Saved in DB + Returned to Client
                 ↓
      Subsequent Requests (with token in header)
                 ↓
    Middleware Verifies JWT Signature + DB Check
                 ↓
         Access Granted / Denied
```

---

## Next Steps

After verifying these 3 routes work:
- Add more routes for CRUD operations (create, read, update, delete)
- Implement similar auth for other user types
- Add logout endpoint (clears token from DB)
- Add email verification
- Implement refresh tokens
