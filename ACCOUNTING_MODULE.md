# Accounting Module

## Base Mapping
- **Module Name**: Accounting
- **Base Path**: `/api/accounting`

## Routes

### 1. Financial Overview
- **Method**: `GET`
- **Path**: `/overview`
- **Description**: Get financial overview
- **Query Parameters**:
  - `start_date`: Filter by start date (YYYY-MM-DD)
  - `end_date`: Filter by end date (YYYY-MM-DD)
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "total_income": 50000.00,
    "total_expense": 20000.00,
    "total_payroll": 15000.00,
    "net_profit": 15000.00
  }
}
```

### 2. List Incomes
- **Method**: `GET`
- **Path**: `/incomes`
- **Description**: List income records
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "title": "Service Revenue",
      "amount": 1000.00,
      "income_date": "2025-01-15"
    }
  ]
}
```

### 3. Create Income
- **Method**: `POST`
- **Path**: `/incomes`
- **Description**: Add a new income record
- **Sample Request**:
```json
{
  "title": "Consulting Fee",
  "amount": 500.00,
  "income_date": "2025-01-20",
  "category": "Services"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Income record created successfully"
}
```

### 4. List Expenses
- **Method**: `GET`
- **Path**: `/expenses`
- **Description**: List expense records
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "title": "Office Rent",
      "amount": 2000.00,
      "expense_date": "2025-01-01"
    }
  ]
}
```

### 5. Create Expense
- **Method**: `POST`
- **Path**: `/expenses`
- **Description**: Add a new expense record
- **Sample Request**:
```json
{
  "title": "Internet Bill",
  "amount": 100.00,
  "expense_date": "2025-01-05",
  "category": "Utilities"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Expense record created successfully"
}
```

### 6. List Payrolls
- **Method**: `GET`
- **Path**: `/payroll`
- **Description**: List payroll records
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "staff_id": 1,
      "salary_month": "2025-01",
      "net_salary": 4500.00,
      "status": "paid"
    }
  ]
}
```

### 7. Create Payroll
- **Method**: `POST`
- **Path**: `/payroll`
- **Description**: Add a new payroll record
- **Sample Request**:
```json
{
  "staff_id": 1,
  "salary_month": "2025-01",
  "basic_salary": 5000.00,
  "deductions": 500.00,
  "status": "processed"
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Payroll record created successfully"
}
```
