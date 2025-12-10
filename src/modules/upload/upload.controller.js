const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { success, error, successWithPagination } = require('../../core/utils/response');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '../../../public/uploads/images');

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename: timestamp-randomstring-originalname
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        const sanitizedName = nameWithoutExt.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, sanitizedName + '-' + uniqueSuffix + ext);
    }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    }
});

class UploadController {
    // Single image upload
    async uploadImage(req, res) {
        try {
            // Handle both single file (req.file) and any file (req.files)
            const file = req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

            if (!file) {
                return error(res, 'No file uploaded', 400);
            }

            const fileUrl = `/uploads/images/${file.filename}`;

            // Extract metadata from request body
            const { caption, description, alt_text } = req.body;

            return success(res, 'Image uploaded successfully', {
                filename: file.filename,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                url: fileUrl,
                path: file.path,
                // Include metadata in response
                meta: {
                    caption: caption || null,
                    description: description || null,
                    alt_text: alt_text || null
                }
            }, 201);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // Multiple images upload
    async uploadMultipleImages(req, res) {
        try {
            if (!req.files || req.files.length === 0) {
                return error(res, 'No files uploaded', 400);
            }

            // Extract metadata
            // Support 'metadata' field as JSON string (Array of objects)
            // OR legacy parallel arrays/strings
            let metadata = [];
            if (req.body.metadata) {
                try {
                    metadata = JSON.parse(req.body.metadata);
                } catch (e) {
                    // Ignore parse error, metadata remains empty array
                }
            }

            const { caption, description, alt_text } = req.body;

            const uploadedFiles = req.files.map((file, index) => {
                // Determine metadata for this specific file
                let fileMeta = {};

                if (metadata[index]) {
                    // Use structured metadata if available
                    fileMeta = metadata[index];
                } else {
                    // Fallback to individual fields (arrays or single values)
                    fileMeta = {
                        caption: Array.isArray(caption) ? caption[index] : caption,
                        description: Array.isArray(description) ? description[index] : description,
                        alt_text: Array.isArray(alt_text) ? alt_text[index] : alt_text
                    };
                }

                return {
                    filename: file.filename,
                    originalname: file.originalname,
                    mimetype: file.mimetype,
                    size: file.size,
                    url: `/uploads/images/${file.filename}`,
                    path: file.path,
                    meta: {
                        caption: fileMeta.caption || null,
                        description: fileMeta.description || null,
                        alt_text: fileMeta.alt_text || null
                    }
                };
            });

            return success(res, `${uploadedFiles.length} images uploaded successfully`, {
                count: uploadedFiles.length,
                files: uploadedFiles
            }, 201);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // Delete image
    async deleteImage(req, res) {
        try {
            const { filename } = req.params;
            const filePath = path.join(__dirname, '../../../public/uploads/images', filename);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                return error(res, 'File not found', 404);
            }

            // Delete the file
            fs.unlinkSync(filePath);

            return success(res, 'Image deleted successfully', {
                filename: filename
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // List all uploaded images
    async listImages(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const uploadDir = path.join(__dirname, '../../../public/uploads/images');

            if (!fs.existsSync(uploadDir)) {
                return successWithPagination(res, 'No images found', [], {
                    total: 0,
                    page,
                    limit
                });
            }

            const files = fs.readdirSync(uploadDir);

            const allImages = files
                .filter(file => {
                    const ext = path.extname(file).toLowerCase();
                    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
                })
                .map(file => {
                    const filePath = path.join(uploadDir, file);
                    const stats = fs.statSync(filePath);

                    return {
                        filename: file,
                        url: `/uploads/images/${file}`,
                        size: stats.size,
                        created: stats.birthtime,
                        modified: stats.mtime
                    };
                })
                .sort((a, b) => b.created - a.created); // Sort by newest first

            // Apply pagination
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedImages = allImages.slice(startIndex, endIndex);

            return successWithPagination(res, 'Images retrieved successfully', paginatedImages, {
                total: allImages.length,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }
}

module.exports = {
    UploadController: new UploadController(),
    uploadMiddleware: upload
};
