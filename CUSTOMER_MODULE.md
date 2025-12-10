# Customer Module

## Base Mapping
- **Module Name**: Customers
- **Base Path**: `/api/customers`

## Routes

### 1. List Customers
- **Method**: `GET`
- **Path**: `/`
- **Description**: List all customers
- **Query Parameters**:
  - `customer_type`: Filter by customer type (individual/business)
  - `is_active`: Filter by active status (true/false)
  - `search`: Search by name, email, phone, or company
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "company": "Acme Corp",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postal_code": "10001",
      "latitude": 40.7128,
      "longitude": -74.0060,
      "tax_id": "TAX123456",
      "credit_limit": 10000.00,
      "outstanding_balance": 2500.00,
      "customer_type": "business",
      "is_active": true,
      "created_at": "2025-12-02T10:00:00.000Z"
    }
  ]
}
```

### 2. Create Customer
- **Method**: `POST`
- **Path**: `/`
- **Description**: Add a new customer
- **Sample Request**:
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
  "credit_limit": 15000.00,
  "customer_type": "business",
  "notes": "Premium customer",
  "is_active": true
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Customer created successfully",
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "created_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 3. Get Customer by ID
- **Method**: `GET`
- **Path**: `/:id`
- **Description**: Get customer details
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "company": "Acme Corp",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postal_code": "10001",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "tax_id": "TAX123456",
    "credit_limit": 10000.00,
    "outstanding_balance": 2500.00,
    "customer_type": "business",
    "notes": "Long-term customer",
    "is_active": true,
    "created_at": "2025-12-02T10:00:00.000Z",
    "updated_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 4. Update Customer
- **Method**: `PUT`
- **Path**: `/:id`
- **Description**: Update a customer
- **Sample Request**:
```json
{
  "name": "John Doe Jr.",
  "phone": "+1234567899",
  "credit_limit": 12000.00,
  "notes": "Updated credit limit"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Customer updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Jr.",
    "updated_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 5. Delete Customer
- **Method**: `DELETE`
- **Path**: `/:id`
- **Description**: Delete a customer
- **Sample Response**:
```json
{
  "status": true,
  "message": "Customer deleted successfully"
}
```

### 6. Customer Locations Map
- **Method**: `GET`
- **Path**: `/maps`
- **Description**: List of customer locations for map display
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "total": 25,
    "locations": [
      {
        "id": 1,
        "name": "John Doe",
        "company": "Acme Corp",
        "address": "123 Main Street",
        "city": "New York",
        "phone": "+1234567890",
        "email": "john.doe@example.com",
        "coordinates": {
          "lat": 40.7128,
          "lng": -74.0060
        }
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "company": "Tech Solutions Inc",
        "address": "456 Business Ave",
        "city": "San Francisco",
        "phone": "+1987654321",
        "email": "jane.smith@example.com",
        "coordinates": {
          "lat": 37.7749,
          "lng": -122.4194
        }
      }
    ]
  }
}
```
