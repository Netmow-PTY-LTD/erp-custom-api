# Roles Module

## Base Mapping
- **Module Name**: Roles
- **Base Path**: `/api/roles`

## Routes

### 1. Create Role
- **Method**: `POST`
- **Path**: `/add`
- **Description**: Create a new role with permissions
- **Sample Request**:
```json
{
  "name": "Sales Manager",
  "description": "Manages sales team and operations",
  "permissions": [1, 2, 5, 10]
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "created",
  "data": {
    "id": 5,
    "name": "Sales Manager",
    "description": "Manages sales team and operations",
    "created_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 2. Update Role
- **Method**: `PUT`
- **Path**: `/update/:id`
- **Description**: Update an existing role by ID
- **Sample Request**:
```json
{
  "name": "Senior Sales Manager",
  "description": "Senior level sales management role",
  "permissions": [1, 2, 5, 10, 15]
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "updated",
  "data": {
    "id": 5,
    "name": "Senior Sales Manager",
    "description": "Senior level sales management role",
    "updated_at": "2025-12-02T10:05:00.000Z"
  }
}
```

### 3. List Roles
- **Method**: `GET`
- **Path**: `/list`
- **Description**: Get paginated list of all roles
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
        "name": "Admin",
        "description": "Full system access",
        "created_at": "2025-12-01T00:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Manager",
        "description": "Department management access",
        "created_at": "2025-12-01T00:00:00.000Z"
      }
    ],
    "meta": {
      "total": 5,
      "page": 1,
      "limit": 10
    }
  }
}
```

### 4. Get Role by ID
- **Method**: `GET`
- **Path**: `/get/:id`
- **Description**: Get a specific role by ID with permissions
- **Sample Response**:
```json
{
  "status": true,
  "message": "user",
  "data": {
    "id": 1,
    "name": "Admin",
    "description": "Full system access",
    "permissions": [
      { "id": 1, "name": "users.create" },
      { "id": 2, "name": "users.read" },
      { "id": 3, "name": "users.update" }
    ],
    "created_at": "2025-12-01T00:00:00.000Z"
  }
}
```

### 5. Delete Role
- **Method**: `DELETE`
- **Path**: `/delete/:id`
- **Description**: Delete a role by ID (soft delete)
- **Sample Response**:
```json
{
  "status": true,
  "message": "deleted",
  "data": null
}
```
