# Order-Level Sales Tax - Documentation

## Overview
The sales order system now supports **dual-level tax calculation**:
1. **Item-level tax**: Based on each product's `sales_tax` percentage
2. **Order-level tax**: Based on the `sales_tax_percent` parameter in the request

Both taxes are calculated and summed into the `tax_amount` field.

## New Fields

### `orders` Table
| Field | Type | Description |
|-------|------|-------------|
| `sales_tax_percent` | DECIMAL(5,2) | Order-level tax percentage (e.g., 5.00 for 5%) |
| `tax_amount` | DECIMAL(10,2) | **Total tax** = item-level tax + order-level tax |

## API Usage

### POST /api/sales/orders

**Request Body:**
```json
{
  "customer_id": 1,
  "sales_tax_percent": 5,  // ← NEW: Order-level tax percentage
  "items": [
    {
      "product_id": 10,
      "quantity": 2,
      "unit_price": 1000,
      "discount": 200
    }
  ]
}
```

**Response:**
```json
{
  "id": 25,
  "order_number": "ORD-1766040000000-123",
  "customer_id": 1,
  "total_amount": 1800,
  "tax_amount": 270,           // ← Total tax (item + order)
  "sales_tax_percent": 5,      // ← Order-level tax %
  "discount_amount": 200,
  "items": [
    {
      "id": 34,
      "product_id": 10,
      "quantity": 2,
      "unit_price": 1000,
      "discount": 200,
      "line_total": 1800,
      "tax_amount": 180,         // ← Item-level tax only
      "total_price": 1800
    }
  ]
}
```

## Tax Calculation Logic

### Dual-Level Tax Calculation

```javascript
// Step 1: Calculate item-level taxes (from product.sales_tax)
for each item:
  line_total = (quantity × unit_price) - discount
  item_tax = line_total × (product.sales_tax / 100)
  item_level_tax += item_tax

// Step 2: Calculate order-level tax (from sales_tax_percent)
order_level_tax = total_amount × (sales_tax_percent / 100)

// Step 3: Sum both taxes
tax_amount = item_level_tax + order_level_tax
```

### Example Calculation

**Given:**
- Product 10: `sales_tax = 10%` (item-level)
- Order: `sales_tax_percent = 5%` (order-level)
- Item: 2 × $1000 - $200 discount = $1800

**Calculation:**
```
1. Item-level tax:
   $1800 × 10% = $180

2. Order-level tax:
   $1800 × 5% = $90

3. Total tax_amount:
   $180 + $90 = $270
```

**Result:**
```json
{
  "total_amount": 1800,
  "tax_amount": 270,           // Total: $180 + $90
  "sales_tax_percent": 5,
  "items": [
    {
      "line_total": 1800,
      "tax_amount": 180          // Item-level only
    }
  ]
}
```

## Use Cases

### Use Case 1: Only Item-Level Tax
```json
POST /api/sales/orders
{
  "customer_id": 1,
  // No sales_tax_percent provided
  "items": [
    {
      "product_id": 10,  // has sales_tax = 10%
      "quantity": 2,
      "unit_price": 1000,
      "discount": 200
    }
  ]
}
```

**Result:**
- Item tax: $1800 × 10% = $180
- Order tax: $0 (no sales_tax_percent)
- **Total tax_amount: $180**

### Use Case 2: Only Order-Level Tax
```json
POST /api/sales/orders
{
  "customer_id": 1,
  "sales_tax_percent": 5,
  "items": [
    {
      "product_id": 11,  // has sales_tax = 0%
      "quantity": 2,
      "unit_price": 1000,
      "discount": 200
    }
  ]
}
```

**Result:**
- Item tax: $1800 × 0% = $0
- Order tax: $1800 × 5% = $90
- **Total tax_amount: $90**

### Use Case 3: Both Item and Order Tax
```json
POST /api/sales/orders
{
  "customer_id": 1,
  "sales_tax_percent": 5,
  "items": [
    {
      "product_id": 10,  // has sales_tax = 10%
      "quantity": 2,
      "unit_price": 1000,
      "discount": 200
    }
  ]
}
```

**Result:**
- Item tax: $1800 × 10% = $180
- Order tax: $1800 × 5% = $90
- **Total tax_amount: $270**

### Use Case 4: Multiple Items with Mixed Taxes
```json
POST /api/sales/orders
{
  "customer_id": 1,
  "sales_tax_percent": 3,
  "items": [
    {
      "product_id": 10,  // sales_tax = 10%
      "quantity": 2,
      "unit_price": 1000,
      "discount": 200
    },
    {
      "product_id": 11,  // sales_tax = 5%
      "quantity": 5,
      "unit_price": 100,
      "discount": 50
    }
  ]
}
```

