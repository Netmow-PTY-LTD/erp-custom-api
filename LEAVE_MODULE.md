# Leave Module

## Base Mapping
- **Module Name**: Leave Management
- **Base Path**: `/api/leaves`

## Routes

### 1. List Leaves
- **Method**: `GET`
- **Path**: `/`
- **Description**: List leave applications
- **Query Parameters**:
  - `staff_id`: Filter by staff ID
  - `status`: Filter by status
  - `leave_type`: Filter by leave type
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "staff_id": 5,
      "leave_type": "annual",
      "start_date": "2025-12-25",
      "end_date": "2025-12-31",
      "status": "approved"
    }
  ]
}
```

### 2. Apply for Leave
- **Method**: `POST`
- **Path**: `/`
- **Description**: Apply for leave
- **Sample Request**:
```json
{
  "staff_id": 5,
  "leave_type": "sick",
  "start_date": "2025-12-02",
  "end_date": "2025-12-03",
  "reason": "Fever"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Leave application submitted successfully"
}
```

### 3. Get Leave by ID
- **Method**: `GET`
- **Path**: `/:id`
- **Description**: Get leave application details
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "leave_type": "sick",
    "status": "pending"
  }
}
```

### 4. Update Leave
- **Method**: `PUT`
- **Path**: `/:id`
- **Description**: Update leave application
- **Sample Request**:
```json
{
  "reason": "High Fever"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Leave application updated successfully"
}
```

### 5. Update Leave Status
- **Method**: `PUT`
- **Path**: `/:id/status`
- **Description**: Approve or Reject leave
- **Sample Request**:
```json
{
  "status": "approved"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Leave application approved successfully"
}
```

### 6. Delete Leave
- **Method**: `DELETE`
- **Path**: `/:id`
- **Description**: Delete leave application
- **Sample Response**:
```json
{
  "status": true,
  "message": "Leave application deleted successfully"
}
```
