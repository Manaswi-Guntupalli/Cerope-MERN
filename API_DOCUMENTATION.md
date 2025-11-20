# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User

Creates a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "name": "Aishwaryaa Shah",
  "email": "aishwaryaa@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "termsAccepted": true
}
```

**Validation Rules:**

- `name`: Required, no numbers allowed
- `email`: Required, valid email format
- `password`: Required, min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- `confirmPassword`: Must match password
- `termsAccepted`: Must be true

**Success Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Aishwaryaa Shah",
    "email": "aishwaryaa@example.com",
    "profileSetup": false
  }
}
```

**Error Response (400):**

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid Email Address!"
    }
  ]
}
```

---

### Login User

Authenticates a user and returns a JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**

```json
{
  "email": "aishwaryaa@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Aishwaryaa Shah",
    "email": "aishwaryaa@example.com",
    "profileSetup": false
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email or password"
    }
  ]
}
```

---

## User Profile Endpoints

### Get User Profile

Retrieves the authenticated user's profile.

**Endpoint:** `GET /user/profile`

**Headers:**

```
Authorization: Bearer <token>
```

**Success Response (200):**

```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Aishwaryaa Shah",
    "email": "aishwaryaa@example.com",
    "phone": "+1 (555) 123-4567",
    "bio": "Fashion enthusiast and AI lover",
    "preferences": {
      "style": "elegant",
      "favoriteColors": "Blue, Purple, Black"
    },
    "profileSetup": true,
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401):**

```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

---

### Complete Profile Setup

Completes the initial profile setup after registration.

**Endpoint:** `PUT /user/profile/setup`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "phone": "+1 (555) 123-4567",
  "bio": "Fashion enthusiast and AI lover",
  "preferences": {
    "style": "elegant",
    "favoriteColors": "Blue, Purple, Black"
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile setup completed successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Aishwaryaa Shah",
    "email": "aishwaryaa@example.com",
    "phone": "+1 (555) 123-4567",
    "bio": "Fashion enthusiast and AI lover",
    "preferences": {
      "style": "elegant",
      "favoriteColors": "Blue, Purple, Black"
    },
    "profileSetup": true
  }
}
```

---

### Update User Profile

Updates the user's profile information.

**Endpoint:** `PUT /user/profile`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Aishwaryaa Shah",
  "phone": "+1 (555) 987-6543",
  "bio": "Updated bio text",
  "preferences": {
    "style": "casual",
    "favoriteColors": "Red, Green"
  }
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Aishwaryaa Shah",
    "email": "aishwaryaa@example.com",
    "phone": "+1 (555) 987-6543",
    "bio": "Updated bio text",
    "preferences": {
      "style": "casual",
      "favoriteColors": "Red, Green"
    },
    "profileSetup": true
  }
}
```

---

## Error Codes

| Status Code | Description                          |
| ----------- | ------------------------------------ |
| 200         | Success                              |
| 201         | Created (successful registration)    |
| 400         | Bad Request (validation error)       |
| 401         | Unauthorized (invalid/missing token) |
| 404         | Not Found                            |
| 500         | Internal Server Error                |

---

## Validation Error Format

All validation errors follow this structure:

```json
{
  "success": false,
  "errors": [
    {
      "field": "fieldName",
      "message": "Error message"
    }
  ]
}
```

---

## Testing with cURL

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!",
    "termsAccepted": true
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Get Profile (with token)

```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Testing with Postman

1. Import the API endpoints into Postman
2. Set the base URL to `http://localhost:5000/api`
3. For protected routes, add the token to the Authorization header:
   - Type: Bearer Token
   - Token: [paste your JWT token]

---

## Health Check

**Endpoint:** `GET /api/health`

**Response:**

```json
{
  "status": "OK",
  "message": "Cerope API is running"
}
```

Use this endpoint to verify the backend is running correctly.