**Calculation:**
```
Item 1:
  line_total = (2 × 1000) - 200 = $1800
  item_tax = $1800 × 10% = $180

Item 2:
  line_total = (5 × 100) - 50 = $450
  item_tax = $450 × 5% = $22.50

Total amount: $1800 + $450 = $2250
Item-level tax: $180 + $22.50 = $202.50
Order-level tax: $2250 × 3% = $67.50

Total tax_amount: $202.50 + $67.50 = $270
```

## Field Mapping

### Request → Response

| Request Field | Response Field | Description |
|--------------|----------------|-------------|
| `sales_tax_percent` | `sales_tax_percent` | Order-level tax % (stored as-is) |
| - | `tax_amount` | **Total tax** (calculated: item + order) |
| - | `items[].tax_amount` | Item-level tax (from product.sales_tax) |

### Naming Clarification

You mentioned:
- `sales_tax_percent` ✅ (order-level tax percentage)
- `sales_tax_total` → This is `tax_amount` (total calculated tax)

The response includes:
- **`sales_tax_percent`**: The percentage you provided
- **`tax_amount`**: The total calculated tax (this is your "sales_tax_total")

## Code Implementation

### Service Layer (`sales.service.js`)

```javascript
async createOrder(data, userId) {
  const { items, sales_tax_percent, ...orderInfo } = data;
  
  let total_amount = 0;
  let discount_amount = 0;
  let item_level_tax = 0;

  // Calculate item-level taxes
  items = await Promise.all(items.map(async (item) => {
    const quantity = Number(item.quantity) || 0;
    const unit_price = Number(item.unit_price) || 0;
    const discount = Number(item.discount) || 0;

    const product = await ProductRepository.findById(item.product_id);
    const sales_tax_rate = product?.sales_tax ? Number(product.sales_tax) : 0;

    const subtotal = quantity * unit_price;
    const line_total = subtotal - discount;
    const item_tax_amount = (line_total * sales_tax_rate) / 100;

    discount_amount += discount;
    total_amount += line_total;
    item_level_tax += item_tax_amount;

    return { ...item, tax_amount: item_tax_amount };
  }));

  // Calculate order-level tax
  let order_level_tax = 0;
  const tax_percent = sales_tax_percent ? Number(sales_tax_percent) : 0;
  
  if (tax_percent > 0) {
    order_level_tax = (total_amount * tax_percent) / 100;
  }

  // Total tax
  const tax_amount = item_level_tax + order_level_tax;

  const orderData = {
    ...orderInfo,
    order_number,
    total_amount,
    discount_amount,
    tax_amount,
    sales_tax_percent: tax_percent,
    created_by: userId
  };

  return await OrderRepository.create(orderData, items);
}
```

## Migration

**File:** `20251218-add-sales-tax-percent-to-orders.js`

```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'sales_tax_percent', {
      type: Sequelize.DECIMAL(5, 2),
      defaultValue: 0.00,
      after: 'tax_amount'
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'sales_tax_percent');
  }
};
```

## Testing

### Run Test Script
```bash
node test-order-tax.js
```

### Create Test Order
```bash
POST /api/sales/orders
{
  "customer_id": 1,
  "sales_tax_percent": 5,
  "items": [
    {
      "product_id": 10,
      "quantity": 2,
      "unit_price": 1000,
      "discount": 200
    }
  ]
}
```

### Verify Response
Check that:
- `sales_tax_percent` = 5
- `tax_amount` = item taxes + order tax
- `items[].tax_amount` = individual item taxes

## Important Notes

1. **Optional Field**: `sales_tax_percent` is optional. If not provided, only item-level taxes are calculated.

2. **Both Taxes Apply**: If both product.sales_tax and sales_tax_percent are set, both taxes are calculated and summed.

3. **Order Tax Base**: Order-level tax is calculated on `total_amount` (sum of all line_totals after discounts).

4. **Item Tax Storage**: Item-level taxes are stored in `order_items.tax_amount`.

5. **Total Tax Storage**: The sum of all taxes is stored in `orders.tax_amount`.

6. **Percentage Storage**: The order-level tax percentage is stored in `orders.sales_tax_percent`.

## Backward Compatibility

- **Existing orders**: Will have `sales_tax_percent = 0` (default)
- **Old API calls**: Work as before (no sales_tax_percent = no order-level tax)
- **Item-level tax**: Still works independently

## Files Modified

1. **`src/modules/sales/sales.models.js`**: Added `sales_tax_percent` field
2. **`src/modules/sales/sales.service.js`**: Dual-level tax calculation
3. **Migration**: `20251218-add-sales-tax-percent-to-orders.js`

## Summary

| Tax Type | Source | Stored In | Calculation |
|----------|--------|-----------|-------------|
| Item-level | `product.sales_tax` | `order_items.tax_amount` | `line_total × sales_tax%` |
| Order-level | `request.sales_tax_percent` | `orders.sales_tax_percent` | `total_amount × sales_tax_percent%` |
| **Total** | Both | `orders.tax_amount` | Item tax + Order tax |
