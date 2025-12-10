# Reports Module

## Base Mapping
- **Module Name**: Reports
- **Base Path**: `/api/reports`

## Routes

### 1. Sales Summary
- **Method**: `GET`
- **Path**: `/sales/summary`
- **Description**: Get sales summary (revenue, orders)
- **Query Parameters**:
  - `startDate`: YYYY-MM-DD
  - `endDate`: YYYY-MM-DD
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "total_orders": 150,
    "total_revenue": 45000.00,
    "average_order_value": 300.00
  }
}
```

### 2. Top Customers
- **Method**: `GET`
- **Path**: `/sales/top-customers`
- **Description**: Get top customers by revenue
- **Query Parameters**:
  - `startDate`: YYYY-MM-DD
  - `endDate`: YYYY-MM-DD
  - `limit`: Number
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Acme Corp",
      "email": "contact@acme.com",
      "order_count": 12,
      "total_spent": 15000.00
    }
  ]
}
```

### 3. Top Products
- **Method**: `GET`
- **Path**: `/sales/top-products`
- **Description**: Get top selling products
- **Query Parameters**:
  - `startDate`: YYYY-MM-DD
  - `endDate`: YYYY-MM-DD
  - `limit`: Number
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 101,
      "name": "Wireless Mouse",
      "sku": "WM-001",
      "total_quantity_sold": 500,
      "total_revenue": 12500.00
    }
  ]
}
```

### 4. Purchase Summary
- **Method**: `GET`
- **Path**: `/purchase/summary`
- **Description**: Get purchase summary
- **Query Parameters**:
  - `startDate`: YYYY-MM-DD
  - `endDate`: YYYY-MM-DD
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "total_orders": 45,
    "total_spent": 32000.00
  }
}
```

### 5. Spending by Supplier
- **Method**: `GET`
- **Path**: `/purchase/by-supplier`
- **Description**: Get spending breakdown by supplier
- **Query Parameters**:
  - `startDate`: YYYY-MM-DD
  - `endDate`: YYYY-MM-DD
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 3,
      "name": "Tech Supplies Inc",
      "po_count": 15,
      "total_spent": 18000.00
    }
  ]
}
```

### 6. Inventory Status
- **Method**: `GET`
- **Path**: `/inventory/status`
- **Description**: Get current inventory status (low stock, out of stock)
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "total_products": 500,
    "low_stock_count": 12,
    "out_of_stock_count": 3
  }
}
```

### 7. Inventory Valuation
- **Method**: `GET`
- **Path**: `/inventory/valuation`
- **Description**: Get total inventory valuation
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "total_sales_value": 150000.00,
    "total_cost_value": 95000.00
  }
}
```

### 8. Attendance Summary
- **Method**: `GET`
- **Path**: `/hr/attendance`
- **Description**: Get monthly attendance summary
- **Query Parameters**:
  - `month`: 1-12
  - `year`: YYYY
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "present_days": 20,
      "late_days": 2,
      "absent_days": 0,
      "half_days": 0
    }
  ]
}
```

### 9. Payroll Summary
- **Method**: `GET`
- **Path**: `/hr/payroll`
- **Description**: Get annual payroll summary
- **Query Parameters**:
  - `year`: YYYY
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "month": "January",
      "staff_paid": 15,
      "total_basic": 75000.00,
      "total_net_payout": 72000.00
    }
  ]
}
```

### 10. Profit & Loss
- **Method**: `GET`
- **Path**: `/finance/profit-loss`
- **Description**: Get Profit & Loss statement
- **Query Parameters**:
  - `startDate`: YYYY-MM-DD
  - `endDate`: YYYY-MM-DD
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "revenue": 120000.00,
    "cogs": 80000.00,
    "gross_profit": 40000.00,
    "expenses": 15000.00,
    "net_profit": 25000.00
  }
}
```
