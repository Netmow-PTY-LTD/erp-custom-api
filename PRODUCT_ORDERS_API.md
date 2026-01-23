# Product Orders API Endpoint

## Overview
This document describes the new GET API endpoint to fetch all orders that contain a specific product.

## Endpoint Details

### GET `/api/products/:id/orders`

Retrieves a paginated list of all orders that contain the specified product.

#### URL Parameters
- `id` (required): The product ID

#### Query Parameters
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 10)
- `status` (optional): Filter by order status
  - Values: `pending`, `confirmed`, `processing`, `shipped`, `in_transit`, `delivered`, `cancelled`
- `start_date` (optional): Filter orders from this date (format: YYYY-MM-DD)
- `end_date` (optional): Filter orders until this date (format: YYYY-MM-DD)

#### Response Format

```json
{
  "success": true,
  "message": "Product orders retrieved successfully",
  "pagination": {
    "total": 25,
    "page": "1",
    "limit": "10",
    "totalPage": 3
  },
  "data": [
    {
      "id": 1,
      "order_number": "ORD-1733130000000",
      "customer_id": 1,
      "order_date": "2025-12-08T10:00:00.000Z",
      "status": "delivered",
      "total_amount": 150.00,
      "tax_amount": 15.00,
      "discount_amount": 0.00,
      "payment_status": "paid",
      "created_at": "2025-12-08T10:00:00.000Z",
      "customer": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "555-1234",
        "company": "Acme Corp"
      },
      "items": [
        {
          "id": 1,
          "order_id": 1,
          "product_id": 1,
          "quantity": 2,
          "unit_price": 29.99,
          "discount": 0.00,
          "line_total": 59.98,
          "total_price": 59.98,
          "product": {
            "id": 1,
            "name": "Wireless Mouse",
            "sku": "MOU-001",
            "image_url": "http://example.com/mouse.jpg"
          }
        }
      ]
    }
  ]
}
```

## Database Schema

### Tables Used
- `orders` - Main table containing order information
- `order_items` - Junction table linking orders to products
- `customers` - Customer information
- `products` - Product details

### Relationships
- `orders.customer_id` → `customers.id` (Foreign Key)
- `order_items.order_id` → `orders.id` (Foreign Key)
- `order_items.product_id` → `products.id` (Foreign Key)

## Usage Examples

### Example 1: Get All Orders for a Product
```bash
GET /api/products/1/orders
```

### Example 2: Filter by Order Status
```bash
GET /api/products/1/orders?status=delivered
```

### Example 3: Filter by Date Range
```bash
GET /api/products/1/orders?start_date=2025-12-01&end_date=2025-12-31
```

### Example 4: Pagination
```bash
GET /api/products/1/orders?page=2&limit=20
```

### Example 5: Combined Filters
```bash
GET /api/products/1/orders?status=delivered&start_date=2025-12-01&end_date=2025-12-31&page=1&limit=10
```

## Error Responses

### Product Not Found (404)
```json
{
  "success": false,
  "message": "Product not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Implementation Details

### Files Modified
1. **products.repository.js** - Added `getProductOrders()` method
2. **products.service.js** - Added `getProductOrders()` method
3. **products.controller.js** - Added `getProductOrders()` controller method
4. **products.routes.js** - Added route metadata and handler

### Key Features
- ✅ Pagination support
- ✅ Filter by order status
- ✅ Filter by date range
- ✅ Includes customer information
- ✅ Includes all order items for the product
- ✅ Returns product details within order items
- ✅ Sorted by order date (descending)

## Testing

To test the endpoint, ensure:
1. The server is running
2. You have a valid authentication token
3. The product ID exists in the database
4. There are orders containing the product

Example cURL request:
```bash
curl -X GET "http://localhost:5000/api/products/1/orders?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
