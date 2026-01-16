var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ProductService = require('./products.service');
const { success, error, successWithPagination } = require('../../core/utils/response');
class ProductController {
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    category_id: req.query.category_id,
                    is_active: req.query.is_active,
                    search: req.query.search
                };
                const result = yield ProductService.getAllProducts(filters, page, limit);
                return successWithPagination(res, 'Products retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield ProductService.getProductById(req.params.id);
                return success(res, 'Product retrieved successfully', product);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield ProductService.createProduct(req.body, req.user.id);
                return success(res, 'Product created successfully', product, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield ProductService.updateProduct(req.params.id, req.body);
                return success(res, 'Product updated successfully', product);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ProductService.deleteProduct(req.params.id);
                return success(res, 'Product deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    getAllCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search;
                const result = yield ProductService.getAllCategories(search, page, limit);
                return successWithPagination(res, 'Categories retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield ProductService.createCategory(req.body);
                return success(res, 'Category created successfully', category, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    getCategoryById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield ProductService.getCategoryById(req.params.id);
                return success(res, 'Category retrieved successfully', category);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield ProductService.updateCategory(req.params.id, req.body);
                return success(res, 'Category updated successfully', category);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ProductService.deleteCategory(req.params.id);
                return success(res, 'Category deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    getAllUnits(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const filters = {
                    search: req.query.search
                };
                const result = yield ProductService.getAllUnits(filters, page, limit);
                return successWithPagination(res, 'Units retrieved successfully', result.data, {
                    total: result.total,
                    page,
                    limit
                });
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    createUnit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unit = yield ProductService.createUnit(req.body);
                return success(res, 'Unit created successfully', unit, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    getUnitById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unit = yield ProductService.getUnitById(req.params.id);
                return success(res, 'Unit retrieved successfully', unit);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    updateUnit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const unit = yield ProductService.updateUnit(req.params.id, req.body);
                return success(res, 'Unit updated successfully', unit);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteUnit(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ProductService.deleteUnit(req.params.id);
                return success(res, 'Unit deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    getStockDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield ProductService.getStockDetails();
                return success(res, 'Stock details retrieved successfully', data);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    // Product Image methods
    getProductImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const images = yield ProductService.getProductImages(req.params.productId);
                return success(res, 'Product images retrieved successfully', images);
            }
            catch (err) {
                return error(res, err.message, 500);
            }
        });
    }
    addProductImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = yield ProductService.addProductImage(req.params.productId, req.body);
                return success(res, 'Product image added successfully', image, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    addMultipleProductImages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const images = yield ProductService.addMultipleProductImages(req.params.productId, req.body.images);
                return success(res, 'Product images added successfully', images, 201);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateProductImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = yield ProductService.updateProductImage(req.params.imageId, req.body);
                return success(res, 'Product image updated successfully', image);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    deleteProductImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ProductService.deleteProductImage(req.params.imageId);
                return success(res, 'Product image deleted successfully', null);
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
    setPrimaryProductImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = yield ProductService.setPrimaryProductImage(req.params.productId, req.params.imageId);
                return success(res, 'Primary image set successfully', image);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    updateStock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stockData = Object.assign(Object.assign({}, req.body), { userId: req.user.id });
                const product = yield ProductService.updateStock(req.params.id, stockData);
                return success(res, 'Stock updated successfully', product);
            }
            catch (err) {
                return error(res, err.message, 400);
            }
        });
    }
    getStockMovements(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const result = yield ProductService.getStockMovements(req.params.id, page, limit);
                return successWithPagination(res, 'Stock movements retrieved successfully', result.movements, {
                    total: result.total,
                    page,
                    limit,
                    product: result.product
                });
            }
            catch (err) {
                return error(res, err.message, 404);
            }
        });
    }
}
module.exports = new ProductController();
