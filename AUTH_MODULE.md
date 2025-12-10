# Auth Module

## Base Mapping
- **Module Name**: Auth
- **Base Path**: `/api/auth`

## Routes

### 1. Login
- **Method**: `POST`
- **Path**: `/login`
- **Description**: Authenticate user and get access token
- **Sample Request**:
```json
{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com",
      "role_id": 1,
      "role_name": "Admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 2. Register
- **Method**: `POST`
- **Path**: `/register`
- **Description**: Register a new user account
- **Sample Request**:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "role_id": 2
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 25,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role_id": 2,
      "created_at": "2025-12-02T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "code": 201
}
```

### 3. Get Current User
- **Method**: `GET`
- **Path**: `/me`
- **Description**: Get current authenticated user information
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role_id": 1,
    "role": {
      "id": 1,
      "name": "Admin",
      "permissions": [
        "users.create",
        "users.read",
        "users.update",
        "users.delete"
      ]
    },
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

### 4. Refresh Token
- **Method**: `POST`
- **Path**: `/refresh`
- **Description**: Refresh access token using refresh token
- **Sample Request**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 5. Logout
- **Method**: `POST`
- **Path**: `/logout`
- **Description**: Logout user and invalidate tokens
- **Sample Response**:
```json
{
  "status": true,
  "message": "Logout successful",
  "data": null
}
```
