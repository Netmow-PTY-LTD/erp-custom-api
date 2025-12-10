# Supplier Module

## Base Mapping
- **Module Name**: Suppliers
- **Base Path**: `/api/suppliers`

## Routes

### 1. List Suppliers
- **Method**: `GET`
- **Path**: `/`
- **Description**: List all suppliers
- **Query Parameters**:
  - `is_active`: Filter by active status (true/false)
  - `search`: Search by name, contact person, email, or phone
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Global Electronics Ltd",
      "contact_person": "Alice Johnson",
      "email": "alice@globalelectronics.com",
      "phone": "+1234567890",
      "address": "789 Tech Park",
      "city": "San Jose",
      "country": "USA",
      "is_active": true
    }
  ]
}
```

### 2. Create Supplier
- **Method**: `POST`
- **Path**: `/`
- **Description**: Add a new supplier
- **Sample Request**:
```json
{
  "name": "Office Supplies Co",
  "contact_person": "Bob Smith",
  "email": "bob@officesupplies.com",
  "phone": "+1987654321",
  "address": "456 Market St",
  "city": "Chicago",
  "country": "USA",
  "payment_terms": "Net 30",
  "is_active": true
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Supplier created successfully",
  "data": {
    "id": 2,
    "name": "Office Supplies Co",
    "email": "bob@officesupplies.com",
    "created_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 3. Get Supplier by ID
- **Method**: `GET`
- **Path**: `/:id`
- **Description**: Get supplier details
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "Global Electronics Ltd",
    "contact_person": "Alice Johnson",
    "email": "alice@globalelectronics.com",
    "phone": "+1234567890",
    "address": "789 Tech Park",
    "city": "San Jose",
    "country": "USA",
    "payment_terms": "Net 60",
    "is_active": true,
    "created_at": "2025-12-02T10:00:00.000Z",
    "updated_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 4. Update Supplier
- **Method**: `PUT`
- **Path**: `/:id`
- **Description**: Update a supplier
- **Sample Request**:
```json
{
  "name": "Global Electronics Inc",
  "contact_person": "Alice Smith",
  "payment_terms": "Net 45"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Supplier updated successfully",
  "data": {
    "id": 1,
    "name": "Global Electronics Inc",
    "updated_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 5. Delete Supplier
- **Method**: `DELETE`
- **Path**: `/:id`
- **Description**: Delete a supplier
- **Sample Response**:
```json
{
  "status": true,
  "message": "Supplier deleted successfully"
}
```
