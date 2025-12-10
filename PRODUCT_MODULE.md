# Product Module

## Base Mapping
- **Module Name**: Products
- **Base Path**: `/api/products`

## Routes

### 1. List Products
- **Method**: `GET`
- **Path**: `/`
- **Description**: List all products
- **Query Parameters**:
  - `category_id`: Filter by category ID
  - `is_active`: Filter by active status (true/false)
  - `search`: Search by name, SKU, or barcode
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop Computer",
      "sku": "LAP-001",
      "description": "High-performance laptop",
      "category_id": 1,
      "unit_id": 1,
      "price": 999.99,
      "cost": 750.00,
      "stock_quantity": 50,
      "min_stock_level": 10,
      "max_stock_level": 100,
      "barcode": "1234567890123",
      "image_url": "/uploads/laptop.jpg",
      "is_active": true,
      "category": {
        "id": 1,
        "name": "Electronics"
      },
      "unit": {
        "id": 1,
        "name": "Piece",
        "symbol": "pcs"
      }
    }
  ]
}
```

### 2. Create Product
- **Method**: `POST`
- **Path**: `/`
- **Description**: Add a new product
- **Sample Request**:
```json
{
  "name": "Wireless Mouse",
  "sku": "MOU-001",
  "description": "Ergonomic wireless mouse",
  "category_id": 1,
  "unit_id": 1,
  "price": 29.99,
  "cost": 15.00,
  "stock_quantity": 100,
  "min_stock_level": 20,
  "max_stock_level": 200,
  "barcode": "9876543210987",
  "is_active": true
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Product created successfully",
  "data": {
    "id": 2,
    "name": "Wireless Mouse",
    "sku": "MOU-001",
    "price": 29.99,
    "created_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 3. Update Product
- **Method**: `PUT`
- **Path**: `/:id`
- **Description**: Update a product
- **Sample Request**:
```json
{
  "name": "Wireless Mouse Pro",
  "price": 34.99,
  "stock_quantity": 150
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Product updated successfully",
  "data": {
    "id": 2,
    "name": "Wireless Mouse Pro",
    "price": 34.99,
    "updated_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 4. Delete Product
- **Method**: `DELETE`
- **Path**: `/:id`
- **Description**: Delete a product
- **Sample Response**:
```json
{
  "status": true,
  "message": "Product deleted successfully"
}
```

### 5. List Categories
- **Method**: `GET`
- **Path**: `/categories`
- **Description**: List all categories
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic devices and accessories",
      "parent_id": null,
      "is_active": true
    }
  ]
}
```

### 6. List Units
- **Method**: `GET`
- **Path**: `/units`
- **Description**: List all units
- **Sample Response**:
```json
{
  "status": true,
  "data": [
    {
      "id": 1,
      "name": "Piece",
      "symbol": "pcs",
      "is_active": true
    }
  ]
}
```

### 7. Stock Management
- **Method**: `GET`
- **Path**: `/stock`
- **Description**: Get stock management details
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "total_products": 150,
    "low_stock_count": 5,
    "total_stock_value": "45000.00",
    "low_stock_products": [
      {
        "id": 10,
        "name": "USB Cable",
        "sku": "USB-001",
        "stock_quantity": 5,
        "min_stock_level": 20,
        "price": 5.99
      }
    ]
  }
}
```

### 8. Create Category
- **Method**: `POST`
- **Path**: `/categories`
- **Description**: Create a new category
- **Sample Request**:
```json
{
  "name": "Furniture",
  "description": "Office and home furniture",
  "parent_id": null,
  "is_active": true
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Category created successfully",
  "data": {
    "id": 3,
    "name": "Furniture",
    "created_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 9. Get Category by ID
- **Method**: `GET`
- **Path**: `/categories/:id`
- **Description**: Get a specific category by ID
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "Electronics",
    "description": "Electronic devices and accessories",
    "parent_id": null,
    "is_active": true
  }
}
```

### 10. Update Category
- **Method**: `PUT`
- **Path**: `/categories/:id`
- **Description**: Update a category
- **Sample Request**:
```json
{
  "name": "Electronics & Gadgets",
  "description": "Updated description",
  "is_active": true
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "name": "Electronics & Gadgets",
    "updated_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 11. Delete Category
- **Method**: `DELETE`
- **Path**: `/categories/:id`
- **Description**: Delete a category
- **Sample Response**:
```json
{
  "status": true,
  "message": "Category deleted successfully"
}
```

### 12. Create Unit
- **Method**: `POST`
- **Path**: `/units`
- **Description**: Create a new unit
- **Sample Request**:
```json
{
  "name": "Dozen",
  "symbol": "dz",
  "is_active": true
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Unit created successfully",
  "data": {
    "id": 6,
    "name": "Dozen",
    "symbol": "dz",
    "created_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 13. Get Unit by ID
- **Method**: `GET`
- **Path**: `/units/:id`
- **Description**: Get a specific unit by ID
- **Sample Response**:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "name": "Piece",
    "symbol": "pcs",
    "is_active": true
  }
}
```

### 14. Update Unit
- **Method**: `PUT`
- **Path**: `/units/:id`
- **Description**: Update a unit
- **Sample Request**:
```json
{
  "name": "Pieces",
  "symbol": "pcs",
  "is_active": true
}
```
- **Sample Response**:
```json
{
  "status": true,
  "message": "Unit updated successfully",
  "data": {
    "id": 1,
    "name": "Pieces",
    "updated_at": "2025-12-02T10:00:00.000Z"
  }
}
```

### 15. Delete Unit
- **Method**: `DELETE`
- **Path**: `/units/:id`
- **Description**: Delete a unit
- **Sample Response**:
```json
{
  "status": true,
  "message": "Unit deleted successfully"
}
```
