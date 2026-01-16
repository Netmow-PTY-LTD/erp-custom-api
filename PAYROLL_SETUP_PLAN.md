# Payroll Setup & Configuration Plan

## Objective
Implement a system to configure payroll details for each staff member, including Basic Salary, Allowances, Deductions, and Bank Details. This configuration will serve as the template for generating monthly payroll records.

## 1. Database Schema
We need a new model to store the salary structure for each staff member.

### Table: `payroll_structures`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | Integer | Primary Key | |
| `staff_id` | Integer | Foreign Key (users.id) | Unique per user/staff (Staff = User) |
| `basic_salary` | Decimal(10, 2) | Not Null, Default 0 | |
| `allowances` | JSON | Default [] | List of allowance objects |
| `deductions` | JSON | Default [] | List of deduction objects |
| `bank_details` | JSON | Default {} | Bank Name, Account No, etc. |
| `net_salary` | Decimal(10, 2) | Virtual/Stored | Calculated field |
| `created_at` | DateTime | | |
| `updated_at` | DateTime | | |

#### JSON Structure Examples
**Allowances**:
```json
[
  { "title": "Transport", "amount": 500, "type": "fixed" },
  { "title": "Housing", "amount": 1000, "type": "fixed" }
]
```

**Bank Details**:
```json
{
  "bank_name": "Chase Bank",
  "account_name": "Forhad",
  "account_number": "1234567890",
  "branch": "Main Branch"
}
```

## 2. API Endpoints
Base Path: `/api/payroll/structure`

### 2.1 Get Payroll Setup
- **Method**: `GET`
- **Path**: `/:staff_id`
- **Description**: Retrieve the current payroll configuration for a specific staff member.
- **Response**:
  ```json
  {
    "status": true,
    "data": {
      "staff_id": 5,
      "basic_salary": 5000,
      "allowances": [...],
      "deductions": [...],
      "bank_details": {...},
      "gross_salary": 6500,
      "total_deductions": 500,
      "net_salary": 6000
    }
  }
  ```

### 2.2 Update/Save Payroll Setup
- **Method**: `POST` (Upsert)
- **Path**: `/:staff_id`
- **Description**: Create or Update the payroll configuration.
- **Request Body**:
  ```json
  {
    "basic_salary": 5000,
    "allowances": [
       { "title": "House Rent", "amount": 2000 }
    ],
    "deductions": [
       { "title": "Tax", "amount": 500 }
    ],
    "bank_details": {
       "bank_name": "DBBL",
       "account_number": "123..."
    }
  }
  ```

## 3. Implementation Steps

### Step 1: Create Model & Migration
- Create `src/modules/payroll/payroll.structure.model.js`.
- Run migration to create `payroll_structures` table.

### Step 2: Implement Repository & Service
- `PayrollRepository.upsertStructure(staffId, data)`
- `PayrollService.calculateNetSalary(data)` helper.

### Step 3: API Controller & Routes
- Create `PayrollStructureController`.
- Register routes in `payroll.routes.js`.

### Step 4: UI Integration (Frontend)
- Connect the "Payroll Setup" form to these endpoints.
