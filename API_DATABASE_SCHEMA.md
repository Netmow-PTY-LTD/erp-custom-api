# Complete Database Schema for All API Routes

This document provides database schema information for all API endpoints in the ERP system.

---

## Products Module

### GET /api/products/
**Tables**: `products`, `categories`, `units`, `product_images`  
**Main Table**: `products`  
**Fields**:
- products: id, name, sku, description, category_id, unit_id, price, cost, stock_quantity, initial_stock, min_stock_level, max_stock_level, barcode, image_url, weight, length, width, height, is_active, created_by, created_at, updated_at
- categories: id, name
- units: id, name, symbol
- product_images: id, product_id, image_url, sort_order

**Relationships**:
- products.category_id → categories.id (FK)
- products.unit_id → units.id (FK)
- product_images.product_id → products.id (FK)

### POST /api/products/
**Tables**: `products`, `product_images`  
**Main Table**: `products`  
**Required Fields**: name, sku, price, category_id, unit_id  
**Optional Fields**: description, cost, stock_quantity, initial_stock, min_stock_level, max_stock_level, barcode, image_url, weight, length, width, height, is_active  
**Auto-Generated**: id, created_at, updated_at

### GET /api/products/:id
**Tables**: `products`, `categories`, `units`, `product_images`  
**Main Table**: `products`  
**Same as GET /products/** with full details

### PUT /api/products/:id
**Tables**: `products`, `product_images`  
**Main Table**: `products`  
**Updatable Fields**: name, sku, description, category_id, unit_id, price, cost, stock_quantity, initial_stock, min_stock_level, max_stock_level, barcode, image_url, weight, is_active  
**Read-Only**: id, created_at  
**Auto-Updated**: updated_at

### PUT /api/products/:id/stock
**Tables**: `products`, `stock_movements`  
**Main Table**: `products`  
**Updated Fields**: stock_quantity  
**Side Effects**:
- Creates record in stock_movements
- Records movement_type, quantity, reference_type, notes

### GET /api/products/:id/stock/movements
**Tables**: `stock_movements`, `products`  
**Main Table**: `stock_movements`  
**Fields**: id, product_id, movement_type, quantity, reference_type, reference_id, notes, created_by, created_at

---

## Sales Module

### GET /api/sales/orders
**Tables**: `orders`, `order_items`, `customers`, `products`  
**Main Table**: `orders`  
**Fields**:
- orders: id, order_number, customer_id, order_date, status, total_amount, tax_amount, discount_amount, shipping_address, billing_address, notes, payment_status, created_at
- customers: id, name, email, phone, company
- order_items: id, order_id, product_id, quantity, unit_price, discount, line_total
- products: id, name, sku, price, image_url

**Relationships**:
- orders.customer_id → customers.id (FK)
- order_items.order_id → orders.id (FK)
- order_items.product_id → products.id (FK)

### POST /api/sales/orders
**Tables**: `orders`, `order_items`, `stock_movements`  
**Main Table**: `orders`  
**Required Fields**: customer_id, items (array)  
**Optional Fields**: shipping_address, billing_address, notes, due_date  
**Auto-Generated**: id, order_number, total_amount, created_at, updated_at  
**Side Effects**:
- Decreases products.stock_quantity
- Creates stock_movements records (movement_type: 'sale')

### GET /api/sales/orders/invoices
**Tables**: `invoices`, `orders`, `customers`  
**Main Table**: `invoices`  
**Fields**:
- invoices: id, invoice_number, order_id, invoice_date, due_date, total_amount, status, created_at
- orders: id, order_number, customer_id, total_amount, status
- customers: id, name, email, phone, company

**Relationships**:
- invoices.order_id → orders.id (FK)
- orders.customer_id → customers.id (FK)

### POST /api/sales/orders/invoices
**Tables**: `invoices`  
**Main Table**: `invoices`  
**Required Fields**: order_id  
**Optional Fields**: due_date  
**Auto-Generated**: id, invoice_number, total_amount, invoice_date, created_at

### GET /api/sales/orders/payments
**Tables**: `payments`, `orders`, `invoices`, `customers`  
**Main Table**: `payments`  
**Fields**:
- payments: id, order_id, invoice_id, amount, payment_date, payment_method, reference_number, status, created_at
- orders: id, order_number, customer_id
- customers: id, name, email, phone, company
- invoices: id, invoice_number

**Relationships**:
- payments.order_id → orders.id (FK)
- payments.invoice_id → invoices.id (FK)
- orders.customer_id → customers.id (FK)

### POST /api/sales/orders/payments
**Tables**: `payments`  
**Main Table**: `payments`  
**Required Fields**: order_id, amount, payment_method  
**Optional Fields**: invoice_id, reference_number  
**Auto-Generated**: id, payment_date, created_at

### POST /api/sales/orders/:id/deliver
**Tables**: `deliveries`, `orders`  
**Main Table**: `deliveries`  
**Required Fields**: status  
**Optional Fields**: delivery_date, delivery_address, delivery_person_name, delivery_person_phone, tracking_number, notes  
**Auto-Generated**: id, delivery_number, created_at  
**Side Effects**:
- Updates orders.status to 'delivered' or 'shipped'

---

## Purchase Module

### GET /api/purchase/orders
**Tables**: `purchase_orders`, `purchase_order_items`, `suppliers`, `products`  
**Main Table**: `purchase_orders`  
**Fields**:
- purchase_orders: id, po_number, supplier_id, order_date, expected_delivery_date, status, total_amount, tax_amount, discount_amount, payment_status, notes, created_at
- suppliers: id, name, email, phone, contact_person
- purchase_order_items: id, purchase_order_id, product_id, quantity, unit_cost, discount, line_total
- products: id, name, sku, price, image_url

**Relationships**:
- purchase_orders.supplier_id → suppliers.id (FK)
- purchase_order_items.purchase_order_id → purchase_orders.id (FK)
- purchase_order_items.product_id → products.id (FK)

### POST /api/purchase/orders
**Tables**: `purchase_orders`, `purchase_order_items`  
**Main Table**: `purchase_orders`  
**Required Fields**: supplier_id, items (array)  
**Optional Fields**: order_date, expected_delivery_date, notes  
**Auto-Generated**: id, po_number, total_amount, created_at, updated_at

### POST /api/purchase/orders/:id/receive
**Tables**: `purchase_receipts`, `purchase_orders`, `stock_movements`, `products`  
**Main Table**: `purchase_receipts`  
**Required Fields**: status  
**Optional Fields**: receipt_date, received_by, notes  
**Auto-Generated**: id, receipt_number, created_at  
**Side Effects**:
- Increases products.stock_quantity
- Creates stock_movements records (movement_type: 'purchase')
- Updates purchase_orders.status to 'received'

### GET /api/purchase/orders/invoices
**Tables**: `purchase_invoices`, `purchase_orders`, `suppliers`  
**Main Table**: `purchase_invoices`  
**Fields**:
- purchase_invoices: id, invoice_number, purchase_order_id, invoice_date, due_date, total_amount, status, created_at
- purchase_orders: id, po_number, supplier_id, total_amount, status
- suppliers: id, name, email, phone, contact_person

**Relationships**:
- purchase_invoices.purchase_order_id → purchase_orders.id (FK)
- purchase_orders.supplier_id → suppliers.id (FK)

### POST /api/purchase/orders/invoices
**Tables**: `purchase_invoices`  
**Main Table**: `purchase_invoices`  
**Required Fields**: purchase_order_id  
**Optional Fields**: due_date  
**Auto-Generated**: id, invoice_number, total_amount, invoice_date, created_at

### GET /api/purchase/orders/payments
**Tables**: `purchase_payments`, `purchase_orders`, `purchase_invoices`, `suppliers`  
**Main Table**: `purchase_payments`  
**Fields**:
- purchase_payments: id, purchase_order_id, invoice_id, amount, payment_date, payment_method, reference_number, status, created_at
- purchase_orders: id, po_number, supplier_id
- suppliers: id, name, email, phone, contact_person
- purchase_invoices: id, invoice_number

**Relationships**:
- purchase_payments.purchase_order_id → purchase_orders.id (FK)
- purchase_payments.invoice_id → purchase_invoices.id (FK)
- purchase_orders.supplier_id → suppliers.id (FK)

### POST /api/purchase/orders/payments
**Tables**: `purchase_payments`  
**Main Table**: `purchase_payments`  
**Required Fields**: purchase_order_id, amount, payment_method  
**Optional Fields**: invoice_id, reference_number  
**Auto-Generated**: id, payment_date, created_at

---

## Customers Module

### GET /api/customers/
**Tables**: `customers`  
**Main Table**: `customers`  
**Fields**: id, name, email, phone, company, address, city, state, country, postal_code, tax_id, credit_limit, payment_terms, notes, is_active, created_at, updated_at

### POST /api/customers/
**Tables**: `customers`  
**Main Table**: `customers`  
**Required Fields**: name  
**Optional Fields**: email, phone, company, address, city, state, country, postal_code, tax_id, credit_limit, payment_terms, notes, is_active  
**Auto-Generated**: id, created_at, updated_at

### GET /api/customers/:id
**Tables**: `customers`  
**Main Table**: `customers`  
**Same as GET /customers/**

### PUT /api/customers/:id
**Tables**: `customers`  
**Main Table**: `customers`  
**Updatable Fields**: name, email, phone, company, address, city, state, country, postal_code, tax_id, credit_limit, payment_terms, notes, is_active  
**Read-Only**: id, created_at  
**Auto-Updated**: updated_at

---

## Suppliers Module

### GET /api/suppliers/
**Tables**: `suppliers`  
**Main Table**: `suppliers`  
**Fields**: id, name, contact_person, email, phone, address, city, state, country, postal_code, latitude, longitude, tax_id, website, payment_terms, notes, is_active, created_at, updated_at

### POST /api/suppliers/
**Tables**: `suppliers`  
**Main Table**: `suppliers`  
**Required Fields**: name  
**Optional Fields**: contact_person, email, phone, address, city, state, country, postal_code, latitude, longitude, tax_id, website, payment_terms, notes, is_active  
**Auto-Generated**: id, created_at, updated_at

### GET /api/suppliers/:id
**Tables**: `suppliers`  
**Main Table**: `suppliers`  
**Same as GET /suppliers/**

### PUT /api/suppliers/:id
**Tables**: `suppliers`  
**Main Table**: `suppliers`  
**Updatable Fields**: name, contact_person, email, phone, address, city, state, country, postal_code, latitude, longitude, tax_id, website, payment_terms, notes, is_active  
**Read-Only**: id, created_at  
**Auto-Updated**: updated_at

---

## Categories Module

### GET /api/products/categories
**Tables**: `categories`  
**Main Table**: `categories`  
**Fields**: id, name, description, parent_id, is_active, created_at, updated_at

**Relationships**:
- categories.parent_id → categories.id (FK, self-referencing)

### POST /api/products/categories
**Tables**: `categories`  
**Main Table**: `categories`  
**Required Fields**: name  
**Optional Fields**: description, parent_id, is_active  
**Auto-Generated**: id, created_at, updated_at

---

## Units Module

### GET /api/products/units
**Tables**: `units`  
**Main Table**: `units`  
**Fields**: id, name, symbol, description, is_active, created_at, updated_at

### POST /api/products/units
**Tables**: `units`  
**Main Table**: `units`  
**Required Fields**: name, symbol  
**Optional Fields**: description, is_active  
**Auto-Generated**: id, created_at, updated_at

---

## Stock Movements

### Table: stock_movements
**Fields**: id, product_id, movement_type, quantity, reference_type, reference_id, notes, created_by, created_at

**Movement Types**:
- `sale` - Stock decreased by sales order
- `purchase` - Stock increased by purchase receipt
- `adjustment` - Manual stock adjustment
- `return` - Stock returned

**Reference Types**:
- `order` - Sales order
- `purchase_order` - Purchase order
- `manual_adjustment` - Manual change

**Relationships**:
- stock_movements.product_id → products.id (FK)
- stock_movements.reference_id → orders.id or purchase_orders.id (polymorphic)

---

## Key Relationships Summary

### Product Relationships
```
products
├── categories (category_id → categories.id)
├── units (unit_id → units.id)
├── product_images (product_id ← product_images.product_id)
└── stock_movements (product_id ← stock_movements.product_id)
```

### Sales Flow
```
customers
└── orders (customer_id ← orders.customer_id)
    ├── order_items (order_id ← order_items.order_id)
    │   └── products (product_id → products.id)
    ├── invoices (order_id ← invoices.order_id)
    │   └── payments (invoice_id ← payments.invoice_id)
    ├── payments (order_id ← payments.order_id)
    ├── deliveries (order_id ← deliveries.order_id)
    └── stock_movements (reference_id ← stock_movements.reference_id)
```

### Purchase Flow
```
suppliers
└── purchase_orders (supplier_id ← purchase_orders.supplier_id)
    ├── purchase_order_items (purchase_order_id ← purchase_order_items.purchase_order_id)
    │   └── products (product_id → products.id)
    ├── purchase_invoices (purchase_order_id ← purchase_invoices.purchase_order_id)
    │   └── purchase_payments (invoice_id ← purchase_payments.invoice_id)
    ├── purchase_payments (purchase_order_id ← purchase_payments.purchase_order_id)
    ├── purchase_receipts (purchase_order_id ← purchase_receipts.purchase_order_id)
    └── stock_movements (reference_id ← stock_movements.reference_id)
```

---

## Database Constraints

### Foreign Keys
- All `*_id` fields are foreign keys with appropriate constraints
- Most use `ON DELETE CASCADE` for child records
- Some use `ON DELETE SET NULL` for optional references

### Unique Constraints
- products.sku (UNIQUE)
- customers.email (UNIQUE)
- suppliers.email (UNIQUE)
- orders.order_number (UNIQUE)
- purchase_orders.po_number (UNIQUE)
- invoices.invoice_number (UNIQUE)
- deliveries.delivery_number (UNIQUE)
- purchase_receipts.receipt_number (UNIQUE)

### Indexes
- All primary keys (id)
- All foreign keys
- Frequently searched fields (sku, email, order_number, etc.)
- Status fields for filtering

---

## Side Effects by Endpoint

### Stock-Affecting Operations

**Decreases Stock:**
- POST /api/sales/orders (creates order with items)

**Increases Stock:**
- POST /api/purchase/orders/:id/receive (when status = 'completed')

**Records Movement:**
- PUT /api/products/:id/stock (manual adjustment)
- POST /api/sales/orders (automatic on order creation)
- POST /api/purchase/orders/:id/receive (automatic on receipt)

### Status Updates

**Order Status Changes:**
- POST /api/sales/orders/:id/deliver
  - status='delivered' → orders.status = 'delivered'
  - status='in_transit' → orders.status = 'shipped'

**Purchase Order Status Changes:**
- POST /api/purchase/orders/:id/receive
  - status='completed' → purchase_orders.status = 'received'
  - status='partial' → purchase_orders.status = 'partial'
