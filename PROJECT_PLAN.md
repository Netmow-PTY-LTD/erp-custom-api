# Project Plan & API Documentation

## Project Overview
This project is a minimal ERP (Enterprise Resource Planning) system designed to manage various business operations including HR, Sales, Inventory, Accounting, and more. It is built with a modular architecture to ensure scalability and maintainability.

## Modules Overview

The system is divided into the following core modules:

1.  **Accounting**: Manages financial transactions, incomes, expenses, and payroll records.
2.  **Attendance**: Tracks staff attendance, check-ins, and check-outs.
3.  **Auth**: Handles user authentication, registration, and session management.
4.  **Customers**: Manages customer data, including business and individual clients.
5.  **Departments**: Organizes the company structure into different departments.
6.  **Leave Management**: Handles leave applications and approvals for staff.
7.  **Payroll**: Manages employee salaries, allowances, and deductions.
8.  **Products**: Manages product inventory, categories, units, and stock levels.
9.  **Purchase Orders**: Manages procurement and orders to suppliers.
10. **Reports**: Generates analytical reports for sales, purchases, inventory, HR, and finance.
11. **Roles**: Manages user roles and permissions for access control.
12. **Sales & Orders**: Handles sales orders, invoices, payments, and warehouse management.
13. **Settings**: Manages global system settings and company profile.
14. **Staffs**: Manages employee records and details.
15. **Suppliers**: Manages supplier relationships and contact information.
16. **Users**: Manages system users and their access credentials.

---

## API Routes List

### 🔷 Accounting
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/accounting/overview` | Get financial overview |
| `GET` | `/api/accounting/incomes` | List income records |
| `POST` | `/api/accounting/incomes` | Add a new income record |
| `GET` | `/api/accounting/expenses` | List expense records |
| `POST` | `/api/accounting/expenses` | Add a new expense record |
| `GET` | `/api/accounting/payroll` | List payroll records |
| `POST` | `/api/accounting/payroll` | Add a new payroll record |

### 🔷 Attendance
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/attendance/` | List attendance records |
| `POST` | `/api/attendance/check-in` | Staff Check-in |
| `POST` | `/api/attendance/check-out` | Staff Check-out |
| `GET` | `/api/attendance/:id` | Get attendance details |
| `PUT` | `/api/attendance/:id` | Update attendance record |
| `DELETE` | `/api/attendance/:id` | Delete attendance record |

### 🔷 Auth
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user and get access token |
| `POST` | `/api/auth/register` | Register a new user account |
| `GET` | `/api/auth/me` | Get current authenticated user information |
| `POST` | `/api/auth/refresh` | Refresh access token using refresh token |
| `POST` | `/api/auth/logout` | Logout user and invalidate tokens |

### 🔷 Customers
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/customers/` | List all customers |
| `POST` | `/api/customers/` | Add a new customer |
| `GET` | `/api/customers/:id` | Get customer details |
| `PUT` | `/api/customers/:id` | Update a customer |
| `DELETE` | `/api/customers/:id` | Delete a customer |
| `GET` | `/api/customers/maps` | List of customer locations for map display |

### 🔷 Departments
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/departments/` | List all departments |
| `POST` | `/api/departments/` | Create a new department |
| `GET` | `/api/departments/:id` | Get department details |
| `PUT` | `/api/departments/:id` | Update department |
| `DELETE` | `/api/departments/:id` | Delete department |

### 🔷 Leave Management
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/leaves/` | List leave applications |
| `POST` | `/api/leaves/` | Apply for leave |
| `GET` | `/api/leaves/:id` | Get leave application details |
| `PUT` | `/api/leaves/:id` | Update leave application |
| `PUT` | `/api/leaves/:id/status` | Approve or Reject leave |
| `DELETE` | `/api/leaves/:id` | Delete leave application |

### 🔷 Payroll
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/payroll/` | List all payroll records |
| `POST` | `/api/payroll/` | Create a new payroll record |
| `GET` | `/api/payroll/:id` | Get payroll details |
| `PUT` | `/api/payroll/:id` | Update payroll record |
| `DELETE` | `/api/payroll/:id` | Delete payroll record |

