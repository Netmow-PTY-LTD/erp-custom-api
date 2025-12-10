# Upload Module Documentation

## 📤 Overview

The Upload module provides a global image upload service for the ERP system. It handles single and multiple file uploads, validation, storage, and metadata management.

## ✨ Features

- **Single Image Upload**: Upload one image at a time with metadata.
- **Multiple Image Upload**: Upload up to 10 images at once with metadata.
- **Metadata Support**: Add captions, descriptions, and alt text to uploads.
- **File Validation**: Only accepts image files (JPEG, PNG, GIF, WebP).
- **Size Limit**: Max 5MB per file.
- **Secure Filenames**: Automatically generates unique, sanitized filenames.
- **Public Access**: Uploaded images are served statically via `/uploads`.
- **Management**: List and delete uploaded images.

## 🚀 API Endpoints

### 1. Upload Single Image
**POST** `/api/upload/image`

**Request:**
- `Content-Type`: `multipart/form-data`
- Body:
  - `image`: File (Required)
  - `caption`: String (Optional)
  - `description`: String (Optional)
  - `alt_text`: String (Optional)

**Response:**
```json
{
    "status": true,
    "message": "Image uploaded successfully",
    "data": {
        "filename": "product-1733400000-123.jpg",
        "originalname": "product.jpg",
        "mimetype": "image/jpeg",
        "size": 102400,
        "url": "/uploads/images/product-1733400000-123.jpg",
        "meta": {
            "caption": "Product Front View",
            "description": "High resolution front shot",
            "alt_text": "Front view of the product"
        }
    }
}
```

### 2. Upload Multiple Images
**POST** `/api/upload/images`

**Request:**
- `Content-Type`: `multipart/form-data`
- Body:
  - `images`: Array of Files (Required, max 10)
  - `metadata`: JSON String (Optional) - Array of metadata objects corresponding to images.

**Example Request Body:**
```
images: [File1, File2]
metadata: '[{"caption":"Image 1", "alt_text":"Alt 1"}, {"caption":"Image 2", "alt_text":"Alt 2"}]'
```

*Legacy Support: You can still use parallel arrays (`caption[]`, `description[]`) but the `metadata` JSON string is recommended for clarity.*

**Response:**
```json
{
    "status": true,
    "message": "2 images uploaded successfully",
    "data": {
        "count": 2,
        "files": [
            {
                "filename": "img1-1733400000-123.jpg",
                "url": "/uploads/images/img1-1733400000-123.jpg",
                "meta": {
                    "caption": "Image 1",
                    "description": null,
                    "alt_text": "Alt 1"
                }
            },
            {
                "filename": "img2-1733400000-124.jpg",
                "url": "/uploads/images/img2-1733400000-124.jpg",
                "meta": {
                    "caption": "Image 2",
                    "description": null,
                    "alt_text": "Alt 2"
                }
            }
        ]
    }
}
```

### 3. List Images
**GET** `/api/upload/images`

Returns a paginated list of all uploaded images sorted by newest first.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Images retrieved successfully",
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPage": 2
  },
  "data": [
    {
      "filename": "product_image-1733400000000-123456789.jpg",
      "url": "/uploads/images/product_image-1733400000000-123456789.jpg",
      "size": 245678,
      "created": "2025-12-05T12:00:00.000Z",
      "modified": "2025-12-05T12:00:00.000Z"
    },
    ...
  ]
}
```

### 4. Delete Image
**DELETE** `/api/upload/images/:filename`

Deletes a specific image from the server.

## 📂 Storage Structure

Images are stored in:
`public/uploads/images/`

Accessible via URL:
`http://your-domain.com/uploads/images/<filename>`

## 🔒 Security & Validation

- **Authentication**: All routes require a valid JWT token.
- **File Types**: Restricted to `image/jpeg`, `image/png`, `image/gif`, `image/webp`.
- **File Size**: Restricted to 5MB.
- **Filenames**: Sanitized to prevent directory traversal and overwrite attacks.

---

**Created**: December 5, 2025
**Version**: 1.3
**Status**: ✅ Live and Tested
