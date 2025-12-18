# Purchase Order Tax System - Documentation

## Overview
The purchase order system supports **item-wise tax calculation** based on each product's `purchase_tax` percentage. Tax is calculated automatically when creating purchase orders.

## Database Schema

### `purchase_orders` Table
| Column | Type | Description |
|--------|------|-------------|
| `total_amount` | DECIMAL(10,2) | Total of all line items (after discount, before tax) |
| `tax_amount` | DECIMAL(10,2) | **Sum of all item taxes** |
| `discount_amount` | DECIMAL(10,2) | Sum of all item discounts |

### `purchase_order_items` Table
| Column | Type | Description |
|--------|------|-------------|
| `unit_cost` | DECIMAL(10,2) | Cost per unit |
| `quantity` | INT | Number of units |
| `discount` | DECIMAL(10,2) | **Item-level discount** |
| `line_total` | DECIMAL(10,2) | (quantity × unit_cost) - discount |
| `tax_amount` | DECIMAL(10,2) | **Tax for this item** = line_total × (product.purchase_tax / 100) |

### `products` Table
| Column | Type | Description |
|--------|------|-------------|
| `purchase_tax` | DECIMAL(10,2) | **Tax percentage for purchases** (e.g., 10.00 for 10%) |
| `sales_tax` | DECIMAL(10,2) | Tax percentage for sales |

## Tax Calculation Flow

### 1. Product Configuration
First, set the `purchase_tax` percentage on products:

```sql
UPDATE products 
SET purchase_tax = 10.00  -- 10% tax
WHERE id = 5;
```

### 2. Create Purchase Order
When creating a purchase order via `POST /api/purchase/orders`:

```json
{
  "supplier_id": 1,
  "items": [
    {
      "product_id": 5,
      "quantity": 100,
      "unit_cost": 45,
      "discount": 50
    }
  ]
}
```

### 3. Automatic Calculation
The system automatically calculates:

```javascript
// For each item:
const subtotal = quantity × unit_cost;        // 100 × 45 = 4500
const line_total = subtotal - discount;       // 4500 - 50 = 4450
const item_tax = line_total × (purchase_tax / 100);  // 4450 × 10% = 445

// For the order:
const total_amount = sum(all line_totals);    // 4450
const tax_amount = sum(all item_taxes);       // 445
const discount_amount = sum(all discounts);   // 50
```

### 4. API Response
```json
{
  "id": 19,
  "po_number": "PO-1766038606894-857",
  "total_amount": 4450,
  "tax_amount": 445,      // ← Calculated tax
  "discount_amount": 50,
  "items": [
    {
      "id": 27,
      "product_id": 5,
      "quantity": 100,
      "unit_cost": 45,
      "discount": 50,
      "line_total": 4450,
      "tax_amount": 445    // ← Item-level tax
    }
  ]
}
```

## Code Implementation

### Service Layer (`purchase.service.js`)
```javascript
async createPurchaseOrder(data, userId) {
  const { items, ...orderInfo } = data;
  
  let total_amount = 0;
  let discount_amount = 0;
  let tax_amount = 0;

  // Process each item
  items = await Promise.all(items.map(async (item) => {
    const quantity = Number(item.quantity) || 0;
    const unit_cost = Number(item.unit_cost) || 0;
    const discount = Number(item.discount) || 0;

    // Fetch product to get purchase_tax
    const product = await ProductRepository.findById(item.product_id);
    const purchase_tax_rate = product?.purchase_tax ? Number(product.purchase_tax) : 0;

    const subtotal = quantity * unit_cost;
    const line_total = subtotal - discount;

    // Calculate item tax
    const item_tax_amount = (line_total * purchase_tax_rate) / 100;

    discount_amount += discount;
    total_amount += line_total;
    tax_amount += item_tax_amount;

    return {
      ...item,
      tax_amount: item_tax_amount
    };
  }));

  const orderData = {
    ...orderInfo,
    po_number,
    total_amount,
    discount_amount,
    tax_amount,
    created_by: userId
  };

  return await PurchaseOrderRepository.create(orderData, items);
}
```

