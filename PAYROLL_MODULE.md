# Payroll Module

## Base Mapping
- **Module Name**: Payroll
- **Base Path**: `/api/payroll`

## 1. Payroll Runs (Existing)
Managing monthly payroll generation and processing.

### 1.1 List Payroll Runs
- **Method**: `GET`
- **Path**: `/`
- **Description**: List all payroll runs.
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `status`: Filter (pending, approved, paid)
  - `month`: Filter by month (YYYY-MM)
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "month": "2025-01",
      "total_gross": 50000,
      "total_net": 50000,
      "status": "pending"
    }
  ]
}
```

### 1.2 Generate Payroll Run
- **Method**: `POST`
- **Path**: `/generate`
- **Description**: Generate a new payroll run for all active staff for a specific month. Will use `PayrollStructure` if available.
- **Request Body**:
```json
{
  "month": "2025-01"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Payroll run generated successfully",
  "data": { "id": 1, "month": "2025-01" }
}
```

### 1.3 Get Payroll Run Details
- **Method**: `GET`
- **Path**: `/:id`
- **Description**: Get details of a run including individual staff items.

### 1.4 Approve Payroll Run
- **Method**: `PATCH`
- **Path**: `/:id/approve`
- **Description**: Mark a pending run as approved.

### 1.5 Pay Payroll Run
- **Method**: `PATCH`
- **Path**: `/:id/pay`
- **Description**: Mark approved run as paid and create corresponding Accounting Expense.

### 1.6 Delete Payroll Run
- **Method**: `DELETE`
- **Path**: `/:id`
- **Description**: Delete a run (if not paid).

---

## 2. Payroll Setup (Planned/New)
Configuration of salary structures for individual staff.

### 2.1 Get Staff Payroll Structure
- **Method**: `GET`
- **Path**: `/structure/:staff_id`
- **Description**: Get configured salary, allowances, deductions, and bank details for a staff member.
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "staff_id": 5,
    "basic_salary": 5000,
    "allowances": [{ "title": "Rent", "amount": 1000 }],
    "deductions": [],
    "bank_details": { "bank_name": "Chase", "account_number": "123" },
    "net_salary": 6000
  }
}
```

### 2.2 Upsert Staff Payroll Structure
- **Method**: `POST`
- **Path**: `/structure/:staff_id`
- **Description**: Create or Update payroll configuration for a staff member.
- **Request Body**:
```json
{
  "basic_salary": 5000,
  "allowances": [{ "title": "Rent", "amount": 1000 }],
  "deductions": [],
  "bank_details": { "bank_name": "Chase", "account_number": "123" }
}
```

## Implementation Plan
1. Create `payroll_structures` table.
2. Implement Structure APIs (`GET/POST /structure/:staff_id`).
3. Update `generateRun` logic to fetch Basic Salary and calculate specific Allowances/Deductions from the `payroll_structures` table instead of using `staff.salary` fallback.
