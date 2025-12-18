const { ProductRepository, CategoryRepository, UnitRepository, ProductImageRepository } = require('./products.repository');

class ProductService {
    // Helper method to transform product data
    _transformProduct(product) {
        const productData = product.toJSON ? product.toJSON() : product;

        // Transform image_url to thumb_url
        const transformed = {
            ...productData,
            thumb_url: productData.image_url || null,
            // Convert numeric fields to proper numbers
            price: productData.price ? parseFloat(productData.price) : null,
            cost: productData.cost ? parseFloat(productData.cost) : null,
            purchase_tax: productData.purchase_tax ? parseFloat(productData.purchase_tax) : 0,
            sales_tax: productData.sales_tax ? parseFloat(productData.sales_tax) : 0,
            stock_quantity: productData.stock_quantity ? parseInt(productData.stock_quantity) : 0,
            min_stock_level: productData.min_stock_level ? parseInt(productData.min_stock_level) : null,
            max_stock_level: productData.max_stock_level ? parseInt(productData.max_stock_level) : null,
            weight: productData.weight ? parseFloat(productData.weight) : null,
            length: productData.length ? parseFloat(productData.length) : null,
            width: productData.width ? parseFloat(productData.width) : null,
            height: productData.height ? parseFloat(productData.height) : null
        };

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
    async getAllProducts(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await ProductRepository.findAll(filters, limit, offset);

        // Transform each product
        const transformedData = result.rows.map(product => this._transformProduct(product));

        return {
            data: transformedData,
            total: result.count
        };
    }

    async getProductById(id) {
        const product = await ProductRepository.findById(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return this._transformProduct(product);
    }

    async createProduct(data, userId) {
        // Check if SKU already exists
        const existing = await ProductRepository.findBySku(data.sku);
        if (existing) {
            throw new Error('Product with this SKU already exists');
        }

        const { thumb_url, gallery_items, ...productData } = data;

        // Map thumb_url to image_url if image_url is not provided
        if (thumb_url && !productData.image_url) {
            productData.image_url = thumb_url;
        }

        // Set initial_stock if not provided (use stock_quantity)
        if (productData.initial_stock === undefined || productData.initial_stock === null) {
            productData.initial_stock = productData.stock_quantity || 0;
        }

        const product = await ProductRepository.create({ ...productData, created_by: userId });

        // Handle gallery items
        if (gallery_items && Array.isArray(gallery_items) && gallery_items.length > 0) {
            const images = gallery_items.map((url, index) => ({
                product_id: product.id,
                image_url: url,
                sort_order: index
            }));
            await ProductImageRepository.createMultiple(images);
        }

        return product;
    }

    async updateProduct(id, data) {
        // If SKU is being updated, check for duplicates
        if (data.sku) {
            const existing = await ProductRepository.findBySku(data.sku);
            if (existing && existing.id !== parseInt(id)) {
                throw new Error('Product with this SKU already exists');
            }
        }

        const { thumb_url, gallery_items, ...productData } = data;

        // Map thumb_url to image_url if provided
        if (thumb_url && !productData.image_url) {
            productData.image_url = thumb_url;
        }

        const product = await ProductRepository.update(id, productData);
        if (!product) {
            throw new Error('Product not found');
        }

        // Handle gallery items if provided
        if (gallery_items && Array.isArray(gallery_items)) {
            // Delete existing images for this product
            const existingImages = await ProductImageRepository.findByProductId(id);
            for (const img of existingImages) {
                await ProductImageRepository.delete(img.id);
            }

            // Add new images
            if (gallery_items.length > 0) {
                const images = gallery_items.map((url, index) => ({
                    product_id: id,
                    image_url: url,
                    sort_order: index
                }));
                await ProductImageRepository.createMultiple(images);
            }
        }

        return this._transformProduct(product);
    }

    async deleteProduct(id) {
        const product = await ProductRepository.delete(id);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async updateStock(id, data) {
        const product = await ProductRepository.findById(id);
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
        } else if (operation === 'subtract') {
            newStockQuantity -= quantity;
            if (newStockQuantity < 0) {
                throw new Error('Insufficient stock quantity');
            }
            movementQuantity = -quantity; // Negative for stock out
            movementType = 'adjustment';
        } else if (operation === 'set') {
            movementQuantity = quantity - product.stock_quantity;
            newStockQuantity = quantity;
            movementType = 'adjustment';
        } else {
            throw new Error('Invalid operation. Use "add", "subtract", or "set"');
        }

        // Update stock and create movement record
        const StockMovement = require('./stock-movement.model');
        const updated = await ProductRepository.update(id, { stock_quantity: newStockQuantity });

        // Allow overriding movement type if provided, otherwise stick to defaults
        if (data.movement_type) {
            movementType = data.movement_type;
        }

        // Record the stock movement
        await StockMovement.create({
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
    }

    async getStockMovements(productId, page = 1, limit = 10) {
        const product = await ProductRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const StockMovement = require('./stock-movement.model');
        const offset = (page - 1) * limit;

        const result = await StockMovement.findAndCountAll({
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
            movements: result.rows.map(row => ({
                ...row.toJSON(),
                date: row.created_at
            })),
            total: result.count
        };
    }

    async getStockManagement() {
        const allProducts = await ProductRepository.findAll({ is_active: true }, 1000, 0);
        const lowStockProducts = await ProductRepository.getLowStockProducts();

        const totalValue = allProducts.rows.reduce((sum, product) => {
            return sum + (parseFloat(product.price) * product.stock_quantity);
        }, 0);

        return {
            total_products: allProducts.count,
            low_stock_count: lowStockProducts.length,
            total_stock_value: totalValue.toFixed(2),
            low_stock_products: lowStockProducts
        };
    }

    // Product Image methods
    async getProductImages(productId) {
        return await ProductImageRepository.findByProductId(productId);
    }

    async addProductImage(productId, imageData) {
        // Verify product exists
        const product = await ProductRepository.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        return await ProductImageRepository.create({
            product_id: productId,
            ...imageData
        });
    }

    async addMultipleProductImages(productId, images) {
        // Verify product exists
        const product = await ProductRepository.findById(productId);
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

        return await ProductImageRepository.createMultiple(imageData);
    }

    async updateProductImage(imageId, data) {
        const image = await ProductImageRepository.update(imageId, data);
        if (!image) {
            throw new Error('Product image not found');
        }
        return image;
    }

    async deleteProductImage(imageId) {
        const image = await ProductImageRepository.delete(imageId);
        if (!image) {
            throw new Error('Product image not found');
        }
        return image;
    }

    async setPrimaryProductImage(productId, imageId) {
        const image = await ProductImageRepository.setPrimaryImage(productId, imageId);
        if (!image) {
            throw new Error('Product image not found or does not belong to this product');
        }
        return image;
    }

    // Category methods
    async getAllCategories(search, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const filters = { search };
        const result = await CategoryRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getCategoryById(id) {
        const category = await CategoryRepository.findById(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async createCategory(data) {
        return await CategoryRepository.create(data);
    }

    async updateCategory(id, data) {
        const category = await CategoryRepository.update(id, data);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    async deleteCategory(id) {
        const category = await CategoryRepository.delete(id);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    }

    // Unit methods
    async getAllUnits(filters = {}, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        const result = await UnitRepository.findAll(filters, limit, offset);
        return {
            data: result.rows,
            total: result.count
        };
    }

    async getUnitById(id) {
        const unit = await UnitRepository.findById(id);
        if (!unit) {
            throw new Error('Unit not found');
        }
        return unit;
    }

    async createUnit(data) {
        return await UnitRepository.create(data);
    }

    async updateUnit(id, data) {
        const unit = await UnitRepository.update(id, data);
        if (!unit) {
            throw new Error('Unit not found');
        }
        return unit;
    }

    async deleteUnit(id) {
        const unit = await UnitRepository.delete(id);
        if (!unit) {
            throw new Error('Unit not found');
        }
        return unit;
    }

    async getStockDetails() {
        return await ProductRepository.getStockDetails();
    }
}

module.exports = new ProductService();
