var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const { ProductRepository, CategoryRepository, UnitRepository, ProductImageRepository } = require('./products.repository');
class ProductService {
    // Helper method to transform product data
    _transformProduct(product) {
        const productData = product.toJSON ? product.toJSON() : product;
        // Transform image_url to thumb_url
        const transformed = Object.assign(Object.assign({}, productData), { thumb_url: productData.image_url || null, 
            // Convert numeric fields to proper numbers
            price: productData.price ? parseFloat(productData.price) : null, cost: productData.cost ? parseFloat(productData.cost) : null, purchase_tax: productData.purchase_tax ? parseFloat(productData.purchase_tax) : 0, sales_tax: productData.sales_tax ? parseFloat(productData.sales_tax) : 0, stock_quantity: productData.stock_quantity ? parseInt(productData.stock_quantity) : 0, min_stock_level: productData.min_stock_level ? parseInt(productData.min_stock_level) : null, max_stock_level: productData.max_stock_level ? parseInt(productData.max_stock_level) : null, weight: productData.weight ? parseFloat(productData.weight) : null, length: productData.length ? parseFloat(productData.length) : null, width: productData.width ? parseFloat(productData.width) : null, height: productData.height ? parseFloat(productData.height) : null });
        // Remove image_url from response
        delete transformed.image_url;
        // Transform images array to gallery_items (array of URLs)
        if (productData.images && Array.isArray(productData.images)) {
            transformed.gallery_items = productData.images.map(img => img.image_url);
            delete transformed.images;
        }
        return transformed;
    }
    // Product methods
    getAllProducts() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield ProductRepository.findAll(filters, limit, offset);
            // Transform each product
            const transformedData = result.rows.map(product => this._transformProduct(product));
            return {
                data: transformedData,
                total: result.count
            };
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield ProductRepository.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return this._transformProduct(product);
        });
    }
    createProduct(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if SKU already exists
            const existing = yield ProductRepository.findBySku(data.sku);
            if (existing) {
                throw new Error('Product with this SKU already exists');
            }
            const { thumb_url, gallery_items } = data, productData = __rest(data, ["thumb_url", "gallery_items"]);
            // Map thumb_url to image_url if image_url is not provided
            if (thumb_url && !productData.image_url) {
                productData.image_url = thumb_url;
            }
            // Set initial_stock if not provided (use stock_quantity)
            if (productData.initial_stock === undefined || productData.initial_stock === null) {
                productData.initial_stock = productData.stock_quantity || 0;
            }
            const product = yield ProductRepository.create(Object.assign(Object.assign({}, productData), { created_by: userId }));
            // Handle gallery items
            if (gallery_items && Array.isArray(gallery_items) && gallery_items.length > 0) {
                const images = gallery_items.map((url, index) => ({
                    product_id: product.id,
                    image_url: url,
                    sort_order: index
                }));
                yield ProductImageRepository.createMultiple(images);
            }
            return product;
        });
    }
    updateProduct(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // If SKU is being updated, check for duplicates
            if (data.sku) {
                const existing = yield ProductRepository.findBySku(data.sku);
                if (existing && existing.id !== parseInt(id)) {
                    throw new Error('Product with this SKU already exists');
                }
            }
            const { thumb_url, gallery_items } = data, productData = __rest(data, ["thumb_url", "gallery_items"]);
            // Map thumb_url to image_url if provided
            if (thumb_url && !productData.image_url) {
                productData.image_url = thumb_url;
            }
            const product = yield ProductRepository.update(id, productData);
            if (!product) {
                throw new Error('Product not found');
            }
            // Handle gallery items if provided
            if (gallery_items && Array.isArray(gallery_items)) {
                // Delete existing images for this product
                const existingImages = yield ProductImageRepository.findByProductId(id);
                for (const img of existingImages) {
                    yield ProductImageRepository.delete(img.id);
                }
                // Add new images
                if (gallery_items.length > 0) {
                    const images = gallery_items.map((url, index) => ({
                        product_id: id,
                        image_url: url,
                        sort_order: index
                    }));
                    yield ProductImageRepository.createMultiple(images);
                }
            }
            return this._transformProduct(product);
        });
    }
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield ProductRepository.delete(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return product;
        });
    }
    updateStock(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield ProductRepository.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            const { operation, quantity, notes, userId } = data;
            let newStockQuantity = product.stock_quantity;
            let movementQuantity = 0;
            let movementType = 'adjustment';
            if (operation === 'add') {
                newStockQuantity += quantity;
                movementQuantity = quantity; // Positive for stock in
                movementType = 'purchase';
            }
            else if (operation === 'subtract') {
                newStockQuantity -= quantity;
                if (newStockQuantity < 0) {
                    throw new Error('Insufficient stock quantity');
                }
                movementQuantity = -quantity; // Negative for stock out
                movementType = 'adjustment';
            }
            else if (operation === 'set') {
                movementQuantity = quantity - product.stock_quantity;
                newStockQuantity = quantity;
                movementType = 'adjustment';
            }
            else {
                throw new Error('Invalid operation. Use "add", "subtract", or "set"');
            }
            // Update stock and create movement record
            const StockMovement = require('./stock-movement.model');
            const updated = yield ProductRepository.update(id, { stock_quantity: newStockQuantity });
            // Allow overriding movement type if provided, otherwise stick to defaults
            if (data.movement_type) {
                movementType = data.movement_type;
            }
            // Record the stock movement
            yield StockMovement.create({
                product_id: id,
                movement_type: movementType,
                quantity: movementQuantity,
                reference_type: 'manual_adjustment',
                reference_id: null,
                notes: notes || `Stock ${operation} operation`,
                created_by: userId,
                created_at: data.date ? new Date(data.date) : new Date()
            });
            return this._transformProduct(updated);
        });
    }
    getStockMovements(productId_1) {
        return __awaiter(this, arguments, void 0, function* (productId, page = 1, limit = 10) {
            const product = yield ProductRepository.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            const StockMovement = require('./stock-movement.model');
            const offset = (page - 1) * limit;
            const result = yield StockMovement.findAndCountAll({
                where: { product_id: productId },
                limit,
                offset,
                order: [['created_at', 'DESC']]
            });
            return {
                product: {
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    current_stock: product.stock_quantity
                },
                movements: result.rows.map(row => (Object.assign(Object.assign({}, row.toJSON()), { date: row.created_at }))),
                total: result.count
            };
        });
    }
    getStockManagement() {
        return __awaiter(this, void 0, void 0, function* () {
            const allProducts = yield ProductRepository.findAll({ is_active: true }, 1000, 0);
            const lowStockProducts = yield ProductRepository.getLowStockProducts();
            const totalValue = allProducts.rows.reduce((sum, product) => {
                return sum + (parseFloat(product.price) * product.stock_quantity);
            }, 0);
            return {
                total_products: allProducts.count,
                low_stock_count: lowStockProducts.length,
                total_stock_value: totalValue.toFixed(2),
                low_stock_products: lowStockProducts
            };
        });
    }
    // Product Image methods
    getProductImages(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductImageRepository.findByProductId(productId);
        });
    }
    addProductImage(productId, imageData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify product exists
            const product = yield ProductRepository.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            return yield ProductImageRepository.create(Object.assign({ product_id: productId }, imageData));
        });
    }
    addMultipleProductImages(productId, images) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verify product exists
            const product = yield ProductRepository.findById(productId);
            if (!product) {
                throw new Error('Product not found');
            }
            const imageData = images.map((img, index) => ({
                product_id: productId,
                image_url: img.image_url,
                is_primary: img.is_primary || false,
                sort_order: img.sort_order || index,
                caption: img.caption || null
            }));
            return yield ProductImageRepository.createMultiple(imageData);
        });
    }
    updateProductImage(imageId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield ProductImageRepository.update(imageId, data);
            if (!image) {
                throw new Error('Product image not found');
            }
            return image;
        });
    }
    deleteProductImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield ProductImageRepository.delete(imageId);
            if (!image) {
                throw new Error('Product image not found');
            }
            return image;
        });
    }
    setPrimaryProductImage(productId, imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield ProductImageRepository.setPrimaryImage(productId, imageId);
            if (!image) {
                throw new Error('Product image not found or does not belong to this product');
            }
            return image;
        });
    }
    // Category methods
    getAllCategories(search_1) {
        return __awaiter(this, arguments, void 0, function* (search, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const filters = { search };
            const result = yield CategoryRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield CategoryRepository.findById(id);
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        });
    }
    createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield CategoryRepository.create(data);
        });
    }
    updateCategory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield CategoryRepository.update(id, data);
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield CategoryRepository.delete(id);
            if (!category) {
                throw new Error('Category not found');
            }
            return category;
        });
    }
    // Unit methods
    getAllUnits() {
        return __awaiter(this, arguments, void 0, function* (filters = {}, page = 1, limit = 10) {
            const offset = (page - 1) * limit;
            const result = yield UnitRepository.findAll(filters, limit, offset);
            return {
                data: result.rows,
                total: result.count
            };
        });
    }
    getUnitById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield UnitRepository.findById(id);
            if (!unit) {
                throw new Error('Unit not found');
            }
            return unit;
        });
    }
    createUnit(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield UnitRepository.create(data);
        });
    }
    updateUnit(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield UnitRepository.update(id, data);
            if (!unit) {
                throw new Error('Unit not found');
            }
            return unit;
        });
    }
    deleteUnit(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const unit = yield UnitRepository.delete(id);
            if (!unit) {
                throw new Error('Unit not found');
            }
            return unit;
        });
    }
    getStockDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository.getStockDetails();
        });
    }
}
module.exports = new ProductService();
