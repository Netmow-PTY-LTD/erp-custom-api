# Sales Routes API Documentation

## Overview
Sales Routes allow you to organize and assign customers to specific geographical routes (e.g., "Kuala Lumpur", "Selangor North"). This helps manage sales territories and assign salespeople to specific areas.

## Base URL
```
http://192.168.68.103:5000/api/salesroutes
```

## Authentication
All endpoints require authentication. Include the Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## API Endpoints

### 1. Create Sales Route

**POST** `/api/salesroutes/`

**Request Body:**
```json
{
  "route_name": "Kuala Lumpur",
  "description": "Central KL coverage area",
  "assigned_sales_rep_id": 5,
  "start_location": "KLCC",
  "end_location": "Bukit Bintang",
  "is_active": true
}
```

**Response:**
```json
{
  "status": true,
  "message": "Sales route created successfully",
  "data": {
    "id": 1,
    "route_name": "Kuala Lumpur",
    "description": "Central KL coverage area",
    "assigned_sales_rep_id": 5,
    "start_location": "KLCC",
    "end_location": "Bukit Bintang",
    "is_active": true,
    "created_at": "2025-12-02T10:25:00.000Z",
    "updated_at": "2025-12-02T10:25:00.000Z"
  }
}
```

---

### 2. Get All Sales Routes

**GET** `/api/salesroutes/`

**Query Parameters:**
- `is_active` (optional) - Filter by status: true/false
- `search` (optional) - Search by route name, description, or locations

**Example:**
```
GET /api/salesroutes/?search=Kuala
GET /api/salesroutes/?is_active=true
```

**Response:**
```json
{
  "status": true,
  "message": "Sales routes retrieved successfully",
  "data": [
    {
      "id": 1,
      "route_name": "Kuala Lumpur",
      "description": "Central KL coverage area",
      "assigned_sales_rep_id": 5,
      "start_location": "KLCC",
      "end_location": "Bukit Bintang",
      "is_active": true,
      "created_at": "2025-12-02T10:25:00.000Z"
    },
    {
      "id": 2,
      "route_name": "Selangor North",
      "description": "Northern Selangor coverage",
      "assigned_sales_rep_id": 3,
      "start_location": "Shah Alam",
      "end_location": "Rawang",
      "is_active": true,
      "created_at": "2025-12-02T10:26:00.000Z"
    }
  ]
}
```

---

### 3. Get Sales Route by ID

**GET** `/api/salesroutes/:id`

**Example:**
```
GET /api/salesroutes/1
```

**Response:**
```json
{
  "status": true,
  "message": "Sales route retrieved successfully",
  "data": {
    "id": 1,
    "route_name": "Kuala Lumpur",
    "description": "Central KL coverage area",
    "assigned_sales_rep_id": 5,
    "start_location": "KLCC",
    "end_location": "Bukit Bintang",
    "is_active": true,
    "created_at": "2025-12-02T10:25:00.000Z",
    "updated_at": "2025-12-02T10:25:00.000Z"
  }
}
```

---

### 4. Update Sales Route

**PUT** `/api/salesroutes/:id`

**Request Body:** (all fields optional)
```json
{
  "route_name": "Kuala Lumpur Central",
  "description": "Updated coverage area",
  "assigned_sales_rep_id": 7,
  "is_active": true
}
```

**Response:**
```json
{
  "status": true,
  "message": "Sales route updated successfully",
  "data": {
    "id": 1,
    "route_name": "Kuala Lumpur Central",
    "description": "Updated coverage area",
    "assigned_sales_rep_id": 7,
    "updated_at": "2025-12-02T10:30:00.000Z"
  }
}
```

---

### 5. Delete Sales Route

**DELETE** `/api/salesroutes/:id`

**Example:**
```
DELETE /api/salesroutes/1
```

**Response:**
```json
{
  "status": true,
  "message": "Sales route deleted successfully",
  "data": null
}
```

---

## Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `route_name` | string | ✅ Yes | Name of the route (e.g., "Kuala Lumpur") |
| `description` | string | ❌ Optional | Detailed description of the route coverage |
| `assigned_sales_rep_id` | number | ❌ Optional | ID of the staff member assigned to this route |
| `start_location` | string | ❌ Optional | Starting point of the route |
| `end_location` | string | ❌ Optional | Ending point of the route |
| `is_active` | boolean | ❌ Optional | Route status (default: true) |

---

## Usage with Customers

Once you have sales routes created, you can assign customers to routes:

**Assign Customer to Route:**
```json
POST /api/customers/
{
  "name": "Ahmad Abdullah",
  "company": "ABC Trading",
  "sales_route_id": 1,  // Assigns to "Kuala Lumpur" route
  ...
}
```

**Update Customer Route:**
```json
PUT /api/customers/:id
{
  "sales_route_id": 2  // Change to different route
}
```

---

## Common Use Cases

### 1. Create Multiple Routes for Malaysia
```bash
# Kuala Lumpur
POST /api/salesroutes/
{
  "route_name": "Kuala Lumpur",
  "description": "KL City Center"
}

# Selangor
POST /api/salesroutes/
{
  "route_name": "Selangor",
  "description": "Selangor State"
}

# Penang
POST /api/salesroutes/
{
  "route_name": "Penang",
  "description": "Penang Island and mainland"
}

# Johor Bahru
POST /api/salesroutes/
{
  "route_name": "Johor Bahru",
  "description": "Johor Bahru city area"
}
```

### 2. Get Active Routes for Dropdown
```bash
GET /api/salesroutes/?is_active=true
```

### 3. Search Routes
```bash
GET /api/salesroutes/?search=Kuala
```

---

## Error Handling

**Duplicate Route Name:**
```json
{
  "status": false,
  "message": "Route with this name already exists"
}
```

**Route Not Found:**
```json
{
  "status": false,
  "message": "Sales route not found"
}
```

**Validation Error:**
```json
{
  "status": false,
  "message": "Validation Error",
  "errors": [
    {
      "path": ["route_name"],
      "message": "Route name is required"
    }
  ]
}
```

---

## Notes

1. **Unique Route Names**: Each route must have a unique name
2. **Soft Delete**: Consider using `is_active: false` instead of deleting routes that have customers assigned
3. **Sales Rep Assignment**: The `assigned_sales_rep_id` links to staff members in your system
4. **Customer Assignment**: Customers reference routes via `sales_route_id` field
