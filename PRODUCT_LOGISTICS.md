# Product Logistics Fields

## 📦 Overview

Added logistics and shipping information fields to the Products module for better inventory and shipping management.

## ✨ New Fields

### Weight
- **Field**: `weight`
- **Type**: DECIMAL(10, 2)
- **Unit**: Kilograms (kg)
- **Description**: Product weight for shipping calculations
- **Example**: 0.15 (150 grams)

### Dimensions
- **Field**: `length`
- **Type**: DECIMAL(10, 2)
- **Unit**: Centimeters (cm)
- **Description**: Product length
- **Example**: 12.5

- **Field**: `width`
- **Type**: DECIMAL(10, 2)
- **Unit**: Centimeters (cm)
- **Description**: Product width
- **Example**: 7.0

- **Field**: `height`
- **Type**: DECIMAL(10, 2)
- **Unit**: Centimeters (cm)
- **Description**: Product height
- **Example**: 4.0

## 📊 Database Schema

```sql
ALTER TABLE products
ADD COLUMN weight DECIMAL(10, 2) NULL COMMENT 'Weight in kilograms (kg)',
ADD COLUMN length DECIMAL(10, 2) NULL COMMENT 'Length in centimeters (cm)',
ADD COLUMN width DECIMAL(10, 2) NULL COMMENT 'Width in centimeters (cm)',
ADD COLUMN height DECIMAL(10, 2) NULL COMMENT 'Height in centimeters (cm)';
```

## 🔧 API Usage

### Create Product with Logistics
```http
POST /api/products/
Content-Type: application/json
Authorization: Bearer {token}

{
  "name": "Wireless Mouse",
  "sku": "MOU-001",
  "description": "Ergonomic wireless mouse",
  "category_id": 1,
  "unit_id": 1,
  "price": 29.99,
  "cost": 15.00,
  "stock_quantity": 100,
  "weight": 0.15,
  "length": 12.5,
  "width": 7.0,
  "height": 4.0,
  "is_active": true
}
```

### Update Product Logistics
```http
PUT /api/products/:id
Content-Type: application/json
Authorization: Bearer {token}

{
  "weight": 0.18,
  "length": 13.0,
  "width": 7.5,
  "height": 4.5
}
```

### Get Product with Logistics
```http
GET /api/products/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "status": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": 1,
    "name": "Wireless Mouse",
    "sku": "MOU-001",
    "price": "29.99",
    "weight": "0.15",
    "length": "12.50",
    "width": "7.00",
    "height": "4.00",
    "category": {...},
    "unit": {...},
    "images": [...]
  }
}
```

## 💡 Use Cases

### 1. **Shipping Cost Calculation**
```javascript
// Calculate shipping cost based on weight
const shippingRate = 5.00; // per kg
const shippingCost = product.weight * shippingRate;
```

### 2. **Volume Calculation**
```javascript
// Calculate volume in liters
const volume = (product.length * product.width * product.height) / 1000;
console.log(`Volume: ${volume.toFixed(2)} L`);
```

### 3. **Dimensional Weight**
```javascript
// Calculate dimensional weight (DIM weight)
const dimFactor = 5000; // cm³/kg (varies by carrier)
const dimWeight = (product.length * product.width * product.height) / dimFactor;
const chargeableWeight = Math.max(product.weight, dimWeight);
```

### 4. **Packaging Selection**
```javascript
// Determine appropriate box size
function selectPackaging(product) {
  const volume = (product.length * product.width * product.height) / 1000;
  
  if (volume <= 1) return 'Small Box';
  if (volume <= 5) return 'Medium Box';
  if (volume <= 20) return 'Large Box';
  return 'Extra Large Box';
}
```

### 5. **Warehouse Space Planning**
```javascript
// Calculate storage space requirements
const storageVolume = product.length * product.width * product.height;
const totalStorageNeeded = storageVolume * product.stock_quantity;
```

## 📋 Validation Rules

All logistics fields are **optional** but must be non-negative if provided:

- `weight >= 0` (in kg)
- `length >= 0` (in cm)
- `width >= 0` (in cm)
- `height >= 0` (in cm)

## 🎯 Benefits

1. **Accurate Shipping Costs** - Calculate precise shipping fees based on weight and dimensions
2. **Better Inventory Management** - Plan warehouse space efficiently
3. **Improved Logistics** - Optimize packaging and carrier selection
4. **Customer Information** - Display product size and weight to customers
5. **Compliance** - Meet shipping regulations and requirements
6. **Cost Optimization** - Choose most cost-effective shipping methods

## 📊 Example Data

### Small Product (Wireless Mouse)
```json
{
  "weight": 0.15,
  "length": 12.5,
  "width": 7.0,
  "height": 4.0
}
```
- Volume: 0.35 L
- Packaging: Small Box

### Medium Product (Laptop)
```json
{
  "weight": 2.5,
  "length": 35.0,
  "width": 25.0,
  "height": 2.5
}
```
- Volume: 2.19 L
- Packaging: Medium Box

### Large Product (Monitor)
```json
{
  "weight": 5.8,
  "length": 65.0,
  "width": 45.0,
  "height": 15.0
}
```
- Volume: 43.88 L
- Packaging: Large Box

## 🔄 Integration Points

### Shipping APIs
- Calculate real-time shipping rates
- Generate shipping labels
- Track packages

### E-commerce Platforms
- Display product dimensions to customers
- Calculate shipping costs at checkout
- Optimize packaging

### Warehouse Management
- Plan storage layout
- Optimize picking routes
- Calculate capacity

### Inventory Systems
- Track volumetric inventory
- Plan reorder quantities
- Optimize storage costs

## ✅ Testing

Sample data has been added to product ID 1:
```
Product: Wireless Mouse (MOU-001)
Weight: 0.15 kg
Dimensions: 12.50 x 7.00 x 4.00 cm
Volume: 0.35 L
```

Test the API:
```bash
GET http://192.168.68.103:5000/api/products/1
```

---

**Created**: December 5, 2025
**Version**: 1.0
**Status**: ✅ Live and Tested