## Current Status

### ✅ What's Working
- Database schema has all necessary columns
- Models are properly defined
- Service calculates tax automatically
- Repository saves tax amounts

### ⚠️ Current Issue
**Products have `purchase_tax = 0.00`** by default, so all tax calculations result in 0.

### 🔧 Solution
Set the `purchase_tax` percentage on products that should have tax:

```sql
-- Set 10% tax on product 5
UPDATE products SET purchase_tax = 10.00 WHERE id = 5;

-- Set 5% tax on product 6
UPDATE products SET purchase_tax = 5.00 WHERE id = 6;
```

Or via the Products API:
```bash
PUT /api/products/5
{
  "purchase_tax": 10.00
}
```

## Testing

### 1. Set Product Tax
```bash
node setup-product-tax.js
```

### 2. Create Purchase Order
```bash
POST /api/purchase/orders
{
  "supplier_id": 1,
  "items": [
    {
      "product_id": 5,
      "quantity": 100,
      "unit_cost": 45,
      "discount": 50
    }
  ]
}
```

### 3. Verify Tax Calculation
```bash
GET /api/purchase/orders/{id}
```

Check that:
- `items[].tax_amount` = (line_total × purchase_tax%)
- `tax_amount` = sum of all item tax_amounts

## Example Scenarios

### Scenario 1: Single Item with Tax
```
Product: Widget (purchase_tax = 10%)
Quantity: 100
Unit Cost: $45
Discount: $50

Calculation:
- Subtotal: 100 × $45 = $4,500
- Line Total: $4,500 - $50 = $4,450
- Tax: $4,450 × 10% = $445
- Item Total: $4,450 (tax is tracked separately)
```

### Scenario 2: Multiple Items with Different Tax Rates
```
Item 1: Product A (10% tax)
  - 100 × $45 - $50 = $4,450
  - Tax: $445

Item 2: Product B (5% tax)
  - 50 × $30 - $100 = $1,400
  - Tax: $70

Order Totals:
  - total_amount: $5,850
  - tax_amount: $515
  - discount_amount: $150
```

### Scenario 3: No Tax
```
Product: Item C (purchase_tax = 0%)
Quantity: 10
Unit Cost: $100
Discount: $0

Calculation:
- Subtotal: 10 × $100 = $1,000
- Line Total: $1,000 - $0 = $1,000
- Tax: $1,000 × 0% = $0
- Item Total: $1,000
```

## API Endpoints

### Get Purchase Orders
```
GET /api/purchase/orders
```

Response includes `tax_amount` at both order and item level.

### Get Single Purchase Order
```
GET /api/purchase/orders/:id
```

Response includes detailed tax breakdown for each item.

### Create Purchase Order
```
POST /api/purchase/orders
{
  "supplier_id": 1,
  "items": [
    {
      "product_id": 5,
      "quantity": 100,
      "unit_cost": 45,
      "discount": 50
    }
  ]
}
```

Tax is calculated automatically based on product's `purchase_tax`.

## Notes

1. **Tax is calculated on line_total** (after discount), not on subtotal
2. **Each item can have different tax rates** based on the product
3. **Tax is stored separately** from the line_total (not included in total_amount)
4. **Order tax_amount** is the sum of all item tax_amounts
5. **Products must have purchase_tax set** for tax to be calculated (default is 0%)

## Troubleshooting

### Tax is always 0
**Cause**: Product's `purchase_tax` is 0 or NULL
**Solution**: Update the product's `purchase_tax` field

### Tax calculation seems wrong
**Check**:
1. Product's `purchase_tax` value
2. Item's `line_total` (should be after discount)
3. Formula: `tax_amount = line_total × (purchase_tax / 100)`

### Tax not showing in API response
**Check**:
1. Database has `tax_amount` column in both tables
2. Model includes `tax_amount` field
3. Repository includes `tax_amount` in the response
