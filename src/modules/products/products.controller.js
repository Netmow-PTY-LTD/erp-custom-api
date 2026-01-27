const ProductService = require('./products.service');
const { success, error, successWithPagination } = require('../../core/utils/response');

class ProductController {
    async getAllProducts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                category_id: req.query.category_id,
                is_active: req.query.is_active,
                stock_status: req.query.stock_status,
                search: req.query.search
            };

            const result = await ProductService.getAllProducts(filters, page, limit);
            return successWithPagination(res, 'Products retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getProductById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            return success(res, 'Product retrieved successfully', product);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async createProduct(req, res) {
        try {
            const product = await ProductService.createProduct(req.body, req.user.id);
            return success(res, 'Product created successfully', product, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updateProduct(req, res) {
        try {
            const product = await ProductService.updateProduct(req.params.id, req.body);
            return success(res, 'Product updated successfully', product);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteProduct(req, res) {
        try {
            await ProductService.deleteProduct(req.params.id);
            return success(res, 'Product deleted successfully', null);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async getAllCategories(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search;
            const result = await ProductService.getAllCategories(search, page, limit);
            return successWithPagination(res, 'Categories retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async createCategory(req, res) {
        try {
            const category = await ProductService.createCategory(req.body, req.user.id);
            return success(res, 'Category created successfully', category, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async getCategoryById(req, res) {
        try {
            const category = await ProductService.getCategoryById(req.params.id);
            return success(res, 'Category retrieved successfully', category);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async updateCategory(req, res) {
        try {
            const category = await ProductService.updateCategory(req.params.id, req.body);
            return success(res, 'Category updated successfully', category);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteCategory(req, res) {
        try {
            await ProductService.deleteCategory(req.params.id);
            return success(res, 'Category deleted successfully', null);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async getAllUnits(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                search: req.query.search
            };
            const result = await ProductService.getAllUnits(filters, page, limit);
            return successWithPagination(res, 'Units retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async createUnit(req, res) {
        try {
            const unit = await ProductService.createUnit(req.body, req.user.id);
            return success(res, 'Unit created successfully', unit, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async getUnitById(req, res) {
        try {
            const unit = await ProductService.getUnitById(req.params.id);
            return success(res, 'Unit retrieved successfully', unit);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async updateUnit(req, res) {
        try {
            const unit = await ProductService.updateUnit(req.params.id, req.body);
            return success(res, 'Unit updated successfully', unit);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteUnit(req, res) {
        try {
            await ProductService.deleteUnit(req.params.id);
            return success(res, 'Unit deleted successfully', null);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async getStockDetails(req, res) {
        try {
            const data = await ProductService.getStockDetails();
            return success(res, 'Stock details retrieved successfully', data);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    // Product Image methods
    async getProductImages(req, res) {
        try {
            const images = await ProductService.getProductImages(req.params.productId);
            return success(res, 'Product images retrieved successfully', images);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async addProductImage(req, res) {
        try {
            const image = await ProductService.addProductImage(req.params.productId, req.body);
            return success(res, 'Product image added successfully', image, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async addMultipleProductImages(req, res) {
        try {
            const images = await ProductService.addMultipleProductImages(req.params.productId, req.body.images);
            return success(res, 'Product images added successfully', images, 201);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updateProductImage(req, res) {
        try {
            const image = await ProductService.updateProductImage(req.params.imageId, req.body);
            return success(res, 'Product image updated successfully', image);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async deleteProductImage(req, res) {
        try {
            await ProductService.deleteProductImage(req.params.imageId);
            return success(res, 'Product image deleted successfully', null);
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async setPrimaryProductImage(req, res) {
        try {
            const image = await ProductService.setPrimaryProductImage(req.params.productId, req.params.imageId);
            return success(res, 'Primary image set successfully', image);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async updateStock(req, res) {
        try {
            const stockData = {
                ...req.body,
                userId: req.user.id
            };
            const product = await ProductService.updateStock(req.params.id, stockData);
            return success(res, 'Stock updated successfully', product);
        } catch (err) {
            return error(res, err.message, 400);
        }
    }

    async getStockMovements(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const result = await ProductService.getStockMovements(req.params.id, page, limit);
            return successWithPagination(res, 'Stock movements retrieved successfully', result.movements, {
                total: result.total,
                page,
                limit,
                product: result.product
            });
        } catch (err) {
            return error(res, err.message, 404);
        }
    }

    async getProductStats(req, res) {
        try {
            const stats = await ProductService.getProductStats();
            return success(res, 'Product stats retrieved successfully', stats);
        } catch (err) {
            return error(res, err.message, 500);
        }
    }

    async getProductOrders(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const filters = {
                status: req.query.status,
                start_date: req.query.start_date,
                end_date: req.query.end_date
            };
            const result = await ProductService.getProductOrders(req.params.id, filters, page, limit);
            return successWithPagination(res, 'Product orders retrieved successfully', result.data, {
                total: result.total,
                page,
                limit
            });
        } catch (err) {
            return error(res, err.message, err.message === 'Product not found' ? 404 : 500);
        }
    }
}

module.exports = new ProductController();
