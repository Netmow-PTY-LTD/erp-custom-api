# Module Documentation System

## Overview
Created separate HTML documentation pages for each module with routes list and ER diagrams.

## Access URLs

### Main Index
- **URL**: `http://localhost:5000/module-docs`
- **Description**: Landing page with links to all module documentation

### Individual Module Pages
Each module has its own dedicated documentation page accessible at:
- `http://localhost:5000/module-docs/{module_name}`

## Created Pages

### ✅ Completed
1. **Auth Module** - `/module-docs/auth`
   - Routes: login, register, logout, me, refresh
   - Tables: users, roles, role_settings

2. **Sales Module** - `/module-docs/sales`
   - Routes: orders (CRUD), invoices, routes, warehouses
   - Tables: orders, order_items, invoices, payments, deliveries, warehouses, sales_routes

3. **Module Index** - `/module-docs`
   - Grid layout with all 15 modules
   - Color-coded cards
   - Direct links to each module

## Features

### Each Module Page Includes:
1. **Header Section**
   - Module name and icon
   - Brief description
   - Back link to architecture overview

2. **API Routes Section**
   - All endpoints with HTTP methods (GET, POST, PUT, DELETE)
   - Route paths
   - Descriptions
   - Color-coded method badges

3. **ER Diagram Section**
   - Interactive Mermaid diagram
   - All tables with fields and data types
   - Relationships between tables
   - Primary keys (PK), Foreign keys (FK), Unique keys (UK)

4. **Tables Used Section**
   - List of all database tables
   - Description of each table's purpose

## Design Features
- **Gradient backgrounds** - Each module has unique color scheme
- **Responsive cards** - Clean, modern card-based layout
- **Interactive diagrams** - Mermaid.js for ER diagrams
- **Color-coded methods** - Visual distinction for HTTP methods
- **Hover effects** - Smooth animations on interaction

## Remaining Modules to Create

The following module pages need to be created (13 remaining):

1. Users Module - `/module-docs/users`
2. Roles Module - `/module-docs/roles`
3. Purchase Module - `/module-docs/purchase`
4. Products Module - `/module-docs/products`
5. Customers Module - `/module-docs/customers`
6. Suppliers Module - `/module-docs/suppliers`
7. Accounting Module - `/module-docs/accounting`
8. Staff Module - `/module-docs/staff`
9. Departments Module - `/module-docs/departments`
10. Attendance Module - `/module-docs/attendance`
11. Leaves Module - `/module-docs/leaves`
12. Reports Module - `/module-docs/reports`
13. Settings Module - `/module-docs/settings`

## File Structure
```
/Applications/MAMP/htdocs/backened-erp-minimal/
├── module_docs/
│   ├── index.html (Main index page)
│   ├── auth_module.html
│   ├── sales_module.html
│   └── [other modules to be created]
├── architecture_view.html (Overall architecture)
└── src/
    └── app.js (Routes configuration)
```

## Next Steps
Would you like me to:
1. Create all remaining 13 module documentation pages?
2. Add more details to existing pages (query parameters, request/response examples)?
3. Create a search/filter functionality for the module index?
4. Add API testing interface to each module page?
