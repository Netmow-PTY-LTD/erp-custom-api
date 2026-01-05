# 📋 Route-Wise Sales Orders API - Complete Documentation

## 🎯 Endpoint
```
GET /api/sales/orders/by-route
```

## 📝 Description
Get all orders filtered by sales route with pagination. Returns orders with customer, sales route, items, and delivery information.

---

## 📊 Database Schema

### Main Table
`orders`

### Tables Used
- `orders`
- `customers`
- `sales_routes`
- `order_items`
- `products`
- `deliveries`

### Fields by Table

**orders:**
- id, order_number, customer_id, order_date, status
- total_amount, tax_amount, discount_amount
- shipping_address, billing_address, payment_status
- notes, due_date, created_at

**customers:**
- id, name, email, phone, company
- address, city, sales_route_id

**sales_routes:**
- id, route_name, description

**order_items:**
- id, order_id, product_id, quantity
- unit_price, discount, line_total

**products:**
- id, name, sku, price, image_url

**deliveries:**
- id, delivery_number, delivery_date, status, notes

**calculated:**
- delivery_status

### Relationships
```
orders.customer_id -> customers.id (FK)
customers.sales_route_id -> sales_routes.id (FK)
order_items.order_id -> orders.id (FK)
order_items.product_id -> products.id (FK)
orders.id -> deliveries.order_id (HasMany - Latest delivery only)
```

---

## 🔧 Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `sales_route_id` | Integer | ✅ Yes | - | Filter by sales route ID |
| `page` | Integer | No | 1 | Page number |
| `limit` | Integer | No | 10 | Items per page |
| `status` | String | No | - | Filter by order status |
| `search` | String | No | - | Search by order number |

---

## ✅ Sample Request URLs & Response Structures

### Example 1: Get all orders for sales route 1

**Description:** Retrieve all orders from customers assigned to sales route 1

**Request:**
```http
GET /api/sales/orders/by-route?sales_route_id=1
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Route-wise orders retrieved successfully",
  "pagination": {
    "total": 15,
    "page": "1",
    "limit": "10",
    "totalPage": 2
  },
  "data": [
    {
      "id": 1,
      "order_number": "ORD-1733130000000",
      "customer_id": 1,
      "total_amount": "150.00",
      "status": "pending",
      "delivery_status": "delivered",
      "customer": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "sales_route_id": 1,
        "salesRoute": {
          "id": 1,
          "route_name": "North Route",
          "description": "Northern area coverage"
        }
      },
      "items": [
        {
          "id": 1,
          "quantity": 2,
          "unit_price": 50.00,
          "product": {
            "id": 1,
            "name": "Wireless Mouse",
            "sku": "MOU-001"
          }
        }
      ],
      "delivery": {
        "id": 1,
        "delivery_number": "DEL-123456",
        "status": "delivered"
      }
    }
  ]
}
```

---

### Example 2: Get pending orders for route 2 with pagination

**Description:** Get pending orders from route 2, page 1, 20 items per page

**Request:**
```http
GET /api/sales/orders/by-route?sales_route_id=2&status=pending&page=1&limit=20
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Route-wise orders retrieved successfully",
  "pagination": {
    "total": 45,
    "page": "1",
    "limit": "20",
    "totalPage": 3
  },
  "data": [
    {
      "id": 5,
      "order_number": "ORD-1733140000000",
      "customer_id": 5,
      "total_amount": "250.00",
      "status": "pending",
      "delivery_status": null,
      "customer": {
        "id": 5,
        "name": "Jane Smith",
        "email": "jane@example.com",
        "sales_route_id": 2,
        "salesRoute": {
          "id": 2,
          "route_name": "South Route",
          "description": "Southern area coverage"
        }
      },
      "items": [
        {
          "id": 8,
          "quantity": 5,
          "unit_price": 50.00,
          "product": {
            "id": 3,
            "name": "Keyboard",
            "sku": "KEY-001"
          }
        }
      ],
      "delivery": null
    }
  ]
}
```

---

### Example 3: Search orders in route 1

**Description:** Search for specific order by order number within route 1

**Request:**
```http
GET /api/sales/orders/by-route?sales_route_id=1&search=ORD-123
```

**Sample Response:**
```json
{
  "success": true,
  "message": "Route-wise orders retrieved successfully",
  "pagination": {
    "total": 1,
    "page": "1",
    "limit": "10",
    "totalPage": 1
  },
  "data": [
    {
      "id": 3,
      "order_number": "ORD-123456",
      "customer_id": 2,
      "total_amount": "180.00",
      "status": "confirmed",
      "delivery_status": "in_transit",
      "customer": {
        "id": 2,
        "name": "Bob Wilson",
        "email": "bob@example.com",
        "sales_route_id": 1,
        "salesRoute": {
          "id": 1,
          "route_name": "North Route",
          "description": "Northern area coverage"
        }
      },
      "items": [
        {
          "id": 5,
          "quantity": 3,
          "unit_price": 60.00,
          "product": {
            "id": 2,
            "name": "Monitor",
            "sku": "MON-001"
          }
        }
      ],
      "delivery": {
        "id": 3,
        "delivery_number": "DEL-789012",
        "status": "in_transit"
      }
    }
  ]
}
```

---

## 💡 Key Features

✅ **Route-Based Filtering** - Only returns orders from customers in the specified sales route  
✅ **Pagination** - Efficient handling of large datasets  
✅ **Status Filtering** - Filter by order status (pending, confirmed, etc.)  
✅ **Search** - Find specific orders by order number  
✅ **Complete Data** - Includes customer, sales route, items, products, and delivery info  
✅ **Delivery Status** - Shows latest delivery status for each order  

---

## 🎯 Use Cases

1. **Route Management** - Sales reps view all orders for their assigned route
2. **Delivery Planning** - Organize deliveries by geographic route
3. **Performance Tracking** - Analyze sales by route
4. **Customer Service** - Quickly locate orders in specific areas
5. **Resource Allocation** - Identify high-volume routes

---

## 🔐 Authentication & Authorization

- **Authentication Required:** Yes (Bearer Token)
- **Module Access:** Sales module required
- **Middleware:** `verifyToken`, `moduleCheck('sales')`

---

## 📌 Notes

- `sales_route_id` parameter is **required**
- Orders are returned in descending order by creation date (newest first)
- Only orders from customers assigned to the specified route are returned
- `delivery_status` is calculated from the latest delivery record
- If no delivery exists, `delivery_status` and `delivery` will be `null`
