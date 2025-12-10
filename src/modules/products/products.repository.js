const { Product, Category, Unit, ProductImage } = require('./products.model');
const { Op, Sequelize } = require('sequelize');

class ProductRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};

        if (filters.category_id) {
            where.category_id = filters.category_id;
        }

        if (filters.is_active !== undefined) {
            where.is_active = filters.is_active;
        }

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { sku: { [Op.like]: `%${filters.search}%` } },
                { barcode: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await Product.findAndCountAll({
            where,
            include: [
                { model: Category, as: 'category' },
                { model: Unit, as: 'unit' },
                {
                    model: ProductImage,
                    as: 'images',
                    order: [['sort_order', 'ASC'], ['is_primary', 'DESC']]
                }
            ],
            limit,
            offset,
            order: [['created_at', 'DESC']],
            distinct: true
        });
    }

    async findById(id) {
        return await Product.findByPk(id, {
            include: [
                { model: Category, as: 'category' },
                { model: Unit, as: 'unit' },
                {
                    model: ProductImage,
                    as: 'images',
                    order: [['sort_order', 'ASC'], ['is_primary', 'DESC']]
                }
            ]
        });
    }

    async findBySku(sku) {
        return await Product.findOne({ where: { sku } });
    }

    async create(data) {
        return await Product.create(data);
    }

    async update(id, data) {
        const product = await Product.findByPk(id);
        if (!product) return null;
        return await product.update(data);
    }

    async delete(id) {
        const product = await Product.findByPk(id);
        if (!product) return null;
        await product.destroy();
        return product;
    }

    async getLowStockProducts() {
        return await Product.findAll({
            where: {
                stock_quantity: {
                    [Op.lte]: Sequelize.col('min_stock_level')
                },
                is_active: true
            },
            include: [
                { model: Category, as: 'category' },
                { model: Unit, as: 'unit' }
            ]
        });
    }

    async getStockDetails() {
        const totalProducts = await Product.count({ where: { is_active: true } });

        const lowStockProducts = await this.getLowStockProducts();

        const totalValueResult = await Product.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.literal('stock_quantity * COALESCE(cost, 0)')), 'totalValue']
            ],
            where: { is_active: true },
            raw: true
        });

        const totalStockValue = totalValueResult[0].totalValue || 0;

        return {
            total_products: totalProducts,
            low_stock_count: lowStockProducts.length,
            total_stock_value: parseFloat(totalStockValue).toFixed(2),
            low_stock_products: lowStockProducts
        };
    }
}

class CategoryRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = {};

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { description: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await Category.findAndCountAll({
            where,
            limit,
            offset,
            order: [['name', 'ASC']]
        });
    }

    async findById(id) {
        return await Category.findByPk(id);
    }

    async create(data) {
        return await Category.create(data);
    }

    async update(id, data) {
        const category = await Category.findByPk(id);
        if (!category) return null;
        return await category.update(data);
    }

    async delete(id) {
        const category = await Category.findByPk(id);
        if (!category) return null;
        await category.destroy();
        return category;
    }
}

class UnitRepository {
    async findAll(filters = {}, limit = 10, offset = 0) {
        const where = { is_active: true };

        if (filters.search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${filters.search}%` } },
                { symbol: { [Op.like]: `%${filters.search}%` } }
            ];
        }

        return await Unit.findAndCountAll({
            where,
            limit,
            offset,
            order: [['name', 'ASC']]
        });
    }

    async findById(id) {
        return await Unit.findByPk(id);
    }

    async create(data) {
        return await Unit.create(data);
    }

    async update(id, data) {
        const unit = await Unit.findByPk(id);
        if (!unit) return null;
        return await unit.update(data);
    }

    async delete(id) {
        const unit = await Unit.findByPk(id);
        if (!unit) return null;
        await unit.destroy();
        return unit;
    }
}

class ProductImageRepository {
    async findByProductId(productId) {
        return await ProductImage.findAll({
            where: { product_id: productId },
            order: [['is_primary', 'DESC'], ['sort_order', 'ASC']]
        });
    }

    async findById(id) {
        return await ProductImage.findByPk(id);
    }

    async create(data) {
        return await ProductImage.create(data);
    }

    async createMultiple(images) {
        return await ProductImage.bulkCreate(images);
    }

    async update(id, data) {
        const image = await ProductImage.findByPk(id);
        if (!image) return null;
        return await image.update(data);
    }

    async delete(id) {
        const image = await ProductImage.findByPk(id);
        if (!image) return null;
        await image.destroy();
        return image;
    }

    async deleteByProductId(productId) {
        return await ProductImage.destroy({
            where: { product_id: productId }
        });
    }

    async setPrimaryImage(productId, imageId) {
        // Remove primary flag from all images of this product
        await ProductImage.update(
            { is_primary: false },
            { where: { product_id: productId } }
        );

        // Set the specified image as primary
        const image = await ProductImage.findByPk(imageId);
        if (image && image.product_id === productId) {
            return await image.update({ is_primary: true });
        }
        return null;
    }
}

module.exports = {
    ProductRepository: new ProductRepository(),
    CategoryRepository: new CategoryRepository(),
    UnitRepository: new UnitRepository(),
    ProductImageRepository: new ProductImageRepository()
};
