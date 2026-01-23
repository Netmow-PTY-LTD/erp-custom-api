# Sales Order Update API Fix

## Issue Description
When updating an order via `PUT /api/sales/orders/:id`, the API was not returning the complete updated order data with relationships (customer, items, delivery). Instead, it only returned the basic order fields without the associated data.

## Problem
The `OrderRepository.update()` method was using Sequelize's `order.update(data)` which only returns the updated model instance without eager-loaded relationships. This caused inconsistency between:
- **GET /api/sales/orders/:id** - Returns complete order with customer, items, delivery
- **PUT /api/sales/orders/:id** - Was returning only basic order fields

## Solution
Modified the `OrderRepository.update()` method to fetch the complete order data after updating by calling `this.findById(id)`, which includes all relationships.

### Before
```javascript
async update(id, data) {
    const order = await Order.findByPk(id);
    if (!order) return null;
    return await order.update(data);
}
```

### After
```javascript
async update(id, data) {
    const order = await Order.findByPk(id);
    if (!order) return null;
    await order.update(data);
    
    // Fetch the complete order with all relationships to return updated data
    return await this.findById(id);
}
```

## What's Included Now
After updating an order, the response now includes:

✅ **Order Details**
- id, order_number, customer_id
- order_date, status, total_amount
- tax_amount, discount_amount
- shipping_address, billing_address
- payment_status, notes, due_date
- created_at, updated_at

✅ **Customer Information**
- id, name, email, phone, company
- address, city, state, country

✅ **Order Items**
- Complete list of items with:
  - quantity, unit_price, discount
  - line_total, total_price
  - Product details (name, sku, price, image_url)

✅ **Latest Delivery** (if exists)
- delivery_number, delivery_date
- status, tracking_number
- delivery_person details

## Testing

### Test the Fix
```bash
# 1. Update an order status
curl -X PUT "http://192.168.0.176:5000/api/sales/orders/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "delivered"}'

# Expected Response:
{
  "success": true,
  "message": "Order updated successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-1733130000000",
    "status": "delivered",  // ✅ Updated status
    "customer": {           // ✅ Customer data included
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "items": [              // ✅ Order items included
      {
        "id": 1,
        "quantity": 2,
        "product": {
          "name": "Wireless Mouse",
          "sku": "MOU-001"
        }
      }
    ],
    "delivery": {           // ✅ Delivery data included
      "delivery_number": "DEL-123456",
      "status": "delivered"
    }
  }
}
```

## Files Modified
- **src/modules/sales/sales.repository.js** - Updated `OrderRepository.update()` method

## Benefits
1. **Consistency** - PUT and GET endpoints now return the same data structure
2. **Better UX** - Frontend can immediately use the updated data without making another GET request
3. **Reduced API Calls** - No need to fetch the order again after updating
4. **Complete Data** - All relationships are included in the response

## Impact
- ✅ No breaking changes
- ✅ Backward compatible
- ✅ Improves API consistency
- ✅ Better developer experience

## Related Endpoints
This fix applies to:
- `PUT /api/sales/orders/:id` - Update order

The following endpoints already return complete data:
- `GET /api/sales/orders` - List all orders
- `GET /api/sales/orders/:id` - Get single order
- `POST /api/sales/orders` - Create order
