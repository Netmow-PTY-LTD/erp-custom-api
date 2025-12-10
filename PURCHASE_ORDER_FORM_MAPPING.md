# Create Purchase Order Form Field Mapping

This document maps the Create Purchase Order Form fields to the API request body.

## API Endpoint

**POST** `/api/purchase/orders` *(To be implemented)*

## Form Fields to API Mapping

### Header Section

| Form Field | API Field | Type | Required | Example | Notes |
|------------|-----------|------|----------|---------|-------|
| Supplier | `supplier_id` | number | ✅ Yes | 1 | Supplier ID from dropdown |
| Order Date | `order_date` | string | ❌ Optional | "2025-12-02" | Defaults to today |
| Expected Date | `expected_delivery_date` | string | ❌ Optional | "2025-12-15" | Expected delivery date |
| Notes | `notes` | string | ❌ Optional | "Urgent procurement" | Internal notes |

### Order Items Section

Each row maps to an object in the `items` array:

| Form Field | API Field | Type | Required | Example | Notes |
|------------|-----------|------|----------|---------|-------|
| Product | `product_id` | number | ✅ Yes | 5 | Product ID from dropdown |
| Quantity | `quantity` | number | ✅ Yes | 100 | Number of units to purchase |
| Unit Cost (RM) | `unit_cost` | number | ✅ Yes | 45.00 | Cost per unit from supplier |
| Line Total (RM) | `line_total` | number | ✅ Yes | 4500.00 | Calculated: quantity × unit_cost |

### Summary Section

| Form Field | API Field | Type | Description |
|------------|-----------|------|-------------|
| Subtotal | (calculated) | number | Sum of all line totals |
| Total | `total_amount` | number | Final total (currently same as subtotal) |

---

## Sample API Requests

### Example 1: Basic Purchase Order

```json
{
  "supplier_id": 1,
  "order_date": "2025-12-02",
  "expected_delivery_date": "2025-12-15",
  "notes": "Regular monthly stock replenishment",
  "items": [
    {
      "product_id": 5,
      "quantity": 100,
      "unit_cost": 45.00,
      "line_total": 4500.00
    },
    {
      "product_id": 8,
      "quantity": 50,
      "unit_cost": 80.00,
      "line_total": 4000.00
    },
    {
      "product_id": 12,
      "quantity": 200,
      "unit_cost": 15.00,
      "line_total": 3000.00
    }
  ]
}
```

**Breakdown:**
- Item 1: 100 units × RM 45.00 = RM 4,500.00
- Item 2: 50 units × RM 80.00 = RM 4,000.00
- Item 3: 200 units × RM 15.00 = RM 3,000.00
- **Subtotal: RM 11,500.00**
- **Total: RM 11,500.00**

---

### Example 2: Urgent Purchase Order

```json
{
  "supplier_id": 3,
  "order_date": "2025-12-02",
  "expected_delivery_date": "2025-12-05",
  "notes": "URGENT - Low stock items, expedited delivery required",
  "items": [
    {
      "product_id": 25,
      "quantity": 500,
      "unit_cost": 8.50,
      "line_total": 4250.00
    }
  ]
}
```

**Breakdown:**
- Item 1: 500 units × RM 8.50 = RM 4,250.00
- **Total: RM 4,250.00**

---

### Example 3: Malaysian Supplier Order

```json
{
  "supplier_id": 5,
  "order_date": "2025-12-02",
  "expected_delivery_date": "2025-12-20",
  "notes": "Bulk order from Penang supplier - CNY stock preparation",
  "items": [
    {
      "product_id": 30,
      "quantity": 1000,
      "unit_cost": 12.50,
      "line_total": 12500.00
    },
    {
      "product_id": 31,
      "quantity": 500,
      "unit_cost": 25.00,
      "line_total": 12500.00
    },
    {
      "product_id": 32,
      "quantity": 250,
      "unit_cost": 50.00,
      "line_total": 12500.00
    }
  ]
}
```

**Breakdown:**
- Item 1: 1,000 units × RM 12.50 = RM 12,500.00
- Item 2: 500 units × RM 25.00 = RM 12,500.00
- Item 3: 250 units × RM 50.00 = RM 12,500.00
- **Total: RM 37,500.00**

---

## Sample API Response

```json
{
  "status": true,
  "message": "Purchase order created successfully",
  "data": {
    "id": 15,
    "po_number": "PO-1733131375000",
    "supplier_id": 1,
    "order_date": "2025-12-02T00:00:00.000Z",
    "expected_delivery_date": "2025-12-15T00:00:00.000Z",
    "status": "pending",
    "total_amount": "11500.00",
    "notes": "Regular monthly stock replenishment",
    "created_by": 1,
    "created_at": "2025-12-02T11:02:55.000Z",
    "updated_at": "2025-12-02T11:02:55.000Z",
    "items": [
      {
        "id": 45,
        "purchase_order_id": 15,
        "product_id": 5,
        "quantity": 100,
        "unit_cost": "45.00",
        "line_total": "4500.00"
      },
      {
        "id": 46,
        "purchase_order_id": 15,
        "product_id": 8,
        "quantity": 50,
        "unit_cost": "80.00",
        "line_total": "4000.00"
      },
      {
        "id": 47,
        "purchase_order_id": 15,
        "product_id": 12,
        "quantity": 200,
        "unit_cost": "15.00",
        "line_total": "3000.00"
      }
    ],
    "supplier": {
      "id": 1,
      "name": "Global Electronics Ltd",
      "contact_person": "Alice Johnson"
    }
  }
}
```

---

## Field Calculations

### Frontend Calculations Required

1. **Line Total (per item):**
   ```javascript
   lineTotal = quantity × unitCost
   
   // Example: 100 units × RM 45.00
   lineTotal = 100 × 45.00 = 4500.00
   ```

