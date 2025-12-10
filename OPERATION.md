# ERP API Operation Guide

This document outlines sequential operation workflows for using the ERP API effectively.

## Base URL

```
http://192.168.68.103:5000
```

---

## 1. Authentication Flow

### Step 1: Register New User (First Time)

**Endpoint:** `POST /api/auth/register`

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "role_id": 2
}
```

**Response:**
```json
{
  "status": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 25,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role_id": 2
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### Step 2: Login (Returning Users)

**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePassword123!"
}
```

###Step 3: Get Current User Info

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

### Step 4: Refresh Token (When Expired)

**Endpoint:** `POST /api/auth/refresh`

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Step 5: Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

---

## 2. Product Management Workflow

### Step 1: Create Product Category

**Endpoint:** `POST /api/products/categories`

```json
{
  "name": "Electronics",
  "description": "Electronic devices and accessories"
}
```

### Step 2: Create Product Unit

**Endpoint:** `POST /api/products/units`

```json
{
  "name": "Piece",
  "symbol": "pcs"
}
```

### Step 3: Create Product

**Endpoint:** `POST /api/products/`

```json
{
  "name": "Laptop Computer",
  "sku": "LAP-001",
  "description": "High-performance laptop",
  "category_id": 1,
  "unit_id": 1,
  "price": 999.99,
  "cost": 750,
  "stock_quantity": 50,
  "min_stock_level": 10,
  "max_stock_level": 100,
  "is_active": true
}
```

### Step 4: View Products

**Endpoint:** `GET /api/products/`

**Query Parameters:**
- `category_id` - Filter by category
- `is_active` - Filter by status
- `search` - Search by name/SKU

### Step 5: Check Stock Levels

**Endpoint:** `GET /api/products/stock`

### Step 6: Update Product

**Endpoint:** `PUT /api/products/:id`

```json
{
  "price": 899.99,
  "stock_quantity": 45
}
```

---

## 3. Customer Management Workflow

### Step 1: Create Customer

**Endpoint:** `POST /api/customers/`

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "company": "Tech Solutions Inc",
  "address": "456 Business Ave",
  "city": "San Francisco",
  "state": "CA",
  "country": "USA",
  "postal_code": "94102",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "tax_id": "TAX789012",
  "credit_limit": 15000,
  "customer_type": "business"
}
```

### Step 2: View All Customers

**Endpoint:** `GET /api/customers/`

**Query Parameters:**
- `customer_type` - individual/business
- `is_active` - true/false
- `search` - Search by name/email/phone

### Step 3: View Customer Details

**Endpoint:** `GET /api/customers/:id`

### Step 4: View Customer Locations (Map)

**Endpoint:** `GET /api/customers/maps`

### Step 5: Update Customer

**Endpoint:** `PUT /api/customers/:id`

```json
{
  "credit_limit": 20000,
  "notes": "Increased credit limit due to good payment history"
}
```

---

## 4. Supplier Management Workflow

### Step 1: Create Supplier

**Endpoint:** `POST /api/suppliers/`

```json
{
  "name": "Global Electronics Ltd",
  "contact_person": "Alice Johnson",
  "email": "alice@globalelectronics.com",
  "phone": "+1234567890",
  "address": "789 Tech Park",
  "city": "San Jose",
  "country": "USA",
  "payment_terms": "Net 60"
}
```

### Step 2: View All Suppliers

**Endpoint:** `GET /api/suppliers/`

**Query Parameters:**
- `is_active` - true/false
- `search` - Search by name/contact/email

### Step 3: View Supplier Details

**Endpoint:** `GET /api/suppliers/:id`

### Step 4: Update Supplier

**Endpoint:** `PUT /api/suppliers/:id`

```json
{
  "payment_terms": "Net 45",
  "contact_person": "Alice Smith"
}
```

---

## 5. Staff Management Workflow

### Step 1: Create Staff Member

**Endpoint:** `POST /api/staffs/`

```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "position": "Sales Representative",
  "department": "Sales",
  "hire_date": "2025-01-15",
  "salary": 50000,
  "status": "active"
}
```

### Step 2: View All Staff

**Endpoint:** `GET /api/staffs/`

