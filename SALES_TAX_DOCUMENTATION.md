# Sales Order Tax System - Documentation

## Overview
The sales order system now supports **item-wise tax calculation** based on each product's `sales_tax` percentage. Tax is calculated automatically when creating sales orders, similar to the purchase order tax system.

## Database Schema

### `orders` Table
| Column | Type | Description |
|--------|------|-------------|
| `total_amount` | DECIMAL(10,2) | Total of all line items (after discount, before tax) |
| `tax_amount` | DECIMAL(10,2) | **Sum of all item taxes** |
| `discount_amount` | DECIMAL(10,2) | Sum of all item discounts |

### `order_items` Table
| Column | Type | Description |
|--------|------|-------------|
| `unit_price` | DECIMAL(10,2) | Price per unit |
| `quantity` | INT | Number of units |
| `discount` | DECIMAL(10,2) | **Item-level discount** |
| `line_total` | DECIMAL(10,2) | (quantity × unit_price) - discount |
| `tax_amount` | DECIMAL(10,2) | **Tax for this item** = line_total × (product.sales_tax / 100) |
| `total_price` | DECIMAL(10,2) | Same as line_total (for backward compatibility) |

### `products` Table
| Column | Type | Description |
|--------|------|-------------|
| `sales_tax` | DECIMAL(10,2) | **Tax percentage for sales** (e.g., 10.00 for 10%) |
| `purchase_tax` | DECIMAL(10,2) | Tax percentage for purchases |

## Tax Calculation Flow

### 1. Product Configuration
First, set the `sales_tax` percentage on products:

```sql
UPDATE products 
SET sales_tax = 10.00  -- 10% tax
WHERE id = 10;
```

### 2. Create Sales Order
When creating a sales order via `POST /api/sales/orders`:

```json
{
  "customer_id": 1,
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

### 3. Automatic Calculation
The system automatically calculates:

```javascript
// For each item:
const subtotal = quantity × unit_price;        // 2 × 1000 = 2000
const line_total = subtotal - discount;        // 2000 - 200 = 1800
const item_tax = line_total × (sales_tax / 100);  // 1800 × 10% = 180

