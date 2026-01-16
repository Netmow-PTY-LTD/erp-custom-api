const express = require('express');
const router = express.Router();
const { UploadController, uploadMiddleware } = require('./upload.controller');
const { verifyToken } = require('../../core/middleware/auth');
// Module name for routes-tree grouping
router.moduleName = 'Upload';
// Apply authentication to all routes
router.use(verifyToken);
// Define routes metadata
router.routesMeta = [
    {
        path: '/image',
        method: 'POST',
        middlewares: [uploadMiddleware.any()],
        handler: (req, res) => UploadController.uploadImage(req, res),
        description: 'Upload a single image to global gallery. Accepts any field name for the file (e.g., "image", "file"). Metadata fields are optional.',
        requestType: 'multipart/form-data',
        requestFields: {
            image: 'File (JPEG, PNG, GIF, WebP) - Max 5MB (Field name can be anything)',
            caption: 'Optional caption for the image',
            description: 'Optional description',
            alt_text: 'Optional alt text for accessibility'
        },
        sampleRequest: {
            image: '(File) product.jpg',
            caption: 'Product front view',
            description: 'High quality front view of the product',
            alt_text: 'Product front view'
        },
        sampleResponse: {
            status: true,
            message: 'Image uploaded successfully',
            data: {
                filename: 'product_image-1733400000000-123456789.jpg',
                originalname: 'product_image.jpg',
                mimetype: 'image/jpeg',
                size: 245678,
                url: '/uploads/images/product_image-1733400000000-123456789.jpg',
                path: '/path/to/public/uploads/images/product_image-1733400000000-123456789.jpg',
                meta: {
                    caption: 'Product front view',
                    description: 'High quality front view of the product',
                    alt_text: 'Product front view'
                }
            }
        }
    },
    {
        path: '/images',
        method: 'POST',
        middlewares: [uploadMiddleware.array('images', 10)],
        handler: (req, res) => UploadController.uploadMultipleImages(req, res),
        description: 'Upload multiple images (max 10) to global gallery',
        requestType: 'multipart/form-data',
        requestFields: {
            images: 'Multiple files (JPEG, PNG, GIF, WebP) - Max 5MB each',
            metadata: 'JSON String representing array of metadata objects (Optional)',
            caption: 'Legacy: Optional caption (string or array)',
            description: 'Legacy: Optional description (string or array)',
            alt_text: 'Legacy: Optional alt text (string or array)'
        },
        sampleRequest: {
            images: ['(File) image1.jpg', '(File) image2.jpg'],
            metadata: JSON.stringify([
                { caption: "Image 1 caption", alt_text: "Alt 1" },
                { caption: "Image 2 caption", alt_text: "Alt 2" }
            ])
        },
        sampleResponse: {
            status: true,
            message: '3 images uploaded successfully',
            data: {
                count: 3,
                files: [
                    {
                        filename: 'image1-1733400000000-123456789.jpg',
                        originalname: 'image1.jpg',
                        mimetype: 'image/jpeg',
                        size: 245678,
                        url: '/uploads/images/image1-1733400000000-123456789.jpg',
                        meta: {
                            caption: 'Image 1 caption',
                            description: null,
                            alt_text: null
                        }
                    }
                ]
            }
        }
    },
    {
        path: '/images',
        method: 'GET',
        middlewares: [],
        handler: (req, res) => UploadController.listImages(req, res),
        description: 'List all uploaded images in gallery',
        sampleResponse: {
            success: true,
            message: 'Images retrieved successfully',
            pagination: {
                total: 15,
                page: "1",
                limit: "10",
                totalPage: 2
            },
            data: [
                {
                    filename: 'product_image-1733400000000-123456789.jpg',
                    url: '/uploads/images/product_image-1733400000000-123456789.jpg',
                    size: 245678,
                    created: '2025-12-05T12:00:00.000Z',
                    modified: '2025-12-05T12:00:00.000Z'
                }
            ]
        }
    },
    {
        path: '/images/:filename',
        method: 'DELETE',
        middlewares: [],
        handler: (req, res) => UploadController.deleteImage(req, res),
        description: 'Delete an image from gallery',
        sampleResponse: {
            status: true,
            message: 'Image deleted successfully',
            data: {
                filename: 'product_image-1733400000000-123456789.jpg'
            }
        }
    }
];
// Register routes from metadata
router.routesMeta.forEach(r => {
    router[r.method.toLowerCase()](r.path, ...r.middlewares, r.handler);
});
module.exports = router;
