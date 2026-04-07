# JWT Authentication Implementation Log

## Overview
This document explains the JWT authentication implementation for the Kuratoli Grocer project. The system allows admins to register, login, and access their profile using JWT tokens stored in the database.

---

## What Was Done

### 1. **Added Token Column to All User Tables**
   - **Files Modified**: 
     - `src/admin/entities/admin.entity.ts`
     - `src/manager/entities/manager.entity.ts`
     - `src/seller/entities/seller.entity.ts`
     - `src/customer/entities/customer.entity.ts`
   
   - **Changes**: Added `token` column (nullable string) to each entity
   - **Why**: To store JWT tokens in the database for token validation during requests

### 2. **Created Login DTO**
   - **File**: `src/admin/dto/login.dto.ts`
   - **Contains**: 
     - `email` (required, must be valid email)
     - `password` (required, string)
   - **Why**: To validate login form data

### 3. **Updated Admin DTO**
   - **File**: `src/admin/dto/admin.dto.ts`
   - **Added**: 
     - `token` (optional, string) - for registration response and other operations
   - **Why**: To include token in responses and DTOs

### 4. **Created Authentication Middleware**
   - **File**: `src/admin/auth.middleware.ts`
   - **What It Does**:
     1. Extracts JWT token from Authorization header (Bearer token)
     2. Verifies token using JwtService
     3. Checks if token exists in database for the admin
     4. Attaches admin data to request object (`req.user`)
     5. Throws UnauthorizedException if token is invalid or not in DB
   
   - **Why Use Middleware Instead of Guards**:
     - Middleware runs globally on routes
     - Easier to apply to multiple routes at once
     - More straightforward for simple token validation
     - Cleaner approach for your use case

### 5. **Updated Admin Service**
   - **File**: `src/admin/admin.service.ts`
   - **Methods Implemented**:
     
     a. **register(adminDto: AdminDto)**
        - Checks if email already exists
        - Hashes password using bcrypt (10 rounds)
        - Creates new admin in database
        - Returns success message and admin data
     
     b. **login(loginDto: LoginDto)**
        - Finds admin by email
        - Compares password using bcrypt
        - Generates JWT token with email and id
        - **Stores token in database** (as per your requirement)
        - Returns token and admin data
     
     c. **getProfile(admin: Admin)**
        - Simply returns the admin data attached by middleware
        - This endpoint requires middleware (authentication)

### 6. **Updated Admin Controller**
   - **File**: `src/admin/admin.controller.ts`
   - **Routes Created**:
     
     a. **POST /admin/register**
        - No authentication needed
        - Body: `{ name, email, password }`
        - Returns: `{ message, admin }`
     
     b. **POST /admin/login**
        - No authentication needed
        - Body: `{ email, password }`
        - Returns: `{ message, token, admin }`
     
     c. **GET /admin/profile**
        - **Requires authentication** (middleware applies here)
        - Header: `Authorization: Bearer <token>`
        - Returns: admin profile data

### 7. **Updated Admin Module**
   - **File**: `src/admin/admin.module.ts`
   - **Imports Added**:
     - `TypeOrmModule.forFeature([Admin])` - for database access
     - `JwtModule.register()` - for JWT signing/verifying
     - `PassportModule` - for authentication strategy
     - `MailerModule` - for bonus email feature
   
   - **Middleware Configuration**:
     - Applied `AuthMiddleware` to `/admin/profile` route only
     - Register and login routes don't use middleware
   
   - **Exports**: AdminService and JwtModule for use in other modules

### 8. **Updated Database Structure**
   - **File**: `DBstructure.txt`
   - **Added token column (nullable)** to:
     - admins table
     - managers table
     - sellers table
     - customers table

---

## How It Works

### Registration Flow
```
Client -> POST /admin/register 
       -> Validate email/password
       -> Hash password
       -> Save admin in DB
       -> Return admin data
```

### Login Flow
```
Client -> POST /admin/login
       -> Find admin by email
       -> Compare password with hash
       -> Generate JWT token
       -> Save token in DB
       -> Return token to client
```

### Authenticated Request Flow
```
Client -> GET /admin/profile
       -> Add header: Authorization: Bearer <token>
       -> Middleware extracts token
       -> Middleware verifies JWT signature
       -> Middleware checks token in DB
       -> Middleware attaches admin to request
       -> Controller returns admin profile
```

---

## Security Implementation

### Password Hashing
- Uses **bcrypt** with 10 rounds
- Never stores plain text passwords
- Password verified during login

### JWT Token
- Generated with: `email` and `sub` (admin id)
- Expires in: 7 days
- Secret key: `your-secret-key` (use environment variable in production)

### Token Storage
- Generated token stored in database `token` column
- On each request, middleware verifies token matches DB
- Prevents using old/revoked tokens
- If admin logs out (future feature), token can be cleared in DB

### HTTP Exceptions
- Throws `HttpException` on:
  - Duplicate email during registration
  - Invalid email/password during login
  - Missing/invalid token during profile access

---

## Testing the API

### 1. Register Admin
```bash
POST http://localhost:3000/admin/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST http://localhost:3000/admin/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response includes token** - copy this token

### 3. Get Profile (with token)
```bash
GET http://localhost:3000/admin/profile
Authorization: Bearer <paste-token-here>
```

---

## What's Next

Now you can:
1. Add more routes with middleware applied for other operations (CRUD)
2. Implement similar login for sellers/managers/customers
3. Add logout endpoint (clears token from DB)
4. Implement role-based access control
5. Use mailer for email verification or password reset

---

## Files Modified/Created

### New Files
- `src/admin/dto/login.dto.ts` - Login validation
- `src/admin/auth.middleware.ts` - JWT validation middleware

### Modified Files
- `src/admin/entities/admin.entity.ts` - Added token column
- `src/admin/dto/admin.dto.ts` - Added token field
- `src/admin/admin.service.ts` - Implemented auth logic
- `src/admin/admin.controller.ts` - Created login, register, profile routes
- `src/admin/admin.module.ts` - Set up JWT and middleware
- `src/manager/entities/manager.entity.ts` - Added token column
- `src/seller/entities/seller.entity.ts` - Added token column
- `src/customer/entities/customer.entity.ts` - Added token column
- `DBstructure.txt` - Updated to include token columns

---

## Dependencies Used

- `@nestjs/jwt` - JWT signing and verification
- `@nestjs/passport` - Authentication strategies
- `passport` - Authentication middleware
- `bcrypt` - Password hashing
- `@nestjs-modules/mailer` - Email sending (for future use)

All dependencies were already installed in previous steps.