// For the order:
const total_amount = sum(all line_totals);     // 1800
const tax_amount = sum(all item_taxes);        // 180
const discount_amount = sum(all discounts);    // 200
```

### 4. API Response
```json
{
  "id": 25,
  "order_number": "ORD-1766040000000-123",
  "total_amount": 1800,
  "tax_amount": 180,      // ← Calculated tax
  "discount_amount": 200,
  "items": [
    {
      "id": 34,
      "product_id": 10,
      "quantity": 2,
      "unit_price": 1000,
      "discount": 200,
      "line_total": 1800,
      "tax_amount": 180,   // ← Item-level tax
      "total_price": 1800
    }
  ]
}
```

## Code Implementation

### Service Layer (`sales.service.js`)
```javascript
async createOrder(data, userId) {
  const { items, ...orderInfo } = data;
  
  const order_number = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  let total_amount = 0;
  let discount_amount = 0;
  let tax_amount = 0;

  if (items && Array.isArray(items)) {
    const { ProductRepository } = require('../products/products.repository');

    // Process each item
    items = await Promise.all(items.map(async (item) => {
      const quantity = Number(item.quantity) || 0;
      const unit_price = Number(item.unit_price) || 0;
      const discount = Number(item.discount) || 0;

      // Fetch product to get sales_tax
      const product = await ProductRepository.findById(item.product_id);
      const sales_tax_rate = product?.sales_tax ? Number(product.sales_tax) : 0;

      const subtotal = quantity * unit_price;
      const line_total = subtotal - discount;

      // Calculate item tax
      const item_tax_amount = (line_total * sales_tax_rate) / 100;

      discount_amount += discount;
      total_amount += line_total;
      tax_amount += item_tax_amount;

      return {
        ...item,
        tax_amount: item_tax_amount
      };
    }));
  }

  const orderData = {
    ...orderInfo,
    order_number,
    total_amount,
    discount_amount,
    tax_amount,
    created_by: userId
  };

  const order = await OrderRepository.create(orderData, items || []);
  // ... stock deduction logic ...
  return order;
}
```

### Repository Layer (`sales.repository.js`)
```javascript
async create(orderData, itemsData) {
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.create(orderData, { transaction });

    const items = itemsData.map(item => {
      const discount = item.discount || 0;
      const subtotal = item.quantity * item.unit_price;
      const line_total = item.line_total || (subtotal - discount);

      return {
        ...item,
        order_id: order.id,
        discount: discount,
        line_total: line_total,
        tax_amount: item.tax_amount || 0,  // ← Save tax amount
        total_price: line_total
      };
    });

    if (items.length > 0) {
      await OrderItem.bulkCreate(items, { transaction });
    }

    await transaction.commit();
    return await this.findById(order.id);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
```

## Current Status

### ✅ What's Implemented
- Database schema updated with `tax_amount` column in `order_items`
- Model includes `tax_amount` field with proper getter
- Service calculates tax automatically based on product's `sales_tax`
- Repository saves tax amounts to database
- Migration successfully applied

### ⚠️ Existing Orders
**Old orders have `tax_amount = 0.00`** because they were created before this feature was added. Only new orders will have calculated tax.

### 🔧 How to Enable Tax

Set the `sales_tax` percentage on products:

```sql
-- Set 10% tax on product 10
UPDATE products SET sales_tax = 10.00 WHERE id = 10;

-- Set 5% tax on product 5
UPDATE products SET sales_tax = 5.00 WHERE id = 5;
```

Or via the Products API:
```bash
PUT /api/products/10
{
  "sales_tax": 10.00
}
```

## Example Scenarios

### Scenario 1: Single Item with Tax
```
Product: fdfghj (sales_tax = 10%)
Quantity: 2
Unit Price: $1000
Discount: $200

Calculation:
- Subtotal: 2 × $1000 = $2,000
- Line Total: $2,000 - $200 = $1,800
- Tax: $1,800 × 10% = $180
- Item Total: $1,800 (tax tracked separately)
```

### Scenario 2: Multiple Items with Different Tax Rates
```
Item 1: Product A (10% tax)
  - 2 × $1000 - $200 = $1,800
  - Tax: $180

Item 2: Product B (5% tax)
  - 5 × $100 - $50 = $450
  - Tax: $22.50

Order Totals:
  - total_amount: $2,250
  - tax_amount: $202.50
  - discount_amount: $250
```

### Scenario 3: No Tax
```
Product: Item C (sales_tax = 0%)
Quantity: 10
Unit Price: $50
Discount: $0

Calculation:
- Subtotal: 10 × $50 = $500
- Line Total: $500 - $0 = $500
- Tax: $500 × 0% = $0
- Item Total: $500
```

## API Endpoints

### Get Sales Orders
```
GET /api/sales/orders
```

Response includes `tax_amount` at both order and item level.

### Get Single Sales Order
```
GET /api/sales/orders/:id
```

Response includes detailed tax breakdown for each item.

### Create Sales Order
```
POST /api/sales/orders
{
  "customer_id": 1,
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

Tax is calculated automatically based on product's `sales_tax`.

## Comparison: Sales Tax vs Purchase Tax

| Feature | Sales Orders | Purchase Orders |
|---------|--------------|-----------------|
| Tax Field | `product.sales_tax` | `product.purchase_tax` |
| Item Tax Field | `order_items.tax_amount` | `purchase_order_items.tax_amount` |
| Order Tax Field | `orders.tax_amount` | `purchase_orders.tax_amount` |
| Calculation | `line_total × (sales_tax / 100)` | `line_total × (purchase_tax / 100)` |
| Stock Impact | Deducts stock | Adds stock |

## Testing

### 1. Set Product Tax
```bash
node setup-sales-tax.js
```

### 2. Create Sales Order
```bash
POST /api/sales/orders
{
  "customer_id": 1,
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

### 3. Verify Tax Calculation
```bash
GET /api/sales/orders/{id}
```

Check that:
- `items[].tax_amount` = (line_total × sales_tax%)
- `tax_amount` = sum of all item tax_amounts

## Notes

1. **Tax is calculated on line_total** (after discount), not on subtotal
2. **Each item can have different tax rates** based on the product
3. **Tax is stored separately** from the line_total (not included in total_amount)
4. **Order tax_amount** is the sum of all item tax_amounts
5. **Products must have sales_tax set** for tax to be calculated (default is 0%)
6. **Backward compatible**: Existing orders continue to work with `tax_amount = 0`

## Troubleshooting

### Tax is always 0
**Cause**: Product's `sales_tax` is 0 or NULL  
**Solution**: Update the product's `sales_tax` field

### Tax calculation seems wrong
**Check**:
1. Product's `sales_tax` value
2. Item's `line_total` (should be after discount)
3. Formula: `tax_amount = line_total × (sales_tax / 100)`

### Tax not showing in API response
**Check**:
1. Database has `tax_amount` column in `order_items` table
2. Model includes `tax_amount` field
3. Repository includes `tax_amount` in the response

### Old orders don't have tax
**Expected**: Orders created before this feature was added will have `tax_amount = 0`. This is normal and expected behavior.

## Migration History

- **20251218-add-tax-to-order-items.js**: Added `tax_amount` column to `order_items` table
- Successfully applied on: 2025-12-18

## Files Modified

1. **`src/modules/sales/sales.models.js`**: Added `tax_amount` field to `OrderItem` model
2. **`src/modules/sales/sales.service.js`**: Updated `createOrder` to calculate item-wise tax
3. **`src/modules/sales/sales.repository.js`**: Updated `create` to save `tax_amount`
4. **`src/core/database/migrations/20251218-add-tax-to-order-items.js`**: Database migration
