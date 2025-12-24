# Login API Enhancement - User & Role Data Population

## Overview
Enhanced the `POST /api/auth/login` endpoint to return comprehensive user and role-wise data including role details, permissions, hierarchical menus, and dashboard configurations.

## Changes Made

### 1. **auth.repository.js** - Enhanced Data Fetching
Added new repository methods to fetch user data with complete role information:

- `findByEmailWithRole(email)` - Fetches user with role and role settings
- `findByIdWithRole(id)` - Fetches user by ID with role and role settings
- `getRoleMenus()` - Fetches all active role menus ordered by sort_order
- `getRoleDashboards()` - Fetches all active role dashboards

**Models Included:**
- `User` - User information
- `Role` - Role details with permissions
- `RoleSettings` - Role-specific settings
- `RoleMenu` - Menu items for navigation
- `RoleDashboard` - Dashboard widget configurations

### 2. **auth.service.js** - Enhanced Business Logic
Updated login and getCurrentUser methods to return comprehensive data:

**Login Method (`exports.login`):**
- Fetches user with role details using `findByEmailWithRole()`
- Retrieves all active role menus and dashboards
- Builds hierarchical menu tree structure (parent-child relationships)
- Returns user data, JWT token, menu tree, and dashboards

**GetCurrentUser Method (`exports.getCurrentUser`):**
- Fetches user with role details using `findByIdWithRole()`
- Returns same comprehensive structure as login for consistency

**Menu Tree Structure:**
- Recursively builds hierarchical menu structure
- Parent menus contain nested children arrays
- Maintains sort order for proper display

### 3. **auth.routes.js** - Updated API Documentation
Enhanced route metadata with comprehensive sample responses:

**Login Endpoint (`POST /api/auth/login`):**
- Updated database tables list
- Enhanced sample response showing complete data structure
- Documented all relationships

**Me Endpoint (`GET /api/auth/me`):**
- Updated to match login response structure
- Shows user, menus, and dashboards

## Response Structure

### Login Response (`POST /api/auth/login`)
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
      "created_at": "2025-01-01T00:00:00.000Z",
      "role": {
        "id": 1,
        "name": "admin",
        "display_name": "Administrator",
        "description": "Full system access",
        "status": "active",
        "permissions": ["users.create", "users.read", "users.update", "users.delete"],
        "created_at": "2025-01-01T00:00:00.000Z",
        "RoleSettings": {
          "id": 1,
          "role_id": 1,
          "menu": null,
          "dashboard": null,
          "custom": null
        }
      }
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "menus": [
      {
        "id": 1,
        "title": "Dashboard",
        "icon": "dashboard",
        "path": "/dashboard",
        "parent_id": null,
        "sort_order": 1,
        "is_active": true,
        "children": []
      },
      {
        "id": 2,
        "title": "Users",
        "icon": "people",
        "path": null,
        "parent_id": null,
        "sort_order": 2,
        "is_active": true,
        "children": [
          {
            "id": 3,
            "title": "User List",
            "icon": null,
            "path": "/users",
            "parent_id": 2,
            "sort_order": 1,
            "is_active": true,
            "children": []
          }
        ]
      }
    ],
    "dashboards": [
      {
        "id": 1,
        "name": "Total Users",
        "slug": "total_users",
        "type": "stat",
        "size": "1x1",
        "is_active": true,
        "created_at": "2025-01-01T00:00:00.000Z",
        "updated_at": "2025-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## Database Tables Involved

1. **users** - User account information
2. **roles** - Role definitions with permissions
3. **role_settings** - Role-specific configuration
4. **role_menus** - Navigation menu items (hierarchical)
5. **role_dashboards** - Dashboard widget configurations

## Relationships

- `users.role_id` → `roles.id` (Foreign Key)
- `roles.id` → `role_settings.role_id` (Foreign Key)
- `role_menus.parent_id` → `role_menus.id` (Self-referencing FK for hierarchy)

## Benefits

1. **Single API Call** - Frontend gets all necessary data in one request
2. **Role-Based UI** - Menus and dashboards can be rendered based on user's role
3. **Hierarchical Menus** - Nested menu structure ready for rendering
4. **Permission Management** - Role permissions included for access control
5. **Dashboard Configuration** - Widget configurations for personalized dashboards
6. **Consistency** - Both login and /me endpoints return same structure

## Frontend Usage

```javascript
// After login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { data } = await response.json();

// Store token
localStorage.setItem('token', data.token);

// Use user data
console.log('User:', data.user.name);
console.log('Role:', data.user.role.display_name);
console.log('Permissions:', data.user.role.permissions);

// Render menus
renderMenus(data.menus);

// Render dashboard widgets
renderDashboard(data.dashboards);
```

## Testing

Test the endpoint using:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'
```

## Notes

- Password is removed from response for security
- Menus are filtered by `is_active: true`
- Dashboards are filtered by `is_active: true`
- Menu tree is built recursively for proper hierarchy
- All timestamps are in ISO 8601 format
