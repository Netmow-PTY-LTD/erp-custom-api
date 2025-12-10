# Staff Module

## Base Mapping
- **Module Name**: Staffs
- **Base Path**: `/api/staffs`

## Routes

### 1. List Staffs
- **Method**: `GET`
- **Path**: `/`
- **Description**: List all staff members
- **Query Parameters**:
  - `status`: Filter by status (active/inactive/terminated/on_leave)
  - `department`: Filter by department
  - `search`: Search by name, email, or position
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "position": "Manager",
      "department": "Sales",
      "status": "active"
    }
  ]
}
```

### 2. Create Staff
- **Method**: `POST`
- **Path**: `/`
- **Description**: Add a new staff member
- **Sample Request**:
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "email": "jane.smith@example.com",
  "phone": "+1987654321",
  "position": "Sales Representative",
  "department": "Sales",
  "hire_date": "2025-01-15",
  "salary": 50000.00,
  "status": "active"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Staff member created successfully",
  "data": {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "created_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 3. Get Staff by ID
- **Method**: `GET`
- **Path**: `/:id`
- **Description**: Get staff details
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "position": "Manager",
    "department": "Sales",
    "hire_date": "2024-01-01",
    "salary": 75000.00,
    "address": "123 Main St",
    "city": "New York",
    "status": "active",
    "created_at": "2025-12-02T10:00:00.000Z",
    "updated_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 4. Update Staff
- **Method**: `PUT`
- **Path**: `/:id`
- **Description**: Update staff details
- **Sample Request**:
```json
{
  "position": "Senior Manager",
  "salary": 85000.00
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Staff member updated successfully",
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "updated_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 5. Delete Staff
- **Method**: `DELETE`
- **Path**: `/:id`
- **Description**: Remove a staff member
- **Sample Response**:
```json
{
  "status": true,
  "message": "Staff member deleted successfully"
}
```
