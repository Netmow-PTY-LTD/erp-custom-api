# Purchase Module - Complete Implementation

## Overview
The purchase module has been completely rebuilt to mirror the sales module structure with comprehensive stock management integration.

## Key Features

### 1. **Stock Management Integration** ✅
- **Automatic Stock Addition**: When goods are received (status: 'completed'), stock is automatically added to inventory
- **Stock Movement Tracking**: All stock changes are recorded in the `stock_movements` table
- **Reference Tracking**: Each stock movement links back to the purchase order for audit trail

### 2. **Complete CRUD Operations**

#### Purchase Orders
- ✅ Create purchase order with multiple items
- ✅ List all purchase orders with pagination and filters
- ✅ Get single purchase order with full details
- ✅ Update purchase order status
- ✅ Delete purchase order

#### Purchase Invoices
- ✅ Create invoice from purchase order
- ✅ List all invoices with pagination
- ✅ Get invoice details with supplier info
- ✅ Auto-generate invoice numbers

#### Purchase Payments
- ✅ Record payments against purchase orders
- ✅ List all payments with filters
- ✅ Get payment details
- ✅ Auto-generate reference numbers

#### Purchase Receipts (Goods Receiving)
- ✅ Record goods receipt
- ✅ Automatically update stock levels
- ✅ Update purchase order status
- ✅ Track received date and receiver

## API Endpoints

### Purchase Orders
```
GET    /api/purchase/orders              - List all purchase orders
POST   /api/purchase/orders              - Create new purchase order
GET    /api/purchase/orders/:id          - Get purchase order details
PUT    /api/purchase/orders/:id          - Update purchase order
DELETE /api/purchase/orders/:id          - Delete purchase order
POST   /api/purchase/orders/:id/receive  - Record goods receipt (adds stock)
```

### Purchase Invoices
```
GET    /api/purchase/orders/invoices     - List all purchase invoices
POST   /api/purchase/orders/invoices     - Create purchase invoice
GET    /api/purchase/orders/invoices/:id - Get invoice details
```

### Purchase Payments
```
GET    /api/purchase/orders/payments     - List all purchase payments
POST   /api/purchase/orders/payments     - Record payment
GET    /api/purchase/orders/payments/:id - Get payment details
```

### Map Integration
```
GET    /api/purchase/maps                - Get supplier locations for map display
```

## Stock Management Flow

### When Creating a Purchase Order:
1. Purchase order is created with items
2. Total amount is auto-calculated
3. PO number is auto-generated (format: `PO-{timestamp}-{random}`)
4. **No stock changes occur at this stage**

### When Receiving Goods (POST /orders/:id/receive):
1. Receipt record is created
2. **For each item in the purchase order:**
   - Product stock is increased by the ordered quantity
   - Stock movement record is created with:
     - `movement_type`: 'purchase'
     - `quantity`: positive number (stock in)
     - `reference_type`: 'purchase_order'
     - `reference_id`: purchase order ID
     - `notes`: Description of the transaction
3. Purchase order status is updated to 'received'
4. Receipt timestamp is recorded

### Stock Movement Example:
```javascript
{
  product_id: 5,
  movement_type: 'purchase',
  quantity: 100,                    // Positive = stock in
  reference_type: 'purchase_order',
  reference_id: 1,
  notes: 'Stock added from purchase order PO-1733131375000-123',
  created_by: 1
}
```

## Sample Workflow

### 1. Create Purchase Order
```json
POST /api/purchase/orders
{
  "supplier_id": 1,
  "expected_delivery_date": "2025-12-15",
  "notes": "Regular monthly stock",
  "items": [
    {
      "product_id": 5,
      "quantity": 100,
      "unit_cost": 45.00,
      "discount": 50.00
    }
  ]
}
```

### 2. Receive Goods (This adds stock!)
```json
POST /api/purchase/orders/1/receive
{
  "status": "completed",
  "receipt_date": "2025-12-09",
  "received_by": "John Doe",
  "notes": "All items received in good condition"
}
```

**Result:**
- Product #5 stock increases by 100 units
- Stock movement record created
- Purchase order status → 'received'

### 3. Create Invoice
```json
POST /api/purchase/orders/invoices
{
  "purchase_order_id": 1,
  "due_date": "2025-12-31"
}
```

### 4. Record Payment
```json
POST /api/purchase/orders/payments
{
  "purchase_order_id": 1,
  "amount": 4450.00,
  "payment_method": "bank_transfer"
}
```

## Database Models

### New Tables Created:
1. **purchase_invoices** - Supplier invoices
2. **purchase_payments** - Payment records
3. **purchase_receipts** - Goods receiving records

### Enhanced Tables:
1. **purchase_orders** - Added payment_status, tax_amount, discount_amount
2. **purchase_order_items** - Added discount field

## Comparison with Sales Module

| Feature | Sales Module | Purchase Module |
|---------|-------------|-----------------|
| Main Entity | Order | Purchase Order |
| Partner | Customer | Supplier |
| Stock Impact | Decreases (-) | Increases (+) |
| Receipt/Delivery | Delivery | Receipt |
| Movement Type | 'sale' | 'purchase' |
| Status Flow | pending → delivered | pending → received |

## Stock Safety Features

✅ **Product Validation**: Checks if product exists before adding stock
✅ **Transaction Safety**: Uses database transactions for data integrity
✅ **Audit Trail**: All stock movements are logged with references
✅ **Status Tracking**: Purchase order status reflects receipt status

## Notes

- Stock is **only added** when receipt status is 'completed'
- Partial receipts update status to 'partial' (future enhancement: track partial quantities)
- All auto-generated numbers use timestamp + random for uniqueness
- Stock movements use positive quantities for purchases (opposite of sales which use negative)
