# Route Metadata - Route-Wise Sales Orders

## Endpoint Information
**Path:** `/api/sales/orders/by-route`  
**Method:** `GET`  
**Module:** Sales & Orders  
**Authentication:** Required (verifyToken)  
**Module Access:** Sales module required

## Description
Get all orders filtered by sales route with pagination. Returns orders with customer, sales route, items, and delivery information.

## Database Schema

### Tables Used
- `orders` (Main Table)
- `customers`
- `sales_routes`
- `order_items`
- `products`
- `deliveries`

### Fields Returned
**orders:** id, order_number, customer_id, order_date, status, total_amount, tax_amount, discount_amount, shipping_address, billing_address, payment_status, notes, due_date, created_at

**customers:** id, name, email, phone, company, address, city, sales_route_id

**sales_routes:** id, route_name, description

**order_items:** id, order_id, product_id, quantity, unit_price, discount, line_total

**products:** id, name, sku, price, image_url

**deliveries:** id, delivery_number, delivery_date, status, notes

**calculated:** delivery_status

### Relationships
- `orders.customer_id -> customers.id (FK)`
- `customers.sales_route_id -> sales_routes.id (FK)`
- `order_items.order_id -> orders.id (FK)`
- `order_items.product_id -> products.id (FK)`
- `orders.id -> deliveries.order_id (HasMany - Latest delivery only)`

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | Integer | No | Page number (default: 1) |
| `limit` | Integer | No | Items per page (default: 10) |
| `sales_route_id` | Integer | **Yes** | Filter by sales route ID (Required) |
| `status` | String | No | Filter by order status |
| `search` | String | No | Search by order number |

## Examples

### Example 1: Get all orders for sales route 1
**Description:** Retrieve all orders from customers assigned to sales route 1

**Request:**
```http
GET /api/sales/orders/by-route?sales_route_id=1
```

---

### Example 2: Get pending orders for route 2 with pagination
**Description:** Get pending orders from route 2, page 1, 20 items per page

**Request:**
```http
GET /api/sales/orders/by-route?sales_route_id=2&status=pending&page=1&limit=20
```

---

### Example 3: Search orders in route 1
**Description:** Search for specific order by order number within route 1

**Request:**
```http
GET /api/sales/orders/by-route?sales_route_id=1&search=ORD-123
```

---

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

## Usage Notes

1. **sales_route_id is required** - The API will only return orders from customers assigned to the specified sales route
2. **Pagination** - Use `page` and `limit` parameters to control the number of results
3. **Filtering** - Combine multiple filters (route, status, search) for precise results
4. **Delivery Status** - The `delivery_status` field shows the status of the latest delivery
5. **Sales Route Context** - Each customer object includes their assigned sales route information

## Common Use Cases

- **Route Planning:** Sales representatives can view all orders for their assigned route
- **Delivery Management:** Track deliveries organized by geographic route
- **Performance Analysis:** Analyze sales performance by route
- **Customer Service:** Quickly locate orders within a specific area
- **Route Optimization:** Identify high-volume routes for resource allocation
