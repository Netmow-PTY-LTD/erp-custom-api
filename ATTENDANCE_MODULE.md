# Attendance Module

## Base Mapping
- **Module Name**: Attendance
- **Base Path**: `/api/attendance`

## Routes

### 1. List Attendance
- **Method**: `GET`
- **Path**: `/`
- **Description**: List attendance records
- **Query Parameters**:
  - `staff_id`: Filter by staff ID
  - `date`: Filter by date
  - `status`: Filter by status
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "staff_id": 5,
      "date": "2025-12-02",
      "check_in": "09:00:00",
      "check_out": "18:00:00",
      "status": "present"
    }
  ]
}
```

### 2. Check In
- **Method**: `POST`
- **Path**: `/check-in`
- **Description**: Staff Check-in
- **Sample Request**:
```json
{
  "staff_id": 5,
  "date": "2025-12-02",
  "check_in": "09:00:00",
  "status": "present"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Checked in successfully"
}
```

### 3. Check Out
- **Method**: `POST`
- **Path**: `/check-out`
- **Description**: Staff Check-out
- **Sample Request**:
```json
{
  "staff_id": 5,
  "date": "2025-12-02",
  "check_out": "18:00:00"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Checked out successfully"
}
```

### 4. Get Attendance by ID
- **Method**: `GET`
- **Path**: `/:id`
- **Description**: Get attendance details
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "staff_id": 5,
    "date": "2025-12-02"
  }
}
```

### 5. Update Attendance
- **Method**: `PUT`
- **Path**: `/:id`
- **Description**: Update attendance record
- **Sample Request**:
```json
{
  "status": "late",
  "notes": "Traffic delay"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Attendance updated successfully"
}
```

### 6. Delete Attendance
- **Method**: `DELETE`
- **Path**: `/:id`
- **Description**: Delete attendance record
- **Sample Response**:
```json
{
  "status": true,
  "message": "Attendance deleted successfully"
}
```
