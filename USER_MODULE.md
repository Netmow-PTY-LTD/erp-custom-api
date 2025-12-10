# User Module

## Base Mapping
- **Module Name**: Users
- **Base Path**: `/api/users`

## Routes

### 1. Create User
- **Method**: `POST`
- **Path**: `/add`
- **Description**: Create a new user account
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
  "message": "created",
  "data": {
    "id": 15,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role_id": 2,
    "created_at": "2025-12-02T10:00:00.000Z"
  },
  "code": 201
}
```

### 2. Update User
- **Method**: `PUT`
- **Path**: `/update/:id`
- **Description**: Update an existing user by ID
- **Sample Request**:
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role_id": 3
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "updated",
  "data": {
    "id": 15,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role_id": 3,
    "updated_at": "2025-12-02T10:05:00.000Z"
  }
}
```

### 3. List Users
- **Method**: `GET`
- **Path**: `/list`
- **Description**: Get paginated list of all users
- **Query Parameters**:
  - `page`: 1 (default)
  - `limit`: 10 (default)
- **Sample Response**:
```json
{
  "status": true,
  "message": "users",
  "data": {
    "items": [
      {
        "id": 1,
        "name": "Admin User",
        "email": "admin@example.com",
        "role_id": 1,
        "created_at": "2025-12-01T00:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Manager User",
        "email": "manager@example.com",
        "role_id": 2,
        "created_at": "2025-12-01T00:00:00.000Z"
      }
    ],
    "meta": {
      "total": 25,
      "page": 1,
      "limit": 10
    }
  }
}
```

### 4. Get User by ID
- **Method**: `GET`
- **Path**: `/get/:id`
- **Description**: Get a specific user by ID with role information
- **Sample Response**:
```json
{
  "status": true,
  "message": "user",
  "data": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role_id": 1,
    "role": {
      "id": 1,
      "name": "Admin",
      "description": "Full system access"
    },
    "created_at": "2025-12-01T00:00:00.000Z"
  }
}
```

### 5. Delete User
- **Method**: `DELETE`
- **Path**: `/delete/:id`
- **Description**: Delete a user by ID (soft delete)
- **Sample Response**:
```json
{
  "status": true,
  "message": "deleted",
  "data": null
}
```
