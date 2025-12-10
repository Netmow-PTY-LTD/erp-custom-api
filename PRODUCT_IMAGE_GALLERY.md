# Product Image Gallery Feature

## 📸 Overview

Added comprehensive image gallery functionality to the Products module, allowing each product to have multiple images with a primary image designation.

## ✨ Features

### 1. **ProductImage Model**
- Separate table for storing product images
- Fields:
  - `id` - Primary key
  - `product_id` - Foreign key to products table
  - `image_url` - URL/path to the image
  - `is_primary` - Boolean flag for main product image
  - `sort_order` - Display order in gallery
  - `caption` - Image caption or alt text
  - `created_at` / `updated_at` - Timestamps

### 2. **API Endpoints**

#### Get Product with Images
```
GET /api/products/:id
```
Returns product details including the `images` array with all gallery images.

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
    "images": [
      {
        "id": 1,
        "product_id": 1,
        "image_url": "https://example.com/image1.jpg",
        "is_primary": true,
        "sort_order": 0,
        "caption": "Main product image"
      },
      {
        "id": 2,
        "product_id": 1,
        "image_url": "https://example.com/image2.jpg",
        "is_primary": false,
        "sort_order": 1,
        "caption": "Side view"
      }
    ]
  }
}
```

#### Get Product Images
```
GET /api/products/:productId/images
```
Returns all images for a specific product, ordered by primary status and sort order.

#### Add Single Image
```
POST /api/products/:productId/images
```
**Request Body:**
```json
{
  "image_url": "/uploads/products/laptop-back.jpg",
  "is_primary": false,
  "sort_order": 2,
  "caption": "Back view"
}
```

#### Add Multiple Images (Bulk)
```
POST /api/products/:productId/images/bulk
```
**Request Body:**
```json
{
  "images": [
    {
      "image_url": "/uploads/products/laptop-1.jpg",
      "is_primary": true,
      "sort_order": 0,
      "caption": "Main image"
    },
    {
      "image_url": "/uploads/products/laptop-2.jpg",
      "is_primary": false,
      "sort_order": 1,
      "caption": "Detail view"
    }
  ]
}
```

#### Update Image
```
PUT /api/products/images/:imageId
```
**Request Body:**
```json
{
  "caption": "Updated caption",
  "sort_order": 5,
  "is_primary": false
}
```

#### Delete Image
```
DELETE /api/products/images/:imageId
```

#### Set Primary Image
```
PUT /api/products/:productId/images/:imageId/set-primary
```
Automatically removes primary flag from all other images and sets the specified image as primary.

## 🗄️ Database Schema

### product_images Table
```sql
CREATE TABLE product_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  caption VARCHAR(255),
  created_at DATETIME DEFAULT NOW(),
  updated_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 📊 Architecture

### Layer Structure
1. **Model** (`products.model.js`)
   - `ProductImage` Sequelize model
   - Association: `Product.hasMany(ProductImage)`

2. **Repository** (`products.repository.js`)
   - `ProductImageRepository` class
   - Methods: `findByProductId`, `create`, `createMultiple`, `update`, `delete`, `setPrimaryImage`

3. **Service** (`products.service.js`)
   - Business logic for image management
   - Validation and error handling
   - Methods: `getProductImages`, `addProductImage`, `addMultipleProductImages`, `updateProductImage`, `deleteProductImage`, `setPrimaryProductImage`

4. **Controller** (`products.controller.js`)
   - HTTP request/response handling
   - Calls service methods
   - Returns formatted JSON responses

5. **Routes** (`products.routes.js`)
   - 6 new routes for image management
   - Comprehensive documentation with sample requests/responses

## 🎯 Use Cases

### 1. **E-commerce Product Display**
- Main product image (is_primary = true)
- Multiple gallery images for different angles
- Captions for accessibility

### 2. **Image Management**
- Upload multiple images at once
- Reorder images using sort_order
- Change primary image dynamically
- Delete unwanted images

### 3. **Frontend Integration**
- Fetch product with all images in single request
- Display image gallery/carousel
- Show primary image as thumbnail
- Use captions for alt text

## 🔧 Implementation Details

### Automatic Ordering
Images are automatically ordered by:
1. Primary status (primary images first)
2. Sort order (ascending)

### Primary Image Logic
- Only one image can be primary per product
- Setting a new primary image automatically removes the flag from others
- Ensures data consistency

### Associations
- Products automatically include images when fetched
- Images are loaded with proper ordering
- Efficient database queries using Sequelize includes

## 📝 Sample Data

Sample images have been added to product ID 1:
- Main product image (PRIMARY) - Laptop front view
- Side view (Gallery)
- Detail view (Gallery)

## 🚀 Testing

All endpoints have been tested and are working correctly:
- ✅ GET /api/products/:id - Returns product with images array
- ✅ GET /api/products/:productId/images - Returns all product images
- ✅ POST /api/products/:productId/images - Add single image
- ✅ POST /api/products/:productId/images/bulk - Add multiple images
- ✅ PUT /api/products/images/:imageId - Update image
- ✅ DELETE /api/products/images/:imageId - Delete image
- ✅ PUT /api/products/:productId/images/:imageId/set-primary - Set primary

## 📈 Benefits

1. **Scalability** - Separate table allows unlimited images per product
2. **Flexibility** - Easy to add/remove/reorder images
3. **Performance** - Efficient queries with proper indexing
4. **User Experience** - Rich product visualization
5. **SEO** - Image captions improve accessibility and SEO

---

**Created**: December 5, 2025
**Version**: 1.0
**Status**: ✅ Live and Tested
