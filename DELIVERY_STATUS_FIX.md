# Delivery Status Update Fix

## Issue Description
When recording a delivery with status `'returned'` using `POST /api/sales/orders/:id/deliver`, the payload status was saved in the Delivery record, but the associated Order status was not updating.

## Root Cause
1. **Service Logic**: The `SalesService.createDelivery` method explicitly only updated the Order status if the delivery status was `'delivered'`, `'in_transit'`, or `'confirmed'`. It ignored `'returned'` and `'failed'`.
2. **Data Model**: The `Order` model's `status` ENUM did not include `'returned'` or `'failed'`, although the `Delivery` model did.

## Solution
1. **Updated Order Model**: Modified `src/modules/sales/sales.models.js` to add `'returned'` and `'failed'` to the `status` ENUM.
   ```javascript
   status: {
       type: DataTypes.ENUM('pending', 'confirmed', 'processing', 'shipped', 'in_transit', 'delivered', 'cancelled', 'returned', 'failed'),
       defaultValue: 'pending'
   }
   ```

2. **Updated Service Logic**: Modified `src/modules/sales/sales.service.js` to handle all relevant statuses.
   ```javascript
   // Update Order status based on delivery status
   if (['delivered', 'in_transit', 'confirmed', 'returned', 'failed'].includes(data.status)) {
       await OrderRepository.update(orderId, { status: data.status });
   }
   ```

## Testing
To verify the fix:
1. Send a POST request to `/api/sales/orders/:id/deliver` with `status: "returned"`.
2. Verify that the response indicates success.
3. Fetch the Order using `GET /api/sales/orders/:id` and verify its `status` is now `'returned'`.

```bash
curl -X POST "http://localhost:5000/api/sales/orders/1/deliver" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "returned",
    "delivery_date": "2026-01-23",
    "notes": "Customer refused delivery"
  }'
```

## Impact
- **Orders**: Can now track `returned` and `failed` states directly.
- **Deliveries**: Status changes now correctly propagate to the parent Order.
