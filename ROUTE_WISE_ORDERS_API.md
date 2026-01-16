# Route-Wise Sales Orders API

## Overview
A new GET API endpoint has been created to retrieve sales orders filtered by sales route.

## Endpoint Details

**URL:** `GET /api/sales/orders/by-route`

**Authentication:** Required (Bearer Token)

**Module Check:** Sales module access required

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sales_route_id` | Integer | Yes | Filter orders by sales route ID |
| `page` | Integer | No | Page number (default: 1) |
| `limit` | Integer | No | Items per page (default: 10) |
| `status` | String | No | Filter by order status (pending, confirmed, processing, shipped, delivered, cancelled) |
| `search` | String | No | Search by order number |

## Response Structure

The API returns orders with the following information:

### Order Details
- Order ID, number, date, status
- Total amount, tax amount, discount amount
- Shipping and billing addresses
- Payment status
- Notes and due date

### Customer Information
- Customer ID, name, email, phone, company
- Customer address and city
- **Sales Route Information** (nested)
  - Route ID, name, description

### Order Items
- Product details (ID, name, SKU, price, image)
- Quantity, unit price, discount, line total

### Delivery Information
- Latest delivery record
- Delivery number, date, status, notes
- Delivery status field (calculated)

## Example Requests

### 1. Get all orders for a specific sales route
```
GET /api/sales/orders/by-route?sales_route_id=1
```

### 2. Get pending orders for a sales route
```
GET /api/sales/orders/by-route?sales_route_id=2&status=pending
```

### 3. Search orders within a route
```
GET /api/sales/orders/by-route?sales_route_id=1&search=ORD-123
```

### 4. Paginated results
```
GET /api/sales/orders/by-route?sales_route_id=1&page=2&limit=20
```

## Sample Response

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
      "notes": "Please deliver between 9 AM and 5 PM",
      "due_date": "2025-12-15",
      "created_at": "2025-12-03T05:00:00.000Z",
      "customer": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "company": "ABC Corp",
        "address": "123 Main St",
        "city": "New York",
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
          "order_id": 1,
          "product_id": 1,
          "quantity": 2,
          "unit_price": 50.00,
          "discount": 5.00,
          "line_total": 95.00,
          "product": {
            "id": 1,
            "name": "Wireless Mouse",
            "sku": "MOU-001",
            "price": 29.99,
            "image_url": "http://example.com/thumb.jpg"
          }
        }
      ],
      "delivery": {
        "id": 1,
        "delivery_number": "DEL-123456",
        "delivery_date": "2025-12-09",
        "status": "delivered",
        "notes": "Left at reception"
      }
    }
  ]
}
```

## Database Tables Used

1. **orders** - Main table for order data
2. **customers** - Customer information with sales_route_id
3. **sales_routes** - Sales route details
4. **order_items** - Individual order line items
5. **products** - Product information
6. **deliveries** - Delivery records

## Implementation Files Modified

1. **Repository Layer** (`src/modules/sales/sales.repository.js`)
   - Added `findAllBySalesRoute()` method to OrderRepository

2. **Service Layer** (`src/modules/sales/sales.service.js`)
   - Added `getOrdersBySalesRoute()` method to SalesService

3. **Controller Layer** (`src/modules/sales/sales.controller.js`)
   - Added `getOrdersBySalesRoute()` method to SalesController

4. **Routes** (`src/modules/sales/sales.routes.js`)
   - Added new route definition with full metadata

## Key Features

✅ **Filtering by Sales Route** - Only returns orders from customers assigned to the specified route
✅ **Pagination Support** - Handles large datasets efficiently
✅ **Search Capability** - Search orders by order number
✅ **Status Filtering** - Filter by order status
✅ **Complete Order Details** - Includes customer, items, products, and delivery information
✅ **Sales Route Context** - Shows which route each customer belongs to
✅ **Delivery Status** - Includes latest delivery status for each order

## Use Cases

1. **Route Planning** - Sales reps can view all orders for their assigned route
2. **Delivery Management** - Track deliveries by route
3. **Performance Analysis** - Analyze sales performance by route
4. **Customer Service** - Quickly find orders within a specific geographic area
5. **Route Optimization** - Identify high-volume routes for resource allocation