2. **Subtotal:**
   ```javascript
   subtotal = items.reduce((sum, item) => sum + item.line_total, 0)
   
   // Example: RM 4,500 + RM 4,000 + RM 3,000
   subtotal = 11500.00
   ```

3. **Total Amount:**
   ```javascript
   total = subtotal  // Currently no additional charges
   
   // In future: total = subtotal + tax + shipping - discount
   ```

### Backend Calculations

The API automatically:
- Generates unique `po_number` (format: PO-{timestamp})
- Sets `status` to "pending"
- Records `created_by` (from authenticated user)
- Sets timestamps

---

## Field Validations

### Supplier
- **Required**: Yes
- **Type**: Integer (positive)
- **Must Exist**: Must reference existing supplier

### Order Date
- **Required**: No (defaults to current date)
- **Format**: YYYY-MM-DD
- **Example**: "2025-12-02"

### Expected Delivery Date
- **Required**: No
- **Format**: YYYY-MM-DD
- **Should Be**: After order date
- **Example**: "2025-12-15"

### Items Array
- **Required**: Yes
- **Min Items**: At least 1 item required
- **Max Items**: Unlimited

### Quantity (per item)
- **Required**: Yes
- **Type**: Integer (positive)
- **Min Value**: 1

### Unit Cost (per item)
- **Required**: Yes
- **Type**: Decimal number
- **Min Value**: 0
- **Format**: Up to 10 digits, 2 decimal places

---

## Complete Request Flow

### 1. Load Suppliers for Dropdown
```
GET /api/suppliers/?is_active=true
```

### 2. Load Products for Dropdown
```
GET /api/products/?is_active=true
```

### 3. Get Product Details (when selected)
```
GET /api/products/:id
```
Returns: `name`, `sku`, `cost` (default unit cost)

### 4. Create Purchase Order
```
POST /api/purchase/orders
```

---

## Purchase Order Status Flow

| Status | Description |
|--------|-------------|
| `pending` | Initial status after creation |
| `approved` | PO approved by manager |
| `ordered` | Order sent to supplier |
| `partial` | Partially received |
| `received` | Fully received |
| `cancelled` | Order cancelled |

---

## Difference: Sales Order vs Purchase Order

| Aspect | Sales Order | Purchase Order |
|--------|-------------|----------------|
| From | Customer | To Supplier |
| Field | `customer_id` | `supplier_id` |
| Price Field | `unit_price` (selling) | `unit_cost` (buying) |
| Purpose | Sell products | Buy inventory |
| Affects Stock | Decreases | Increases (when received) |

---

## Related Operations

After creating a Purchase Order, typical workflow:

1. **Create PO** → `POST /api/purchase/orders`
2. **Receive Goods** → `POST /api/purchase/receipts`
3. **Create Invoice** → `POST /api/purchase/invoices`
4. **Make Payment** → `POST /api/purchase/payments`
5. **Update Product Stock** → Auto-updated on receipt

---

## Important Notes

1. **Supplier Must Exist**: Ensure supplier is created first via `/api/suppliers`

2. **Products Must Exist**: All product_ids must reference existing products

3. **Unit Cost vs Unit Price**: 
   - `unit_cost` = What you pay supplier (buying price)
   - `unit_price` = What you charge customer (selling price)

4. **Stock Updates**: Stock is NOT updated when PO is created. Stock updates when goods are received via Goods Receipt.

5. **Multiple Line Items**: Form shows 3 item rows, but API accepts unlimited items in the array

6. **Auto-Generated PO Number**: System generates unique PO number automatically

7. **Expected Date**: Helps track delivery timelines and late orders

8. **Authentication Required**: All requests need Bearer token

---

## Future Enhancements

### Potential Additional Fields

```json
{
  "discount_amount": 0.00,      // Supplier discount
  "tax_amount": 0.00,            // Import tax/duties
  "shipping_cost": 0.00,         // Shipping charges
  "payment_terms": "Net 30",     // Payment terms
  "delivery_address": "...",     // Delivery location
  "reference_number": "..."      // Supplier quote reference
}
```

### Additional Calculations
```javascript
total = subtotal + tax + shipping - discount
```

---

## Error Handling

**Supplier Not Found:**
```json
{
  "status": false,
  "message": "Supplier not found"
}
```

**Product Not Found:**
```json
{
  "status": false,
  "message": "Product with id 25 not found"
}
```

**No Items:**
```json
{
  "status": false,
  "message": "At least one item is required"
}
```

**Validation Error:**
```json
{
  "status": false,
  "message": "Validation Error",
  "errors": [
    {
      "path": ["supplier_id"],
      "message": "Supplier ID is required"
    },
    {
      "path": ["items", 0, "quantity"],
      "message": "Quantity must be a positive number"
    }
  ]
}
```

---

## Purchase Module Structure (To Be Implemented)

The Purchase module would mirror the Sales module:

**Models:**
- PurchaseOrder
- PurchaseOrderItem
- GoodsReceipt
- PurchaseInvoice
- SupplierPayment

**Endpoints:**
- `POST /api/purchase/orders` - Create PO
- `GET /api/purchase/orders` - List POs
- `GET /api/purchase/orders/:id` - Get PO details
- `PUT /api/purchase/orders/:id` - Update PO
- `POST /api/purchase/receipts` - Receive goods
- `POST /api/purchase/invoices` - Create invoice
- `POST /api/purchase/payments` - Make payment

---

## Next Steps

To fully implement Purchase Orders:
1. Create Purchase module (similar to Sales module)
2. Create database migrations for purchase tables
3. Implement repository, service, controller layers
4. Add validation schemas
5. Register routes
6. Test all CRUD operations
