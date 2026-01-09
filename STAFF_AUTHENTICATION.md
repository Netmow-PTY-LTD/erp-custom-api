# Staff Authentication System

## Overview

The system has been updated so that **Staff and Users are now the same entity**. Every staff member can optionally have login credentials, making them a user of the system.

## Database Changes

### Added Fields to `staffs` Table

- **`password`** (VARCHAR 255, nullable): Hashed password for authentication
- **`role_id`** (INT, nullable): Foreign key to `roles` table for permissions

### Migration

Run the migration to add these fields:

```bash
node run-add-auth-to-staffs.js
```

## How It Works

### 1. Creating Staff with Login Access

When creating a staff member who needs login access, include `password` and `role_id`:

**POST** `/api/staffs/add`

```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@company.com",
  "password": "securePassword123",
  "role_id": 2,
  "position": "Sales Representative",
  "department_id": 1,
  "phone": "+1234567890",
  "hire_date": "2026-01-09",
  "salary": 50000,
  "status": "active"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Staff created successfully",
  "data": {
    "id": 5,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@company.com",
    "role_id": 2,
    "position": "Sales Representative",
    "status": "active"
    // password is hashed and not returned
  }
}
```

### 2. Creating Staff WITHOUT Login Access

If a staff member doesn't need login access, simply omit `password` and `role_id`:

**POST** `/api/staffs/add`

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@company.com",
  "position": "Warehouse Worker",
  "department_id": 3
}
```

### 3. Staff Login

Staff members with credentials can log in using the standard auth endpoint:

**POST** `/api/auth/login`

```json
{
  "email": "john.doe@company.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 5,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@company.com",
      "role_id": 2,
      "role": {
        "id": 2,
        "name": "Sales",
        "display_name": "Sales Representative"
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "menus": [...],
    "dashboards": [...]
  }
}
```

### 4. Updating Staff Credentials

You can add or update login credentials for existing staff:

**PUT** `/api/staffs/update/:id`

```json
{
  "password": "newPassword123",
  "role_id": 3
}
```

## Authentication Flow

1. User submits email and password to `/api/auth/login`
2. System checks **both** `users` and `staffs` tables for matching email
3. If found in `staffs` table with password, validates credentials
4. Returns JWT token with staff information
5. Staff can access protected routes using the token

## Benefits

✅ **Unified System**: Staff members ARE users, no need for separate accounts  
✅ **Flexible**: Staff can exist without login access (e.g., warehouse workers)  
✅ **Consistent**: Same authentication flow for all users  
✅ **Efficient**: No duplicate data between users and staff tables  

## Role-Based Access Control

Staff members are assigned roles that determine their permissions:

- **Superadmin** (role_id: 1): Full system access
- **Sales** (role_id: 2): Sales module access
- **Manager** (role_id: 3): Department management
- **Staff** (role_id: 4): Basic access

## Security Notes

- Passwords are **always hashed** using bcrypt (10 rounds)
- Passwords are **never returned** in API responses
- Staff without `password` field cannot log in
- JWT tokens expire based on `JWT_EXPIRES_IN` env variable

## Migration from Old System

If you have existing users in the `users` table:

1. The system will check `users` table first during login
2. Then check `staffs` table if not found
3. Both can coexist during transition
4. Gradually migrate users to staff records

## Example Use Cases

### Case 1: Sales Representative (Needs Login)
```json
{
  "first_name": "Mike",
  "email": "mike@company.com",
  "password": "password123",
  "role_id": 2,
  "position": "Sales Rep"
}
```

### Case 2: Delivery Driver (No Login Needed)
```json
{
  "first_name": "Tom",
  "email": "tom@company.com",
  "position": "Driver"
}
```

### Case 3: Manager (Full Access)
```json
{
  "first_name": "Sarah",
  "email": "sarah@company.com",
  "password": "secure123",
  "role_id": 3,
  "position": "Department Manager"
}
```

## API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/staffs/add` | POST | Create staff (with or without login) |
| `/api/staffs/update/:id` | PUT | Update staff (including credentials) |
| `/api/auth/login` | POST | Login for both users and staff |
| `/api/auth/me` | GET | Get current logged-in staff/user |

## Testing

After running the migration, test the system:

1. Create a staff member with password and role_id
2. Try logging in with their credentials
3. Verify JWT token is returned
4. Access protected routes with the token

---

**Last Updated**: 2026-01-09  
**Migration File**: `run-add-auth-to-staffs.js`
