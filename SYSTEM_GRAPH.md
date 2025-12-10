# ERP System Graph Visualization

## 🎨 Interactive System Architecture Graph

A comprehensive, interactive visualization of the entire ERP system using Mermaid.js.

### 📍 Access URL
**http://192.168.68.103:5000/system-graph**

### ✨ Features

#### 1. **System Overview Tab**
- Complete module hierarchy
- Visual representation of all 16 modules
- Color-coded by category:
  - 🔐 **Core System** (Purple): Auth, Users, Roles
  - 💼 **Business Operations** (Green): Customers, Suppliers, Products, Sales, Purchase
  - 👥 **Human Resources** (Orange): Staff, Departments, Attendance, Leaves, Payroll
  - 💰 **Finance** (Yellow): Accounting
  - ⚙️ **System Management** (Blue): Settings, Reports
- Shows relationships between modules
- Displays route counts for each module

#### 2. **Module Details Tab**
- Detailed view of major module routes
- Organized by functional area
- Shows HTTP methods and endpoints
- Color-coded by module type

#### 3. **Data Flow Tab**
- Sequence diagram showing request/response flow
- Authentication flow visualization
- Database interaction patterns
- Complete API request lifecycle

#### 4. **Relationships Tab**
- Entity Relationship Diagram (ERD)
- Database schema visualization
- Shows table relationships
- Displays primary and foreign keys
- Field types and constraints

### 📊 Statistics Dashboard

The page includes a live statistics dashboard showing:
- **16 Modules** - Total number of functional modules
- **100+ API Routes** - Total API endpoints
- **5 Core Systems** - Major system categories
- **REST Architecture** - API design pattern

### 🎯 Module Categories

1. **Core System (3 modules)**
   - Authentication (5 routes)
   - Users (5 routes)
   - Roles (5 routes)

2. **Business Operations (6 modules)**
   - Customers (6 routes)
   - Suppliers (5 routes)
   - Products (16 routes)
   - Sales & Orders (9 routes)
   - Purchase Orders (5 routes)
   - Sales Routes (5 routes)

3. **Human Resources (5 modules)**
   - Staff (5 routes)
   - Departments (5 routes)
   - Attendance (6 routes)
   - Leave Management (6 routes)
   - Payroll (5 routes)

4. **Finance & Accounting (1 module)**
   - Accounting (7 routes)

5. **System Management (2 modules)**
   - Settings (2 routes)
   - Reports (10 routes)

### 🔗 Related Pages

- **Routes Tree**: http://192.168.68.103:5000/routes-tree
- **Architecture View**: http://192.168.68.103:5000/routes-architecture
- **Module Docs**: http://192.168.68.103:5000/module-docs

### 🎨 Design Features

- **Responsive Design** - Works on all screen sizes
- **Interactive Tabs** - Switch between different views
- **Beautiful Gradients** - Modern, professional appearance
- **Hover Effects** - Interactive stat cards
- **Color-Coded** - Easy visual categorization
- **Auto-Generated** - Uses Mermaid.js for dynamic graphs

### 💡 Usage Tips

1. **Navigate Tabs**: Click on different tabs to see various visualizations
2. **Zoom**: Use browser zoom (Ctrl/Cmd + scroll) to see details
3. **Export**: Right-click on graphs to save as image
4. **Responsive**: View on any device - mobile, tablet, or desktop

### 🛠️ Technical Details

- **Framework**: Mermaid.js v10
- **Diagram Types**: 
  - Flowchart (System Overview)
  - Graph (Module Details)
  - Sequence Diagram (Data Flow)
  - Entity Relationship Diagram (Database Schema)
- **Styling**: Custom CSS with gradients and animations
- **Interactive**: Tab-based navigation
- **Performance**: Lazy-loaded diagrams

---

**Created**: December 5, 2025
**Version**: 1.0
**Status**: ✅ Live and Accessible
