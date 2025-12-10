# Department Module

## Base Mapping
- **Module Name**: Departments
- **Base Path**: `/api/departments`

## Routes

### 1. List Departments
- **Method**: `GET`
- **Path**: `/`
- **Description**: List all departments
- **Query Parameters**: None
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "IT"
    }
  ]
}
```

### 2. Create Department
- **Method**: `POST`
- **Path**: `/`
- **Description**: Create a new department
- **Sample Request**:
```json
{
  "name": "Human Resources",
  "description": "Manages HR operations and staff"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Department created successfully",
  "data": {
    "id": 1,
    "name": "Human Resources"
  }
}
```

### 3. Get Department by ID
- **Method**: `GET`
- **Path**: `/:id`
- **Description**: Get department details
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "IT",
    "head": {
      "first_name": "John",
      "last_name": "Doe"
    }
  }
}
```

### 4. Update Department
- **Method**: `PUT`
- **Path**: `/:id`
- **Description**: Update department
- **Sample Request**:
```json
{
  "name": "Information Technology",
  "description": "IT Department"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Department updated successfully"
}
```

### 5. Delete Department
- **Method**: `DELETE`
- **Path**: `/:id`
- **Description**: Delete department
- **Sample Response**:
```json
{
  "status": true,
  "message": "Department deleted successfully"
}
```
