# System Architecture

## 1. API Request Flow (Route Relation)

This graph illustrates the standard flow of a request through the system layers.

```mermaid
graph TD
    Client[Client / Frontend] -->|HTTP Request| Router[Express Router]
    
    subgraph "Module Layer"
        Router -->|Route Handler| Controller[Controller Layer]
        Controller -->|Business Logic| Service[Service Layer]
        Service -->|Data Access| Repository[Repository Layer]
    end
    
    Repository -->|Sequelize Query| DB[(MySQL Database)]
    
    %% Example Flow for Products
    subgraph "Example: Get All Products"
        PR[GET /api/products] --> PC[ProductController.getProducts]
        PC --> PS[ProductService.getAllProducts]
        PS --> PRep[ProductRepository.findAll]
        PRep -->|Select *| ProductsTable[products table]
    end
```

## 2. Database Entity Relations (ER Diagram)

This diagram shows the relationships between the database tables.

```mermaid
erDiagram
    %% Core / Auth
    USERS ||--o{ ROLES : "has role"
    ROLES ||--|| ROLE_SETTINGS : "has settings"
    
    %% HR
    USERS ||--o{ STAFFS : "created by"
    STAFFS }|--|| DEPARTMENTS : "belongs to (logical)"
    STAFFS ||--o{ ATTENDANCES : "has"
    STAFFS ||--o{ LEAVES : "requests"
    STAFFS ||--o{ PAYROLLS : "receives"
    
    %% Inventory / Products
    CATEGORIES ||--o{ PRODUCTS : "contains"
    UNITS ||--o{ PRODUCTS : "measured in"
    CATEGORIES ||--o{ CATEGORIES : "parent category"
    
    %% Sales
    CUSTOMERS }|--|| SALES_ROUTES : "on route"
    CUSTOMERS ||--o{ ORDERS : "places"
    ORDERS ||--|{ ORDER_ITEMS : "contains"
    ORDER_ITEMS }|--|| PRODUCTS : "refers to"
    ORDERS ||--|| INVOICES : "generates"
    ORDERS ||--o{ PAYMENTS : "paid by"
    INVOICES ||--o{ PAYMENTS : "paid by"
    ORDERS ||--o{ DELIVERIES : "shipped via"
    
    %% Purchase
    SUPPLIERS ||--o{ PURCHASE_ORDERS : "supplies"
    PURCHASE_ORDERS ||--|{ PURCHASE_ORDER_ITEMS : "contains"
    PURCHASE_ORDER_ITEMS }|--|| PRODUCTS : "refers to"
    
    %% Accounting
    INCOMES }|--|| USERS : "recorded by"
    EXPENSES }|--|| USERS : "recorded by"
    
    %% Table Definitions (Simplified)
    USERS {
        int id
        string name
        string email
        int role_id
    }
    
    PRODUCTS {
        int id
        string name
        decimal price
        int stock_quantity
        int category_id
        int unit_id
    }
    
    ORDERS {
        int id
        string order_number
        int customer_id
        decimal total_amount
        string status
    }
    
    STAFFS {
        int id
        string first_name
        string last_name
        string email
    }
```

## 3. Module-Entity Relationship Map

This graph groups database entities by their respective business modules.

```mermaid
graph TD
    subgraph "Core & Auth Module"
        Users[Users]
        Roles[Roles]
        RoleSettings[Role Settings]
    end

    subgraph "HR Module"
        Staffs[Staffs]
        Depts[Departments]
        Attend[Attendance]
        Leaves[Leaves]
        Payroll[Payroll]
    end

    subgraph "Inventory Module"
        Products[Products]
        Cats[Categories]
        Units[Units]
    end

    subgraph "Sales Module"
        Customers[Customers]
        SRoutes[Sales Routes]
        Warehouses[Warehouses]
        Orders[Orders]
        OrderItems[Order Items]
        Invoices[Invoices]
        Payments[Payments]
        Deliveries[Deliveries]
    end

    subgraph "Purchase Module"
        Suppliers[Suppliers]
        POrders[Purchase Orders]
        POItems[Purchase Order Items]
    end

    subgraph "Accounting Module"
        Incomes[Incomes]
        Expenses[Expenses]
        AccPayroll[Payroll Records]
    end

    subgraph "Settings Module"
        Settings[Settings]
    end

    %% Relationships between Modules
    Users -->|Manages| Staffs
    Staffs -->|Belongs to| Depts
    Staffs -->|Has| Attend
    Staffs -->|Requests| Leaves
    Staffs -->|Receives| Payroll

    Products -->|Categorized by| Cats
    Products -->|Measured in| Units

    Customers -->|Assigned to| SRoutes
    Orders -->|Placed by| Customers
    Orders -->|Contains| OrderItems
    OrderItems -->|Refers to| Products
    Orders -->|Generates| Invoices
    Invoices -->|Paid via| Payments
    Orders -->|Shipped via| Deliveries

    POrders -->|Supplied by| Suppliers
    POrders -->|Contains| POItems
    POItems -->|Refers to| Products

    AccPayroll -.->|Linked to| Payroll
```
