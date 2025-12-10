# Sales Module

## Base Mapping
- **Module Name**: Sales & Orders
- **Base Path**: `/api/sales`

## Routes

### 1. List Orders
- **Method**: `GET`
- **Path**: `/orders`
- **Description**: List all orders
- **Query Parameters**:
  - `status`: Filter by order status
  - `customer_id`: Filter by customer ID
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "order_number": "ORD-1733130000000",
      "customer_id": 1,
      "total_amount": "150.00",
      "status": "pending",
      "items": []
    }
  ]
}
```

### 2. Create Order
- **Method**: `POST`
- **Path**: `/orders`
- **Description**: Create a new order
- **Sample Request**:
```json
{
  "customer_id": 1,
  "shipping_address": "123 Main St",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 50.00
    }
  ]
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Order created successfully",
  "data": {
    "id": 1,
    "order_number": "ORD-1733130000000",
    "total_amount": 100.00
  }
}
```

### 3. Get Order by ID
- **Method**: `GET`
- **Path**: `/orders/:id`
- **Description**: Get order details
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "order_number": "ORD-1733130000000",
    "items": [],
    "payments": []
  }
}
```

### 4. List Invoices
- **Method**: `GET`
- **Path**: `/orders/invoices`
- **Description**: List all invoices
- **Sample Response**:
```json
{
  "status": true,
  "data": []
}
```

### 5. Create Invoice
- **Method**: `POST`
- **Path**: `/orders/invoices`
- **Description**: Create a new invoice
- **Sample Request**:
```json
{
  "order_id": 1,
  "due_date": "2025-01-01"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Invoice created successfully"
}
```

### 6. Record Payment
- **Method**: `POST`
- **Path**: `/orders/payments`
- **Description**: Record payment for an order
- **Sample Request**:
```json
{
  "order_id": 1,
  "amount": 100.00,
  "payment_method": "credit_card"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Payment recorded successfully"
}
```

### 7. List Warehouses
- **Method**: `GET`
- **Path**: `/warehouses`
- **Description**: List all warehouses
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Main Warehouse",
      "location": "New York"
    }
  ]
}
```

### 8. Create Warehouse
- **Method**: `POST`
- **Path**: `/warehouses`
- **Description**: Add a new warehouse
- **Sample Request**:
```json
{
  "name": "West Coast Hub",
  "location": "Los Angeles",
  "capacity": 10000
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Warehouse created successfully"
}
```

### 9. List Sales Routes
- **Method**: `GET`
- **Path**: `/sales/routes`
- **Description**: List all sales routes
- **Sample Response**:
```json
{
  "status": true,
  "data": []
}
```