**Query Parameters:**
- `status` - active/inactive/terminated/on_leave
- `department` - Filter by department
- `search` - Search by name/email/position

### Step 3: View Staff Details

**Endpoint:** `GET /api/staffs/:id`

### Step 4: Update Staff

**Endpoint:** `PUT /api/staffs/:id`

```json
{
  "position": "Senior Sales Representative",
  "salary": 60000
}
```

---

## 6. Sales & Orders Workflow

### Step 1: Create Warehouse (First Time)

**Endpoint:** `POST /api/sales/warehouses`

```json
{
  "name": "Main Warehouse",
  "location": "New York",
  "capacity": 10000
}
```

### Step 2: Create Sales Order

**Endpoint:** `POST /api/sales/orders`

```json
{
  "customer_id": 1,
  "shipping_address": "123 Main St",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 50
    }
  ]
}
```

### Step 3: View Order Details

**Endpoint:** `GET /api/sales/orders/:id`

### Step 4: Create Invoice

**Endpoint:** `POST /api/sales/orders/invoices`

```json
{
  "order_id": 1,
  "due_date": "2025-01-31"
}
```

### Step 5: Record Payment

**Endpoint:** `POST /api/sales/orders/payments`

```json
{
  "order_id": 1,
  "amount": 100,
  "payment_method": "credit_card"
}
```

### Step 6: View All Orders

**Endpoint:** `GET /api/sales/orders`

**Query Parameters:**
- `status` - Filter by order status
- `customer_id` - Filter by customer

---

## 7. Accounting Workflow

### Step 1: View Financial Overview

**Endpoint:** `GET /api/accounting/overview`

**Query Parameters:**
- `start_date` - YYYY-MM-DD
- `end_date` - YYYY-MM-DD

### Step 2: Record Income

**Endpoint:** `POST /api/accounting/incomes`

```json
{
  "title": "Consulting Fee",
  "amount": 500,
  "income_date": "2025-01-20",
  "category": "Services"
}
```

### Step 3: Record Expense

**Endpoint:** `POST /api/accounting/expenses`

```json
{
  "title": "Office Rent",
  "amount": 2000,
  "expense_date": "2025-01-01",
  "category": "Rent"
}
```

### Step 4: Process Payroll

**Endpoint:** `POST /api/accounting/payroll`

```json
{
  "staff_id": 1,
  "salary_month": "2025-01",
  "basic_salary": 5000,
  "deductions": 500,
  "status": "processed"
}
```

### Step 5: View Income Records

**Endpoint:** `GET /api/accounting/incomes`

### Step 6: View Expense Records

**Endpoint:** `GET /api/accounting/expenses`

### Step 7: View Payroll Records

**Endpoint:** `GET /api/accounting/payroll`

---

## Complete Business Flow Example

### Scenario: Complete Sales Order to Cash

1. **Login** → `POST /api/auth/login`
2. **Create/Select Customer** → `POST /api/customers/`
3. **Create/Select Products** → `POST /api/products/`
4. **Create Sales Order** → `POST /api/sales/orders`
5. **Generate Invoice** → `POST /api/sales/orders/invoices`
6. **Record Payment** → `POST /api/sales/orders/payments`
7. **Record Income** → `POST /api/accounting/incomes`
8. **View Financial Overview** → `GET /api/accounting/overview`

---

## Important Notes

### Authentication
- All routes except `/api/auth/login` and `/api/auth/register` require authentication
- Include token in header: `Authorization: Bearer <token>`
- Token expires after 3600 seconds (1 hour)
- Use `/api/auth/refresh` to get a new token

### Data Tracking
- All transactions track `created_by` (user ID who created the record)
- System automatically records `created_at` and `updated_at` timestamps

### Error Handling
All endpoints return errors in this format:
```json
{
  "status": false,
  "message": "Error description",
  "errors": [
    {
      "path": ["field_name"],
      "message": "Field-specific error"
    }
  ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/expired token)
- `404` - Not Found
- `500` - Internal Server Error

---

## Additional Resources

- **View All Routes:** [http://192.168.68.103:5000/routes-tree](http://192.168.68.103:5000/routes-tree)
- **SQL Schema:** See `TOTAL_TABLES.sql` for complete database schema