### 🔷 Products
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/products/` | List all products |
| `POST` | `/api/products/` | Add a new product |
| `PUT` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |
| `GET` | `/api/products/categories` | List all categories |
| `POST` | `/api/products/categories` | Create a new category |
| `GET` | `/api/products/categories/:id` | Get a specific category by ID |
| `PUT` | `/api/products/categories/:id` | Update a category |
| `DELETE` | `/api/products/categories/:id` | Delete a category |
| `GET` | `/api/products/units` | List all units |
| `POST` | `/api/products/units` | Create a new unit |
| `GET` | `/api/products/units/:id` | Get a specific unit by ID |
| `PUT` | `/api/products/units/:id` | Update a unit |
| `DELETE` | `/api/products/units/:id` | Delete a unit |
| `GET` | `/api/products/stock` | Get stock management details |

### 🔷 Purchase Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/purchase/orders` | List all purchase orders |
| `POST` | `/api/purchase/orders` | Create a new purchase order |
| `GET` | `/api/purchase/orders/:id` | Get purchase order details |
| `PUT` | `/api/purchase/orders/:id` | Update purchase order |

### 🔷 Reports
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/reports/sales/summary` | Get sales summary (revenue, orders) |
| `GET` | `/api/reports/sales/top-customers` | Get top customers by revenue |
| `GET` | `/api/reports/sales/top-products` | Get top selling products |
| `GET` | `/api/reports/purchase/summary` | Get purchase summary |
| `GET` | `/api/reports/purchase/by-supplier` | Get spending breakdown by supplier |
| `GET` | `/api/reports/inventory/status` | Get current inventory status |
| `GET` | `/api/reports/inventory/valuation` | Get total inventory valuation |
| `GET` | `/api/reports/hr/attendance` | Get monthly attendance summary |
| `GET` | `/api/reports/hr/payroll` | Get annual payroll summary |
| `GET` | `/api/reports/finance/profit-loss` | Get Profit & Loss statement |

### 🔷 Roles
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/roles/list` | Get paginated list of all roles |
| `POST` | `/api/roles/add` | Create a new role with permissions |
| `GET` | `/api/roles/get/:id` | Get a specific role by ID |
| `PUT` | `/api/roles/update/:id` | Update an existing role by ID |
| `DELETE` | `/api/roles/delete/:id` | Delete a role by ID |

### 🔷 Sales & Orders
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/sales/orders` | List all orders |
| `POST` | `/api/sales/orders` | Create a new order |
| `GET` | `/api/sales/orders/:id` | Get order details |
| `GET` | `/api/sales/orders/invoices` | List all invoices |
| `POST` | `/api/sales/orders/invoices` | Create a new invoice |
| `POST` | `/api/sales/orders/payments` | Record payment for an order |
| `GET` | `/api/sales/warehouses` | List all warehouses |
| `POST` | `/api/sales/warehouses` | Add a new warehouse |
| `GET` | `/api/sales/sales/routes` | List all sales routes (Deprecated/Duplicate?) |
| `GET` | `/api/sales/` | List all sales routes |
| `POST` | `/api/sales/` | Create a new sales route |
| `GET` | `/api/sales/:id` | Get sales route details |
| `PUT` | `/api/sales/:id` | Update a sales route |
| `DELETE` | `/api/sales/:id` | Delete a sales route |

### 🔷 Settings
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/settings/company/profile` | Get company profile information |
| `PUT` | `/api/settings/company/profile` | Update company profile information |

### 🔷 Staffs
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/staffs/` | List all staff members |
| `POST` | `/api/staffs/` | Add a new staff member |
| `GET` | `/api/staffs/:id` | Get staff details |
| `PUT` | `/api/staffs/:id` | Update staff details |
| `DELETE` | `/api/staffs/:id` | Remove a staff member |

### 🔷 Suppliers
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/suppliers/` | List all suppliers |
| `POST` | `/api/suppliers/` | Add a new supplier |
| `GET` | `/api/suppliers/:id` | Get supplier details |
| `PUT` | `/api/suppliers/:id` | Update a supplier |
| `DELETE` | `/api/suppliers/:id` | Delete a supplier |

### 🔷 Users
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/users/list` | Get paginated list of all users |
| `POST` | `/api/users/add` | Create a new user account |
| `GET` | `/api/users/get/:id` | Get a specific user by ID |
| `PUT` | `/api/users/update/:id` | Update an existing user by ID |
| `DELETE` | `/api/users/delete/:id` | Delete a user by ID |

### 🔷 General
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Root endpoint |
| `GET` | `/routes-tree/` | Routes documentation tree |
