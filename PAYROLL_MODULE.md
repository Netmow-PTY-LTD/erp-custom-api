# Payroll Module

## Base Mapping
- **Module Name**: Payroll
- **Base Path**: `/api/payroll`

## Routes

### 1. List Payrolls
- **Method**: `GET`
- **Path**: `/`
- **Description**: List all payroll records
- **Query Parameters**:
  - `staff_id`: Filter by staff ID
  - `month`: Filter by month
  - `year`: Filter by year
  - `status`: Filter by status
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "staff_id": 5,
      "month": "December",
      "year": 2025,
      "basic_salary": "5000.00",
      "net_salary": "5500.00",
      "status": "pending",
      "staff": {
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  ]
}
```

### 2. Create Payroll
- **Method**: `POST`
- **Path**: `/`
- **Description**: Create a new payroll record
- **Sample Request**:
```json
{
  "staff_id": 5,
  "month": "December",
  "year": 2025,
  "basic_salary": 5000.00,
  "allowances": {
    "transport": 200,
    "housing": 500
  },
  "deductions": {
    "tax": 100,
    "epf": 100
  },
  "status": "pending"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Payroll record created successfully",
  "data": {
    "id": 1,
    "net_salary": 5500.00
  }
}
```

### 3. Get Payroll by ID
- **Method**: `GET`
- **Path**: `/:id`
- **Description**: Get payroll details
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "allowances": {},
    "deductions": {}
  }
}
```

### 4. Update Payroll
- **Method**: `PUT`
- **Path**: `/:id`
- **Description**: Update payroll record
- **Sample Request**:
```json
{
  "status": "paid",
  "payment_date": "2025-12-31",
  "payment_method": "bank_transfer"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Payroll record updated successfully"
}
```

### 5. Delete Payroll
- **Method**: `DELETE`
- **Path**: `/:id`
- **Description**: Delete payroll record
- **Sample Response**:
```json
{
  "status": true,
  "message": "Payroll record deleted successfully"
}
```
