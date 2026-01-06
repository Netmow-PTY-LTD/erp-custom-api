# 📋 Route-Wise Sales Orders API - Complete Documentation

## 🎯 Endpoint
```
GET /api/sales/orders/by-route
```

## 📝 Description
Get sales orders grouped by route. Returns a list of routes, each containing its associated orders, with support for pagination and filtering.

---

## 📊 Database Schema

### Main Table
`sales_routes`

### Tables Used
- `sales_routes`
- `customers`
- `orders`

### Relationships
```
sales_routes.id -> customers.sales_route_id (HasMany)
customers.id -> orders.customer_id (HasMany)
```

---

## 🔧 Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sales_route_id` | Integer | No | - | Filter by specific sales route ID |
| `page` | Integer | No | 1 | Page number (for routes) |
| `limit` | Integer | No | 10 | Routes per page |
| `status` | String | No | - | Filter orders by status (e.g., Pending, Delivered) |
| `date` | String | No | - | Filter orders by specific date (YYYY-MM-DD) |
| `search` | String | No | - | Search by route list name |

---

## ✅ Sample Request URLs & Response Structures

### Example 1: Get all orders grouped by route
**Request:**
```http
GET /api/sales/orders/by-route
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Route-wise orders retrieved successfully",
  "pagination": {
    "total": 4,
    "page": "1",
    "limit": "10",
    "totalPage": 1
  },
  "data": [
    {
      "id": 1,
      "name": "Dhaka North Route",
      "region": "Dhaka",
      "orders": [
        {
          "id": 1001,
          "customer": "Customer 1",
          "amount": 8500,
          "status": "Delivered",
          "date": "2024-03-20"
        },
        {
          "id": 1002,
          "customer": "Customer 2",
          "amount": 4200,
          "status": "Pending",
          "date": "2024-03-20"
        }
      ]
    },
    {
      "id": 2,
      "name": "Dhaka South Route",
      "region": "Dhaka",
      "orders": [
        {
          "id": 2001,
          "customer": "Store 1",
          "amount": 12500,
          "status": "Pending",
          "date": "2024-03-21"
        }
      ]
    }
  ]
}
```

---

### Example 2: Check pagination and filter option for this route

**Description:** Filter for "Pending" orders in "Dhaka North Route" (ID 1).

**Request:**
```http
GET /api/sales/orders/by-route?sales_route_id=1&status=Pending
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Route-wise orders retrieved successfully",
  "pagination": { "total": 1, "page": "1", "limit": "10", "totalPage": 1 },
  "data": [
    {
      "id": 1,
      "name": "Dhaka North Route",
      "region": "Dhaka",
      "orders": [
        {
          "id": 1002,
          "customer": "Customer 2",
          "amount": 4200,
          "status": "Pending",
          "date": "2024-03-20"
        }
      ]
    }
  ]
}
```

---

## 💡 Key Features

✅ **Grouped View** - Orders are organized under their respective sales routes
✅ **Route Pagination** - Efficiently browse through many routes
✅ **Deep Filtering** - Filter orders *within* the routes by status or date
✅ **Simplified Structure** - Flattened nested data into a clean JSON format

